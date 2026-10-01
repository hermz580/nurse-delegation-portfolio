import { Box, Container, Typography, Chip, TextField, Button, Card, CardContent, Stack, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Search, VerifiedUser, CheckCircle, Cancel } from '@mui/icons-material';
import { useState } from 'react';

export default function VerificationPage() {
    const { code } = useParams();
    const [searchCode, setSearchCode] = useState(code || '');
    const [verificationResult, setVerificationResult] = useState<null | { valid: boolean; name?: string; credential?: string; expiry?: string }>(null);
    const [searching, setSearching] = useState(false);

    const handleVerify = async () => {
        if (!searchCode.trim()) return;
        setSearching(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock result - in production this would call the verification API
        if (searchCode.startsWith('SB-')) {
            setVerificationResult({
                valid: true,
                name: 'Sarah Johnson, RN',
                credential: searchCode,
                expiry: '2025-06-30'
            });
        } else {
            setVerificationResult({ valid: false });
        }
        setSearching(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0b', position: 'relative', overflow: 'hidden', pt: 12, pb: 8 }}>
            {/* Shimmer Background */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.08) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'shimmerBackground 8s ease infinite',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: Math.random() * 4 + 2 + 'px',
                        height: Math.random() * 4 + 2 + 'px',
                        borderRadius: '50%',
                        background: i % 2 === 0 ? '#fbbf24' : '#f5f5f0',
                        opacity: 0.3,
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        zIndex: 0
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <style>{`
                @keyframes shimmerBackground {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Chip
                            label="Credential Verification"
                            sx={{
                                bgcolor: 'rgba(251,191,36,0.1)',
                                color: '#fbbf24',
                                border: '1px solid rgba(251,191,36,0.3)',
                                mb: 2,
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        />
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 2,
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        >
                            Verify Certification
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Enter a credential ID to verify its authenticity
                        </Typography>
                    </Box>

                    {/* Search Card */}
                    <Card
                        sx={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            p: 2
                        }}
                    >
                        <CardContent>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    placeholder="Enter Credential ID (e.g., SB-2024-001234)"
                                    value={searchCode}
                                    onChange={(e) => setSearchCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VerifiedUser sx={{ color: '#fbbf24' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(251,191,36,0.5)' },
                                            '&.Mui-focused fieldset': { borderColor: '#fbbf24' }
                                        },
                                        '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)' }
                                    }}
                                />
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleVerify}
                                        disabled={searching || !searchCode.trim()}
                                        startIcon={<Search />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                            color: '#0a0a0b',
                                            '&:hover': { background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)' },
                                            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }
                                        }}
                                    >
                                        {searching ? 'Verifying...' : 'Verify Credential'}
                                    </Button>
                                </motion.div>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Result */}
                    {verificationResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card
                                sx={{
                                    mt: 4,
                                    background: verificationResult.valid
                                        ? 'rgba(110, 231, 183, 0.1)'
                                        : 'rgba(239, 68, 68, 0.1)',
                                    border: `1px solid ${verificationResult.valid ? 'rgba(110, 231, 183, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                    borderRadius: '16px'
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    {verificationResult.valid ? (
                                        <>
                                            <CheckCircle sx={{ fontSize: 64, color: '#6ee7b7', mb: 2 }} />
                                            <Typography variant="h5" sx={{ color: '#6ee7b7', fontWeight: 700, mb: 2 }}>
                                                Credential Verified
                                            </Typography>
                                            <Stack spacing={1}>
                                                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                                    {verificationResult.name}
                                                </Typography>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    Credential ID: {verificationResult.credential}
                                                </Typography>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    Valid until: {verificationResult.expiry}
                                                </Typography>
                                            </Stack>
                                        </>
                                    ) : (
                                        <>
                                            <Cancel sx={{ fontSize: 64, color: '#ef4444', mb: 2 }} />
                                            <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 700, mb: 2 }}>
                                                Invalid Credential
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                The credential ID could not be verified. Please check the ID and try again.
                                            </Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </motion.div>
            </Container>
        </Box>
    );
}
