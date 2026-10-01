/**
 * Verification utility functions
 */

import crypto from 'crypto';

/**
 * Parse provider name from various formats
 * Supports: "Last, First", "First Last", "Last, First Middle"
 */
export function parseProviderName(fullName: string): { firstName: string; lastName: string } {
    if (!fullName || typeof fullName !== 'string') {
        throw new Error('Invalid name format');
    }

    const trimmedName = fullName.trim();

    // Handle "Last, First" format
    if (trimmedName.includes(',')) {
        const [lastName, firstName] = trimmedName.split(',').map(s => s.trim());
        return {
            firstName: firstName.split(' ')[0], // Take only first name, ignore middle
            lastName: lastName
        };
    }

    // Handle "First Last" format
    const parts = trimmedName.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
        return {
            firstName: parts[0],
            lastName: parts[parts.length - 1]
        };
    }

    throw new Error('Unable to parse name format');
}

/**
 * Format credential number for display
 */
export function formatCredentialNumber(number: string | number): string {
    if (!number) return '';

    const numStr = String(number);

    // Format as XX-XXXXXX if 8 digits
    if (numStr.length === 8) {
        return `${numStr.slice(0, 2)}-${numStr.slice(2)}`;
    }

    return numStr;
}

/**
 * Calculate when verification should expire (30 days from now)
 */
export function calculateExpirationDate(fromDate?: Date): Date {
    const baseDate = fromDate || new Date();
    const expirationDate = new Date(baseDate);
    expirationDate.setDate(expirationDate.getDate() + 30);
    return expirationDate;
}

/**
 * Generate unique verification code for a certification
 */
export function generateVerificationCode(certificationId: string): string {
    const hash = crypto
        .createHash('sha256')
        .update(`${certificationId}-${Date.now()}`)
        .digest('hex');

    // Return first 12 characters in uppercase
    return hash.substring(0, 12).toUpperCase();
}

/**
 * Validate verification code format
 */
export function isValidVerificationCode(code: string): boolean {
    if (!code || typeof code !== 'string') return false;

    // Should be 12 uppercase alphanumeric characters
    return /^[A-Z0-9]{12}$/.test(code);
}

/**
 * Determine verification status from DOH response
 */
export function determineVerificationStatus(dohData: any): 'active' | 'expired' | 'not_found' {
    if (!dohData || !dohData.credential_status) {
        return 'not_found';
    }

    const status = dohData.credential_status.toLowerCase();

    if (status === 'active' || status === 'current') {
        return 'active';
    }

    if (status === 'expired' || status === 'inactive' || status === 'lapsed') {
        return 'expired';
    }

    return 'not_found';
}

/**
 * Sanitize name for API query
 */
export function sanitizeNameForQuery(name: string): string {
    if (!name) return '';

    return name
        .trim()
        .replace(/[^a-zA-Z\s-']/g, '') // Remove special characters except hyphen and apostrophe
        .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Check if verification is stale (older than 30 days)
 */
export function isVerificationStale(verifiedAt: Date): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return new Date(verifiedAt) < thirtyDaysAgo;
}
