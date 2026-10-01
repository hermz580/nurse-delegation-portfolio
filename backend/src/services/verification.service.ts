/**
 * Verification Service
 * Handles credential verification against WA DOH database
 */

import axios, { AxiosError } from 'axios';
import pool from '../config/database';
import {
    parseProviderName,
    sanitizeNameForQuery,
    determineVerificationStatus,
    calculateExpirationDate,
    isVerificationStale
} from '../utils/verification.utils';

const WA_DOH_API_URL = 'https://data.wa.gov/resource/qxh8-f4bd.json';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

interface DOHCredential {
    credential_number?: string;
    credential_status?: string;
    credential_type?: string;
    first_name?: string;
    last_name?: string;
    issue_date?: string;
    expiration_date?: string;
}

interface VerificationResult {
    status: 'active' | 'expired' | 'not_found' | 'error';
    credentialNumber?: string;
    credentialType?: string;
    issueDate?: string;
    expirationDate?: string;
    verifiedAt: Date;
    expiresAt: Date;
    dohResponse?: any;
    errorMessage?: string;
}

export class VerificationService {
    /**
     * Verify credential against WA DOH database
     */
    async verifyCredential(
        firstName: string,
        lastName: string,
        retryCount = 0
    ): Promise<VerificationResult> {
        try {
            const sanitizedFirstName = sanitizeNameForQuery(firstName);
            const sanitizedLastName = sanitizeNameForQuery(lastName);

            if (!sanitizedFirstName || !sanitizedLastName) {
                throw new Error('Invalid name format');
            }

            // Query WA DOH API
            const response = await axios.get<DOHCredential[]>(WA_DOH_API_URL, {
                params: {
                    first_name: sanitizedFirstName,
                    last_name: sanitizedLastName,
                    $limit: 10
                },
                timeout: 10000
            });

            const credentials = response.data;

            if (!credentials || credentials.length === 0) {
                return {
                    status: 'not_found',
                    verifiedAt: new Date(),
                    expiresAt: calculateExpirationDate(),
                    errorMessage: 'No credentials found in DOH database'
                };
            }

            // Find the most recent active credential
            const activeCredential = this.findBestCredential(credentials);

            if (!activeCredential) {
                return {
                    status: 'not_found',
                    verifiedAt: new Date(),
                    expiresAt: calculateExpirationDate(),
                    dohResponse: credentials
                };
            }

            const status = determineVerificationStatus(activeCredential);

            return {
                status,
                credentialNumber: activeCredential.credential_number,
                credentialType: activeCredential.credential_type,
                issueDate: activeCredential.issue_date,
                expirationDate: activeCredential.expiration_date,
                verifiedAt: new Date(),
                expiresAt: calculateExpirationDate(),
                dohResponse: activeCredential
            };
        } catch (error) {
            // Retry logic for network errors
            if (retryCount < MAX_RETRIES && this.isRetryableError(error)) {
                await this.delay(RETRY_DELAY_MS * (retryCount + 1));
                return this.verifyCredential(firstName, lastName, retryCount + 1);
            }

            console.error('Verification error:', error);

            return {
                status: 'error',
                verifiedAt: new Date(),
                expiresAt: calculateExpirationDate(),
                errorMessage: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Get cached verification from database
     */
    async getCachedVerification(userId: string): Promise<VerificationResult | null> {
        try {
            const result = await pool.query(
                `SELECT * FROM get_latest_verification($1)`,
                [userId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];

            // Check if verification is stale
            if (isVerificationStale(new Date(row.verified_at))) {
                return null;
            }

            return {
                status: row.verification_status,
                credentialNumber: row.credential_number,
                verifiedAt: new Date(row.verified_at),
                expiresAt: new Date(row.expires_at)
            };
        } catch (error) {
            console.error('Error fetching cached verification:', error);
            return null;
        }
    }

    /**
     * Save verification result to database
     */
    async saveVerification(
        userId: string,
        certificationId: string | null,
        result: VerificationResult
    ): Promise<void> {
        try {
            await pool.query(
                `INSERT INTO verification_logs (
          user_id,
          certification_id,
          verification_status,
          credential_number,
          credential_type,
          issue_date,
          expiration_date,
          verified_at,
          expires_at,
          doh_response,
          error_message
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    userId,
                    certificationId,
                    result.status,
                    result.credentialNumber || null,
                    result.credentialType || null,
                    result.issueDate || null,
                    result.expirationDate || null,
                    result.verifiedAt,
                    result.expiresAt,
                    result.dohResponse ? JSON.stringify(result.dohResponse) : null,
                    result.errorMessage || null
                ]
            );
        } catch (error) {
            console.error('Error saving verification:', error);
            throw error;
        }
    }

    /**
     * Verify user by ID (fetches user info and verifies)
     */
    async verifyUserById(userId: string): Promise<VerificationResult> {
        try {
            // Check cache first
            const cached = await this.getCachedVerification(userId);
            if (cached) {
                return cached;
            }

            // Fetch user info
            const userResult = await pool.query(
                `SELECT first_name, last_name, id FROM users WHERE id = $1`,
                [userId]
            );

            if (userResult.rows.length === 0) {
                throw new Error('User not found');
            }

            const user = userResult.rows[0];

            // Verify credential
            const result = await this.verifyCredential(user.first_name, user.last_name);

            // Save to database
            await this.saveVerification(userId, null, result);

            return result;
        } catch (error) {
            console.error('Error verifying user:', error);
            throw error;
        }
    }

    /**
     * Batch verify multiple users
     */
    async batchVerify(userIds: string[]): Promise<Map<string, VerificationResult>> {
        const results = new Map<string, VerificationResult>();

        for (const userId of userIds) {
            try {
                // Add delay between requests to avoid rate limiting
                await this.delay(500);

                const result = await this.verifyUserById(userId);
                results.set(userId, result);
            } catch (error) {
                console.error(`Error verifying user ${userId}:`, error);
                results.set(userId, {
                    status: 'error',
                    verifiedAt: new Date(),
                    expiresAt: calculateExpirationDate(),
                    errorMessage: 'Batch verification failed'
                });
            }
        }

        return results;
    }

    /**
     * Find the best credential from multiple results
     */
    private findBestCredential(credentials: DOHCredential[]): DOHCredential | null {
        if (!credentials || credentials.length === 0) return null;

        // Prioritize active credentials
        const active = credentials.filter(c =>
            c.credential_status?.toLowerCase() === 'active' ||
            c.credential_status?.toLowerCase() === 'current'
        );

        if (active.length > 0) {
            // Return most recent active credential
            return active.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date).getTime() : 0;
                const dateB = b.issue_date ? new Date(b.issue_date).getTime() : 0;
                return dateB - dateA;
            })[0];
        }

        // If no active, return most recent credential
        return credentials.sort((a, b) => {
            const dateA = a.issue_date ? new Date(a.issue_date).getTime() : 0;
            const dateB = b.issue_date ? new Date(b.issue_date).getTime() : 0;
            return dateB - dateA;
        })[0];
    }

    /**
     * Check if error is retryable
     */
    private isRetryableError(error: any): boolean {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            // Retry on network errors or 5xx server errors
            return !axiosError.response ||
                (axiosError.response.status >= 500 && axiosError.response.status < 600);
        }
        return false;
    }

    /**
     * Get user-friendly error message
     */
    private getErrorMessage(error: any): string {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.code === 'ECONNABORTED') {
                return 'Request timeout - please try again';
            }
            if (axiosError.response?.status === 429) {
                return 'Rate limit exceeded - please try again later';
            }
            if (axiosError.response?.status === 503) {
                return 'Service temporarily unavailable';
            }
        }
        return 'Verification service error';
    }

    /**
     * Delay helper for retries
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default new VerificationService();
