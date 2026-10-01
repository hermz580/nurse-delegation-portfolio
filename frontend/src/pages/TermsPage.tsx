import { Box, Container, Typography, Chip, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

export default function TermsPage() {
    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: 'By accessing and using the Nurse Delegation Network (Nurse Delegation & Consulting) platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.'
        },
        {
            title: '2. Description of Service',
            content: 'Nurse Delegation Network provides a directory and connection platform for nurse delegators and case workers in Washington State.',
            list: [
                'Interactive map of contracted RN delegators',
                'Provider directory with search and filtering',
                'Communication tools for case workers and providers',
                'Resource links and DSHS form access'
            ]
        },
        {
            title: '3. Subscription and Payment',
            content: 'Access to Nurse Delegation Network requires an active subscription. By subscribing, you agree to:',
            list: [
                'Pay applicable subscription fees as described on our pricing page',
                'Provide accurate billing information',
                'Automatic renewal unless canceled before the billing period ends',
                'No refunds for partial billing periods'
            ]
        },
        {
            title: '4. User Accounts',
            content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:',
            list: [
                'Provide accurate and complete registration information',
                'Maintain the security of your password',
                'Notify us immediately of any unauthorized use',
                'Accept responsibility for all activities under your account'
            ]
        },
        {
            title: '5. Acceptable Use',
            content: 'You agree not to:',
            list: [
                'Use the service for any unlawful purpose',
                'Share your account credentials with others',
                'Attempt to gain unauthorized access to our systems',
                'Interfere with or disrupt the service',
                'Collect user information without consent',
                'Use automated systems to access the service without permission'
            ]
        },
        {
            title: '6. Provider Information Disclaimer',
            content: 'While we strive to maintain accurate provider information, Nurse Delegation Network does not guarantee the accuracy, completeness, or availability of any provider listing. Provider credentials should be verified independently through DSHS and the Washington State Nursing Commission.'
        },
        {
            title: '7. Limitation of Liability',
            content: 'Nurse Delegation Network shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount you paid for the service in the past twelve months.'
        },
        {
            title: '8. Changes to Terms',
            content: 'We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform. Continued use of the service after changes constitutes acceptance of the new terms.'
        },
        {
            title: '9. Termination',
            content: 'We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties, or for any other reason.'
        },
        {
            title: '10. Contact Information',
            content: 'For questions about these terms, please contact us at:',
            contact: {
                name: 'Nurse Delegation Network - Nurse Delegation & Consulting',
                email: 'support@nurse-delegation-network.example.com'
            }
        }
    ];

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

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 6 }}>
                        <Chip
                            label="Legal"
                            sx={{
                                bgcolor: 'rgba(251,191,36,0.1)',
                                color: '#fbbf24',
                                border: '1px solid rgba(251,191,36,0.3)',
                                mb: 2,
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        />
                        <Typography
                            variant="h2"
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
                            Terms of Service
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            Last updated: December 8, 2025
                        </Typography>
                    </Box>

                    {/* Content Card */}
                    <Box
                        sx={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            p: { xs: 3, md: 5 }
                        }}
                    >
                        <Stack spacing={4}>
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 600,
                                            mb: 1.5,
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                    >
                                        {section.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}
                                    >
                                        {section.content}
                                    </Typography>
                                    {section.list && (
                                        <Box component="ul" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1.5, pl: 3 }}>
                                            {section.list.map((item, idx) => (
                                                <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                                            ))}
                                        </Box>
                                    )}
                                    {section.contact && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography sx={{ color: '#6ee7b7', fontWeight: 600 }}>
                                                {section.contact.name}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Email: {section.contact.email}
                                            </Typography>
                                        </Box>
                                    )}
                                </motion.div>
                            ))}
                        </Stack>

                        {/* Footer Link */}
                        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <motion.div whileHover={{ x: 5 }}>
                                <Button
                                    component={Link}
                                    to="/privacy"
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        color: '#6ee7b7',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': { bgcolor: 'transparent', color: '#fbbf24' }
                                    }}
                                >
                                    View Privacy Policy
                                </Button>
                            </motion.div>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
