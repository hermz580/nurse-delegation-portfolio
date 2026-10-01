/**
 * Custom hook for credential verification
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface VerificationResult {
    status: 'active' | 'expired' | 'not_found' | 'error' | 'pending';
    credentialNumber?: string;
    credentialType?: string;
    verifiedAt?: string;
    expiresAt?: string;
    errorMessage?: string;
}

interface UseVerificationReturn {
    verification: VerificationResult | null;
    loading: boolean;
    error: string | null;
    verify: () => Promise<void>;
    refetch: () => Promise<void>;
}

export function useVerification(userId?: string): UseVerificationReturn {
    const [verification, setVerification] = useState<VerificationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verify = useCallback(async () => {
        if (!userId) {
            setError('No user ID provided');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`/api/certifications/verify/${userId}`);

            if (response.data.success) {
                setVerification(response.data.verification);
            } else {
                setError(response.data.error || 'Verification failed');
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err.response?.data?.error || 'Failed to verify credentials');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const refetch = useCallback(async () => {
        await verify();
    }, [verify]);

    // Auto-fetch on mount if userId is provided
    useEffect(() => {
        if (userId) {
            verify();
        }
    }, [userId, verify]);

    return {
        verification,
        loading,
        error,
        verify,
        refetch
    };
}

/**
 * Hook for public verification lookup
 */
export function usePublicVerification(verificationCode?: string) {
    const [certification, setCertification] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lookup = useCallback(async (code?: string) => {
        const codeToUse = code || verificationCode;

        if (!codeToUse) {
            setError('No verification code provided');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/certifications/verify/public/${codeToUse}`);

            if (response.data.valid) {
                setCertification(response.data.certification);
            } else {
                setError('Invalid verification code');
            }
        } catch (err: any) {
            console.error('Public verification error:', err);
            setError(err.response?.data?.error || 'Verification lookup failed');
        } finally {
            setLoading(false);
        }
    }, [verificationCode]);

    useEffect(() => {
        if (verificationCode) {
            lookup();
        }
    }, [verificationCode, lookup]);

    return {
        certification,
        loading,
        error,
        lookup
    };
}

/**
 * Hook for batch verification
 */
export function useBatchVerification() {
    const [results, setResults] = useState<Record<string, VerificationResult>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyBatch = useCallback(async (userIds: string[]) => {
        if (!userIds || userIds.length === 0) {
            setError('No user IDs provided');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/certifications/verify/batch', { userIds });

            if (response.data.success) {
                setResults(response.data.results);
            } else {
                setError(response.data.error || 'Batch verification failed');
            }
        } catch (err: any) {
            console.error('Batch verification error:', err);
            setError(err.response?.data?.error || 'Failed to verify credentials');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        results,
        loading,
        error,
        verifyBatch
    };
}
