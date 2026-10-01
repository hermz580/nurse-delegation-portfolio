import { Box, Container, Typography, Grid, Card, CardContent, Chip, Stack, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Assignment,
    MedicalServices,
    SupervisorAccount,
    ArrowForward,
    Map
} from '@mui/icons-material';

const MotionCard = motion(Card);

export default function CaseworkersPage() {
    const navigate = useNavigate();

    const workflow = [
        {
            step: 1,
            title: 'Search Nurse Delegation Network Directory',
            description: 'Use our interactive map to find DSHS-contracted RN delegators by county, specialty, and availability.',
            icon: <Search sx={{ fontSize: 32 }} />
        },
        {
            step: 2,
            title: 'Submit Referral Form',
            description: 'Complete DSHS Form 01-212 with client information and the specific nursing tasks requiring delegation.',
            icon: <Assignment sx={{ fontSize: 32 }} />
        },
        {
            step: 3,
            title: 'RN Evaluation & Training',
            description: 'The RN delegator assesses the client\'s condition and provides hands-on training to the assigned caregiver.',
            icon: <MedicalServices sx={{ fontSize: 32 }} />
        },
        {
            step: 4,
            title: 'Ongoing Supervision',
            description: 'The RN provides required supervisory visits (typically every 90 days) and is available for consultation.',
            icon: <SupervisorAccount sx={{ fontSize: 32 }} />
        }
    ];

    const stats = [
        { value: '288+', label: 'Contracted RNs', color: '#22d3ee' },
        { value: '39', label: 'Counties Covered', color: '#6ee7b7' },
        { value: '24/7', label: 'Directory Access', color: '#f472b6' },
        { value: '100%', label: 'Free to Use', color: '#fbbf24' }
    ];

    const tips = [
        {
            title: 'Finding Providers Quickly',
            tips: [
                'Use the "Near Me" feature to find providers closest to your client',
                'Filter by "Accepting New Clients" to see available RNs',
                'Check specialty filters for specific delegation needs (insulin, G-tube, etc.)'
            ]
        },
        {
            title: 'Preparing Referrals',
            tips: [
                'Have DSHS Form 01-212 ready with complete client information',
                'Include specific nursing tasks that need delegation',
                'Note any language preferences for the client or caregiver'
            ]
        },
        {
            title: 'Managing Your Caseload',
            tips: [
                'Save frequently-used providers to your favorites list',
                'Use the share feature to send provider info to colleagues',
                'Track delegation status through your dashboard'
            ]
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0b', pt: 10, pb: 8 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Chip
                        label="For Case Workers"
                        sx={{
                            bgcolor: 'rgba(110,231,183,0.1)',
                            color: '#6ee7b7',
                            border: '1px solid rgba(110,231,183,0.3)',
                            mb: 3
                        }}
                    />
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 700,
                            color: 'white',
                            mb: 2
                        }}
                    >
                        Finding{' '}
                        <Box component="span" sx={{
                            background: 'linear-gradient(135deg, #6ee7b7 0%, #22d3ee 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            Nurse Delegators
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.6)" sx={{ maxWidth: 700, mx: 'auto' }}>
                        Connect your clients with qualified RN delegators across Washington State
                    </Typography>
                </Box>

                {/* Quick Stats */}
                <Grid container spacing={3} sx={{ mb: 8 }}>
                    {stats.map((stat, i) => (
                        <Grid item xs={6} md={3} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Paper
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h3" fontWeight={700} sx={{ color: stat.color }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                        {stat.label}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Referral Workflow */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight={600} color="white" mb={4}>
                        Referral Workflow
                    </Typography>
                    <Grid container spacing={3}>
                        {workflow.map((step, i) => (
                            <Grid item xs={12} md={6} key={i}>
                                <MotionCard
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 2,
                                        height: '100%'
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack direction="row" spacing={3} alignItems="flex-start">
                                            <Box
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 2,
                                                    background: 'linear-gradient(135deg, rgba(110,231,183,0.2) 0%, rgba(34,211,238,0.2) 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#6ee7b7',
                                                    flexShrink: 0
                                                }}
                                            >
                                                {step.icon}
                                            </Box>
                                            <Box>
                                                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                                    <Chip
                                                        label={`Step ${step.step}`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(110,231,183,0.2)',
                                                            color: '#6ee7b7',
                                                            height: 24
                                                        }}
                                                    />
                                                </Stack>
                                                <Typography variant="h6" color="white" fontWeight={600} mb={1}>
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                                    {step.description}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Tips & Best Practices */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight={600} color="white" mb={4}>
                        Tips & Best Practices
                    </Typography>
                    <Grid container spacing={3}>
                        {tips.map((section, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Card
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 2,
                                        height: '100%'
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" color="white" fontWeight={600} mb={2}>
                                            {section.title}
                                        </Typography>
                                        <Stack spacing={1.5}>
                                            {section.tips.map((tip, j) => (
                                                <Stack key={j} direction="row" spacing={1.5} alignItems="flex-start">
                                                    <Box
                                                        sx={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: '50%',
                                                            bgcolor: '#6ee7b7',
                                                            mt: 1,
                                                            flexShrink: 0
                                                        }}
                                                    />
                                                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                        {tip}
                                                    </Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* CTA */}
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 6,
                        px: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(110,231,183,0.1) 0%, rgba(34,211,238,0.05) 100%)',
                        border: '1px solid rgba(110,231,183,0.2)'
                    }}
                >
                    <Map sx={{ fontSize: 48, color: '#6ee7b7', mb: 2 }} />
                    <Typography variant="h4" fontWeight={600} color="white" mb={2}>
                        Ready to Find Providers?
                    </Typography>
                    <Typography variant="body1" color="rgba(255,255,255,0.6)" mb={4} sx={{ maxWidth: 500, mx: 'auto' }}>
                        Access our interactive map to search for nurse delegators by location, specialty, and availability.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/map')}
                            startIcon={<Search />}
                            sx={{
                                background: 'linear-gradient(135deg, #6ee7b7 0%, #22d3ee 100%)',
                                color: '#0a0a0b',
                                fontWeight: 600,
                                px: 4
                            }}
                        >
                            Open Provider Map
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                px: 4
                            }}
                        >
                            Go to Dashboard
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
