/**
 * Verification Badge Component
 * Displays credential verification status with color-coded badges
 */

import React from 'react';
import { Tooltip, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

interface VerificationBadgeProps {
    status?: 'active' | 'expired' | 'not_found' | 'error' | 'pending';
    credentialNumber?: string;
    credentialType?: string;
    verifiedAt?: string;
    loading?: boolean;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
    status,
    credentialNumber,
    credentialType,
    verifiedAt,
    loading = false,
    size = 'medium',
    showLabel = true
}) => {
    // Size configurations
    const sizeConfig = {
        small: { fontSize: '12px', iconSize: 16, padding: '4px 8px' },
        medium: { fontSize: '14px', iconSize: 20, padding: '6px 12px' },
        large: { fontSize: '16px', iconSize: 24, padding: '8px 16px' }
    };

    const config = sizeConfig[size];

    // Loading state
    if (loading) {
        return (
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: config.padding,
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: config.fontSize,
                color: 'rgba(255, 255, 255, 0.7)'
            }}>
                <CircularProgress size={config.iconSize} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                {showLabel && <span>Verifying...</span>}
            </div>
        );
    }

    // No status
    if (!status) {
        return null;
    }

    // Status configurations
    const statusConfig = {
        active: {
            icon: <CheckCircleIcon sx={{ fontSize: config.iconSize }} />,
            color: '#00ff41',
            background: 'rgba(0, 255, 65, 0.1)',
            border: 'rgba(0, 255, 65, 0.3)',
            label: 'Active License',
            tooltip: `Active credential${credentialNumber ? ` #${credentialNumber}` : ''}${credentialType ? ` (${credentialType})` : ''}`
        },
        expired: {
            icon: <WarningIcon sx={{ fontSize: config.iconSize }} />,
            color: '#ffc107',
            background: 'rgba(255, 193, 7, 0.1)',
            border: 'rgba(255, 193, 7, 0.3)',
            label: 'Expired',
            tooltip: 'Credential has expired or is inactive'
        },
        not_found: {
            icon: <ErrorIcon sx={{ fontSize: config.iconSize }} />,
            color: '#ff4141',
            background: 'rgba(255, 65, 65, 0.1)',
            border: 'rgba(255, 65, 65, 0.3)',
            label: 'Not Found',
            tooltip: 'No active credential found in DOH database'
        },
        error: {
            icon: <ErrorIcon sx={{ fontSize: config.iconSize }} />,
            color: '#ff4141',
            background: 'rgba(255, 65, 65, 0.1)',
            border: 'rgba(255, 65, 65, 0.3)',
            label: 'Verification Error',
            tooltip: 'Unable to verify credential at this time'
        },
        pending: {
            icon: <WarningIcon sx={{ fontSize: config.iconSize }} />,
            color: '#ffc107',
            background: 'rgba(255, 193, 7, 0.1)',
            border: 'rgba(255, 193, 7, 0.3)',
            label: 'Pending',
            tooltip: 'Verification pending'
        }
    };

    const currentStatus = statusConfig[status];

    const tooltipContent = (
        <div style={{ padding: '4px' }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{currentStatus.label}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>{currentStatus.tooltip}</div>
            {verifiedAt && (
                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                    Verified: {new Date(verifiedAt).toLocaleDateString()}
                </div>
            )}
        </div>
    );

    return (
        <Tooltip title={tooltipContent} arrow placement="top">
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: config.padding,
                    borderRadius: '8px',
                    background: currentStatus.background,
                    border: `1px solid ${currentStatus.border}`,
                    fontSize: config.fontSize,
                    color: currentStatus.color,
                    fontWeight: 500,
                    cursor: 'help',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${currentStatus.border}`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                {/* Shimmer effect for active status */}
                {status === 'active' && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                            animation: 'shimmer 2s infinite'
                        }}
                    />
                )}

                {currentStatus.icon}

                {showLabel && (
                    <span style={{ position: 'relative', zIndex: 1 }}>
                        {currentStatus.label}
                        {status === 'active' && credentialNumber && (
                            <span style={{ marginLeft: '4px', opacity: 0.8 }}>
                                #{credentialNumber}
                            </span>
                        )}
                    </span>
                )}
            </div>
        </Tooltip>
    );
};

// Add shimmer animation to global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;
document.head.appendChild(style);

export default VerificationBadge;
