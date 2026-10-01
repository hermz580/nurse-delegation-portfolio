import { Box, Container, Typography, Chip, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

export default function PrivacyPage() {
    const sections = [
        {
            title: '1. Introduction',
            content: 'Nurse Delegation Network (Nurse Delegation & Consulting) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.'
        },
        {
            title: '2. Information We Collect',
            content: '',
            subsections: [
                {
                    subtitle: 'Personal Information',
                    text: 'We collect information you provide directly, including:',
                    list: [
                        'Name and email address',
                        'Account credentials',
                        'Professional license information (for providers)',
                        'Organization affiliation',
                        'Payment and billing information'
                    ]
                },
                {
                    subtitle: 'Automatically Collected Information',
                    text: 'When you access our platform, we automatically collect:',
                    list: [
                        'IP address and device information',
                        'Browser type and version',
                        'Usage patterns and preferences',
                        'Referring website addresses'
                    ]
                }
            ]
        },
        {
            title: '3. How We Use Your Information',
            content: 'We use collected information to:',
            list: [
                'Provide and maintain our services',
                'Process your subscription and payments',
                'Send service-related communications',
                'Improve and personalize user experience',
                'Ensure platform security and prevent fraud',
                'Comply with legal obligations',
                'Respond to your requests and inquiries'
            ]
        },
        {
            title: '4. Information Sharing',
            content: 'We may share your information with:',
            list: [
                'Service Providers: Third parties who assist in operating our platform',
                'Legal Requirements: When required by law or to protect our rights',
                'Business Transfers: In connection with a merger, acquisition, or sale',
                'With Your Consent: When you have given us permission'
            ],
            note: 'We do not sell your personal information to third parties.'
        },
        {
            title: '5. Data Security',
            content: 'We implement appropriate technical and organizational security measures to protect your personal information, including:',
            list: [
                'Encryption of data in transit and at rest',
                'Regular security assessments',
                'Access controls and authentication',
                'Secure payment processing via Stripe'
            ],
            note: 'However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.'
        },
        {
            title: '6. Your Rights',
            content: 'Depending on your location, you may have the right to:',
            list: [
                'Access the personal information we hold about you',
                'Correct inaccurate information',
                'Request deletion of your information',
                'Object to or restrict processing',
                'Data portability',
                'Withdraw consent'
            ]
        },
        {
            title: '7. Cookies and Tracking',
            content: 'We use cookies and similar tracking technologies to enhance your experience. Types of cookies we use include:',
            list: [
                'Essential Cookies: Required for the platform to function',
                'Functionality Cookies: Remember your preferences',
                'Analytics Cookies: Help us understand how the platform is used'
            ]
        },
        {
            title: '8. Data Retention',
            content: 'We retain your personal information for as long as your account is active or as needed to provide services. We may retain certain information for legal, accounting, or business purposes even after account deletion.'
        },
        {
            title: '9. Children\'s Privacy',
            content: 'Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.'
        },
        {
            title: '10. Changes to This Policy',
            content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the platform. The updated policy will be effective when posted.'
        },
        {
            title: '11. Contact Us',
            content: 'If you have questions about this Privacy Policy or our practices, please contact us at:',
            contact: {
                name: 'Nurse Delegation Network - Nurse Delegation & Consulting',
                email: 'privacy@nurse-delegation-network.example.com'
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
                            Privacy Policy
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

                                    {section.content && (
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}
                                        >
                                            {section.content}
                                        </Typography>
                                    )}

                                    {section.subsections && section.subsections.map((sub, subIdx) => (
                                        <Box key={subIdx} sx={{ mt: 2 }}>
                                            <Typography
                                                sx={{ color: '#6ee7b7', fontWeight: 600, fontSize: '1rem', mb: 1 }}
                                            >
                                                {sub.subtitle}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                                                {sub.text}
                                            </Typography>
                                            <Box component="ul" sx={{ color: 'rgba(255,255,255,0.7)', pl: 3 }}>
                                                {sub.list.map((item, idx) => (
                                                    <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                                                ))}
                                            </Box>
                                        </Box>
                                    ))}

                                    {section.list && (
                                        <Box component="ul" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1.5, pl: 3 }}>
                                            {section.list.map((item, idx) => (
                                                <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                                            ))}
                                        </Box>
                                    )}

                                    {section.note && (
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 2, fontStyle: 'italic' }}>
                                            {section.note}
                                        </Typography>
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
                                    to="/terms"
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        color: '#6ee7b7',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': { bgcolor: 'transparent', color: '#fbbf24' }
                                    }}
                                >
                                    View Terms of Service
                                </Button>
                            </motion.div>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
