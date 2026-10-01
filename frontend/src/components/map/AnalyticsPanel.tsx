import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Collapse,
    Stack,
    Chip,
    LinearProgress,
    Tooltip
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    Warning,
    CheckCircle,
    TrendingUp,
    Download,
    LocationOn
} from '@mui/icons-material';
import type { CoverageStats } from '../../hooks/useCoverageStats';
import { getCoverageLabel } from './CoverageLayer';

interface AnalyticsPanelProps {
    stats: CoverageStats;
    onCountySelect?: (county: string) => void;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ stats, onCountySelect }) => {
    const [expanded, setExpanded] = useState(true);
    const [showAllUnderserved, setShowAllUnderserved] = useState(false);

    // Export coverage data as CSV
    const exportReport = () => {
        const headers = ['County', 'Provider Count', 'Status'];
        const rows = Object.entries(stats.countyCounts)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([county, count]) => {
                const { label } = getCoverageLabel(count);
                return `"${county}",${count},"${label}"`;
            });

        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nurse_delegation_coverage_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const displayedUnderserved = showAllUnderserved
        ? stats.underservedCounties
        : stats.underservedCounties.slice(0, 5);

    return (
        <Paper
            elevation={4}
            sx={{
                bgcolor: 'rgba(30, 30, 30, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '2px solid #FFD700',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(255, 215, 0, 0.25)'
            }}
        >
            {/* Header */}
            <Box
                onClick={() => setExpanded(!expanded)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    cursor: 'pointer',
                    bgcolor: 'rgba(255, 215, 0, 0.15)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                    '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.25)' }
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUp sx={{ color: '#FFD700', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                        Coverage Analytics
                    </Typography>
                    {stats.criticalGaps.length > 0 && (
                        <Chip
                            icon={<Warning sx={{ fontSize: 14, color: '#dc2626 !important' }} />}
                            label={`${stats.criticalGaps.length} gaps`}
                            size="small"
                            sx={{
                                height: 20,
                                bgcolor: 'rgba(220, 38, 38, 0.2)',
                                color: '#fca5a5',
                                fontSize: '0.65rem',
                                '& .MuiChip-icon': { ml: 0.5 }
                            }}
                        />
                    )}
                </Stack>
                {expanded ? (
                    <ExpandLess sx={{ color: 'rgba(255,255,255,0.5)' }} />
                ) : (
                    <ExpandMore sx={{ color: 'rgba(255,255,255,0.5)' }} />
                )}
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ p: 2 }}>
                    {/* Statistics Grid */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 1.5,
                        mb: 2
                    }}>
                        <StatCard
                            label="Total Providers"
                            value={stats.totalProviders.toString()}
                            color="#22d3ee"
                        />
                        <StatCard
                            label="Counties Covered"
                            value={`${stats.countiesCovered}/${stats.totalCounties}`}
                            subtitle={`${stats.coveragePercentage}%`}
                            color="#10b981"
                        />
                        <StatCard
                            label="Avg per County"
                            value={stats.averagePerCounty.toString()}
                            color="#8b5cf6"
                        />
                        <StatCard
                            label="Coverage Gaps"
                            value={stats.criticalGaps.length.toString()}
                            color={stats.criticalGaps.length > 0 ? '#dc2626' : '#10b981'}
                            flash={stats.criticalGaps.length > 0}
                        />
                    </Box>

                    {/* Coverage Progress Bar */}
                    <Box sx={{ mb: 2 }}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" color="rgba(255,255,255,0.6)">
                                State Coverage
                            </Typography>
                            <Typography variant="caption" color="#22d3ee" fontWeight="bold">
                                {stats.coveragePercentage}%
                            </Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={stats.coveragePercentage}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: stats.coveragePercentage >= 90 ? '#10b981' :
                                        stats.coveragePercentage >= 70 ? '#d97706' : '#dc2626',
                                    borderRadius: 4
                                }
                            }}
                        />
                    </Box>

                    {/* Underserved Counties */}
                    {stats.underservedCounties.length > 0 && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                <Warning sx={{ color: '#f97316', fontSize: 16 }} />
                                <Typography variant="caption" color="white" fontWeight="bold">
                                    Underserved Counties ({stats.underservedCounties.length})
                                </Typography>
                            </Stack>

                            <Stack spacing={0.5}>
                                {displayedUnderserved.map(({ county, count }) => (
                                    <CountyRow
                                        key={county}
                                        county={county}
                                        count={count}
                                        onClick={() => onCountySelect?.(county)}
                                    />
                                ))}
                            </Stack>

                            {stats.underservedCounties.length > 5 && (
                                <Button
                                    size="small"
                                    onClick={() => setShowAllUnderserved(!showAllUnderserved)}
                                    sx={{ color: '#22d3ee', mt: 1, fontSize: '0.7rem' }}
                                >
                                    {showAllUnderserved ? 'Show Less' : `+${stats.underservedCounties.length - 5} More`}
                                </Button>
                            )}
                        </Box>
                    )}

                    {/* Well Served Counties (Top 3) */}
                    {stats.wellServedCounties.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                                <Typography variant="caption" color="white" fontWeight="bold">
                                    Best Coverage
                                </Typography>
                            </Stack>
                            <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                {stats.wellServedCounties.slice(0, 3).map(({ county, count }) => (
                                    <Chip
                                        key={county}
                                        label={`${county} (${count})`}
                                        size="small"
                                        onClick={() => onCountySelect?.(county)}
                                        sx={{
                                            height: 22,
                                            fontSize: '0.65rem',
                                            bgcolor: 'rgba(16, 185, 129, 0.2)',
                                            color: '#6ee7b7',
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.3)' }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Export Button */}
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={exportReport}
                        sx={{
                            mt: 2,
                            borderColor: 'rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.75rem',
                            '&:hover': {
                                borderColor: '#22d3ee',
                                bgcolor: 'rgba(34, 211, 238, 0.1)'
                            }
                        }}
                    >
                        Export Coverage Report
                    </Button>
                </Box>
            </Collapse>
        </Paper>
    );
};

// Stat Card Component
interface StatCardProps {
    label: string;
    value: string;
    subtitle?: string;
    color: string;
    flash?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtitle, color, flash }) => (
    <Box sx={{
        p: 1.5,
        bgcolor: 'rgba(255,255,255,0.03)',
        borderRadius: 1,
        border: `1px solid ${flash ? color : 'rgba(255,255,255,0.05)'}`,
        animation: flash ? 'stat-pulse 2s infinite' : 'none',
        '@keyframes stat-pulse': {
            '0%, 100%': { borderColor: color, boxShadow: `0 0 8px ${color}40` },
            '50%': { borderColor: 'rgba(255,255,255,0.1)', boxShadow: 'none' }
        }
    }}>
        <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ fontSize: '0.65rem' }}>
            {label}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography variant="h6" color={color} fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                {value}
            </Typography>
            {subtitle && (
                <Typography variant="caption" color={color} sx={{ opacity: 0.7 }}>
                    {subtitle}
                </Typography>
            )}
        </Stack>
    </Box>
);

// County Row Component
interface CountyRowProps {
    county: string;
    count: number;
    onClick: () => void;
}

const CountyRow: React.FC<CountyRowProps> = ({ county, count, onClick }) => {
    const isCritical = count === 0;
    const { color } = getCoverageLabel(count);

    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                bgcolor: isCritical ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255,255,255,0.02)',
                borderRadius: 1,
                border: `1px solid ${isCritical ? 'rgba(220, 38, 38, 0.3)' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                animation: isCritical ? 'row-pulse 2s infinite' : 'none',
                '@keyframes row-pulse': {
                    '0%, 100%': { bgcolor: 'rgba(220, 38, 38, 0.15)' },
                    '50%': { bgcolor: 'rgba(220, 38, 38, 0.05)' }
                },
                '&:hover': {
                    bgcolor: isCritical ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255,255,255,0.05)',
                    borderColor: '#22d3ee'
                }
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: color,
                    animation: isCritical ? 'dot-pulse 1s infinite' : 'none',
                    '@keyframes dot-pulse': {
                        '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                        '50%': { transform: 'scale(1.5)', opacity: 0.5 }
                    }
                }} />
                <Typography variant="body2" color="white" sx={{ fontSize: '0.8rem' }}>
                    {county}
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography
                    variant="caption"
                    sx={{
                        color: color,
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                    }}
                >
                    {count} {count === 1 ? 'provider' : 'providers'}
                </Typography>
                <Tooltip title="Zoom to county">
                    <LocationOn sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }} />
                </Tooltip>
            </Stack>
        </Box>
    );
};

export default AnalyticsPanel;
