import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Button, Grid, Card, Stack } from '@mui/material';
import { Map, People, LocalHospital, Assignment, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../styles/App.css';

// Removed MotionCard - using motion.div wrapper instead for compatibility

export default function LandingPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const features = [
        {
            icon: <Map sx={{ fontSize: 48, color: '#00ffd5' }} />,
            title: 'Interactive Provider Map',
            description: 'Find DSHS-contracted nurse delegators across all 39 Washington counties with our powerful search tools.',
            action: '/map',
            actionLabel: 'Explore Map',
            image: '🗺️',
            bgGradient: 'linear-gradient(135deg, rgba(0,255,213,0.15) 0%, rgba(0,180,255,0.1) 100%)'
        },
        {
            icon: <People sx={{ fontSize: 48, color: '#ffd000' }} />,
            title: 'For Case Workers',
            description: 'Quickly connect your clients with qualified RN delegators. Track referrals and manage your caseload.',
            action: '/caseworkers',
            actionLabel: 'Case Worker Portal',
            image: '👥',
            bgGradient: 'linear-gradient(135deg, rgba(255,208,0,0.15) 0%, rgba(245,158,11,0.1) 100%)'
        },
        {
            icon: <LocalHospital sx={{ fontSize: 48, color: '#ff006e' }} />,
            title: 'For Providers',
            description: 'Join Washington\'s nurse delegation network. Manage your profile, availability, and service areas.',
            action: '/providers',
            actionLabel: 'Provider Portal',
            image: '🏥',
            bgGradient: 'linear-gradient(135deg, rgba(255,0,110,0.15) 0%, rgba(168,85,247,0.1) 100%)'
        },
        {
            icon: <Assignment sx={{ fontSize: 48, color: '#00ff88' }} />,
            title: 'Resources & Forms',
            description: 'Access DSHS forms, training materials, legal frameworks, and billing guides all in one place.',
            action: '/resources',
            actionLabel: 'View Resources',
            image: '📋',
            bgGradient: 'linear-gradient(135deg, rgba(0,255,136,0.15) 0%, rgba(34,211,238,0.1) 100%)'
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0b', position: 'relative', overflow: 'hidden' }}>
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
            {[...Array(15)].map((_, i) => (
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

            {/* Hero Section - Cinematic Auto-Animations */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(110,231,183,0.05) 50%, rgba(244,114,182,0.05) 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 6, md: 8 },
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', position: 'relative' }}>

                        {/* INTRO: Nurse Delegation Network Brand Reveal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 3, y: 50 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                scale: [3, 1.5, 1.5, 0.5],
                                y: [50, 0, 0, -200]
                            }}
                            transition={{
                                duration: 2.5,
                                delay: 0.2,
                                times: [0, 0.3, 0.7, 1],
                                ease: "easeInOut"
                            }}
                            style={{
                                position: 'absolute',
                                top: '30%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10,
                                pointerEvents: 'none'
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                {/* Pyramid */}
                                <Box sx={{
                                    width: 0,
                                    height: 0,
                                    borderLeft: '40px solid transparent',
                                    borderRight: '40px solid transparent',
                                    borderBottom: '70px solid #ffd000',
                                    filter: 'drop-shadow(0 0 30px rgba(255, 208, 0, 0.9))',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '20px',
                                        left: '-17px',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '17px solid transparent',
                                        borderRight: '17px solid transparent',
                                        borderBottom: '30px solid #00ffd5',
                                    }
                                }} />
                                {/* Nurse Delegation Network Text */}
                                <Typography
                                    sx={{
                                        fontSize: { xs: '2rem', md: '3rem' },
                                        fontWeight: 'bold',
                                        fontFamily: 'Poppins, sans-serif',
                                        color: '#ffd000',
                                        textShadow: '0 0 30px rgba(255, 208, 0, 0.8)'
                                    }}
                                >
                                    Nurse Delegation Network
                                </Typography>
                            </Box>
                        </motion.div>

                        {/* "Washington State Healthcare Network" - THE BIG EYE-CATCHER */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 4,
                                y: 150
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 2,
                                delay: 2.5,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
                                    fontWeight: 900,
                                    letterSpacing: { xs: '2px', md: '8px' },
                                    textTransform: 'uppercase',
                                    background: 'linear-gradient(90deg, #ffd000 0%, #00ffd5 30%, #ff006e 60%, #00b4ff 100%)',
                                    backgroundSize: '300% auto',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    mb: 3,
                                    fontFamily: 'Poppins, sans-serif',
                                    textShadow: '0 0 60px rgba(255, 208, 0, 0.4)',
                                    animation: 'gradientShift 4s ease-in-out infinite',
                                    '@keyframes gradientShift': {
                                        '0%, 100%': { backgroundPosition: '0% center' },
                                        '50%': { backgroundPosition: '100% center' }
                                    }
                                }}
                            >
                                Washington State<br />Healthcare Network
                            </Typography>
                        </motion.div>

                        {/* Main Title - Falls down elegantly */}
                        <Box sx={{ overflow: 'hidden', mb: 2 }}>
                            <motion.div
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 4.2,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '1.8rem', md: '2.5rem', lg: '3rem' },
                                        fontWeight: 800,
                                        color: 'white',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Find{' '}
                                    <Box component="span" sx={{
                                        background: 'linear-gradient(135deg, #ffd000 0%, #00ffd5 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent'
                                    }}>
                                        Nurse Delegators
                                    </Box>
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ y: -80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 4.6,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '1.8rem', md: '2.5rem', lg: '3rem' },
                                        fontWeight: 800,
                                        color: 'white',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Across Washington
                                </Typography>
                            </motion.div>
                        </Box>

                        {/* Description - Cascades down word by word */}
                        <motion.div
                            initial={{ y: -60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 1,
                                delay: 5.0,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'rgba(255,255,255,0.8)',
                                    mb: 2,
                                    lineHeight: 1.8,
                                    maxWidth: '700px',
                                    mx: 'auto',
                                    fontSize: { xs: '1.1rem', md: '1.3rem' }
                                }}
                            >
                                Connect with DSHS-contracted RN delegators.
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ y: -40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 1,
                                delay: 5.4,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'rgba(255,255,255,0.6)',
                                    mb: 3,
                                    lineHeight: 1.8,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', md: '1.1rem' }
                                }}
                            >
                                Search by county, specialty, and availability.
                            </Typography>
                        </motion.div>

                        {/* CTA Buttons - Fade in last */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 5.8,
                                ease: "easeOut"
                            }}
                        >
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForward />}
                                        onClick={() => navigate('/map')}
                                        sx={{
                                            background: 'linear-gradient(135deg, #ffd000 0%, #00ffd5 100%)',
                                            color: '#0a0a0b',
                                            px: 5,
                                            py: 2,
                                            fontSize: '1.2rem',
                                            fontWeight: 700,
                                            borderRadius: '16px',
                                            boxShadow: '0 15px 40px rgba(255, 208, 0, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #ffd000 0%, #00ffd5 100%)',
                                                boxShadow: '0 20px 50px rgba(255, 208, 0, 0.5)',
                                            }
                                        }}
                                    >
                                        Explore Map
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            borderColor: 'rgba(255, 208, 0, 0.4)',
                                            borderWidth: 2,
                                            color: '#ffd000',
                                            px: 5,
                                            py: 2,
                                            fontSize: '1.2rem',
                                            fontWeight: 600,
                                            borderRadius: '16px',
                                            '&:hover': {
                                                borderColor: '#ffd000',
                                                borderWidth: 2,
                                                bgcolor: 'rgba(255, 208, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </motion.div>
                            </Stack>
                        </motion.div>

                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 700,
                            color: 'white',
                            textAlign: 'center',
                            mb: 2
                        }}
                    >
                        Everything You Need
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.6)',
                            textAlign: 'center',
                            mb: 6
                        }}
                    >
                        Comprehensive tools for providers, case workers, and administrators
                    </Typography>
                </motion.div>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                style={{ height: '100%' }}
                            >
                                <Card
                                    sx={{
                                        background: feature.bgGradient,
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            border: '1px solid rgba(255,208,0,0.4)',
                                            boxShadow: '0 20px 40px rgba(255,208,0,0.15)'
                                        }
                                    }}
                                    onClick={() => navigate(feature.action)}
                                >
                                    {/* Image/Emoji Header */}
                                    <Box sx={{
                                        background: 'rgba(0,0,0,0.2)',
                                        p: 4,
                                        textAlign: 'center',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <Typography sx={{ fontSize: '64px', lineHeight: 1 }}>
                                            {feature.image}
                                        </Typography>
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            {feature.icon}
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 700
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'rgba(255,255,255,0.8)',
                                                mb: 3,
                                                flexGrow: 1,
                                                fontSize: '1.05rem',
                                                lineHeight: 1.7
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                        <Button
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                color: '#ffd000',
                                                justifyContent: 'flex-start',
                                                p: 0,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    bgcolor: 'transparent',
                                                    color: '#00ffd5'
                                                }
                                            }}
                                        >
                                            {feature.actionLabel}
                                        </Button>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(110,231,183,0.1) 100%)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    py: { xs: 8, md: 12 },
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center' }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                color: 'white',
                                mb: 3
                            }}
                        >
                            Ready to Get Started?
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                mb: 4
                            }}
                        >
                            Join Washington's nurse delegation network today
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                        color: '#0a0a0b',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 30px rgba(110, 231, 183, 0.3)'
                                    }}
                                >
                                    Create Account
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/contact')}
                                    sx={{
                                        borderColor: 'rgba(110, 231, 183, 0.3)',
                                        color: '#6ee7b7',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: '12px'
                                    }}
                                >
                                    Contact Us
                                </Button>
                            </motion.div>
                        </Stack>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
}
