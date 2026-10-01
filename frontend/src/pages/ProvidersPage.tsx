import { Box, Container, Typography, Grid, Card, CardContent, Chip, Stack, Button, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Description,
    School,
    Gavel,
    LocalHospital,
    People,
    CheckCircle,
    ArrowForward,
    Assignment
} from '@mui/icons-material';

const MotionCard = motion(Card);

export default function ProvidersPage() {
    const navigate = useNavigate();

    const requirements = [
        { title: 'Active WA RN License', desc: 'Current, unrestricted registered nurse license in Washington State' },
        { title: '6-Hour Orientation', desc: 'Complete DSHS-approved nurse delegation orientation training' },
        { title: 'DSHS Contract 1008XS', desc: 'Execute the standard DSHS nurse delegation contract' },
        { title: 'Background Check', desc: 'Pass required background screening through DSHS' },
    ];

    const legalFramework = [
        { code: 'RCW 18.79.260', title: 'Nurse Practice Act', link: 'https://app.leg.wa.gov/rcw/default.aspx?cite=18.79.260' },
        { code: 'WAC 246-840-910', title: 'Delegation Rules', link: 'https://app.leg.wa.gov/wac/default.aspx?cite=246-840-910' },
        { code: 'WAC 246-840-930', title: 'Delegation Standards', link: 'https://app.leg.wa.gov/wac/default.aspx?cite=246-840-930' },
    ];

    const serviceSettings = [
        { icon: '🏠', title: 'In-Home Services', desc: 'Private residences with DSHS Medicaid clients' },
        { icon: '🏡', title: 'Adult Family Homes', desc: 'Licensed AFH facilities (1-6 residents)' },
        { icon: '🏢', title: 'Assisted Living Facilities', desc: 'Licensed ALF/boarding homes' },
    ];

    const delegatablePersons = [
        'NAR (Nursing Assistant Registered)',
        'NAC (Nursing Assistant Certified)',
        'HCA-C (Home Care Aide Certified)',
        'Must have 9-hour Core Basic Training',
        'Must have Diabetes Training (if delegating insulin)',
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0b', pt: 10, pb: 8 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Chip
                        label="For Healthcare Providers"
                        sx={{
                            bgcolor: 'rgba(244,114,182,0.1)',
                            color: '#f472b6',
                            border: '1px solid rgba(244,114,182,0.3)',
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
                        Registered Nurse{' '}
                        <Box component="span" sx={{
                            background: 'linear-gradient(135deg, #f472b6 0%, #22d3ee 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            Delegation Services
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.6)" sx={{ maxWidth: 700, mx: 'auto' }}>
                        Join Washington's DSHS-contracted nurse delegation network and expand your practice
                    </Typography>
                </Box>

                {/* Requirements Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight={600} color="white" mb={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Description sx={{ color: '#22d3ee' }} />
                        DSHS Contract Requirements
                    </Typography>
                    <Grid container spacing={3}>
                        {requirements.map((req, i) => (
                            <Grid item xs={12} md={6} key={i}>
                                <MotionCard
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 2,
                                        height: '100%'
                                    }}
                                >
                                    <CardContent sx={{ display: 'flex', gap: 2 }}>
                                        <CheckCircle sx={{ color: '#6ee7b7', mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="h6" color="white" fontWeight={600}>{req.title}</Typography>
                                            <Typography variant="body2" color="rgba(255,255,255,0.6)">{req.desc}</Typography>
                                        </Box>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Legal Framework */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight={600} color="white" mb={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Gavel sx={{ color: '#fbbf24' }} />
                        Legal Framework
                    </Typography>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="body1" color="rgba(255,255,255,0.7)" mb={3}>
                                Nurse delegation in Washington State is governed by the Nurse Practice Act and specific WAC regulations
                                under NCQAC (Nursing Care Quality Assurance Commission) oversight.
                            </Typography>
                            <Stack spacing={2}>
                                {legalFramework.map((law, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 2,
                                            bgcolor: 'rgba(0,0,0,0.2)',
                                            borderRadius: 1,
                                            '&:hover': { bgcolor: 'rgba(34,211,238,0.1)' }
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="subtitle1" color="#22d3ee" fontWeight={600}>{law.code}</Typography>
                                            <Typography variant="body2" color="rgba(255,255,255,0.6)">{law.title}</Typography>
                                        </Box>
                                        <Button
                                            href={law.link}
                                            target="_blank"
                                            endIcon={<ArrowForward />}
                                            sx={{ color: 'rgba(255,255,255,0.6)' }}
                                        >
                                            View
                                        </Button>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>

                {/* Service Settings */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight={600} color="white" mb={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocalHospital sx={{ color: '#6ee7b7' }} />
                        Service Settings
                    </Typography>
                    <Grid container spacing={3}>
                        {serviceSettings.map((setting, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Card sx={{
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 2,
                                    height: '100%',
                                    textAlign: 'center',
                                    p: 3
                                }}>
                                    <Typography variant="h2" mb={2}>{setting.icon}</Typography>
                                    <Typography variant="h6" color="white" fontWeight={600} mb={1}>{setting.title}</Typography>
                                    <Typography variant="body2" color="rgba(255,255,255,0.6)">{setting.desc}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Who Can Receive Delegation */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight={600} color="white" mb={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <People sx={{ color: '#f472b6' }} />
                        Who Can Receive Delegation
                    </Typography>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="body1" color="rgba(255,255,255,0.7)" mb={3}>
                                Delegation is provided to credentialed caregivers who meet specific training requirements:
                            </Typography>
                            <List>
                                {delegatablePersons.map((person, i) => (
                                    <ListItem key={i} sx={{ py: 1 }}>
                                        <ListItemIcon>
                                            <CheckCircle sx={{ color: '#6ee7b7' }} />
                                        </ListItemIcon>
                                        <ListItemText primary={person} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>

                {/* CTA */}
                <Box sx={{ textAlign: 'center', py: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="h4" fontWeight={600} color="white" mb={2}>
                        Ready to Join the Network?
                    </Typography>
                    <Typography variant="body1" color="rgba(255,255,255,0.6)" mb={4}>
                        Create your provider profile and start accepting delegation referrals today.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/register')}
                            sx={{
                                background: 'linear-gradient(135deg, #f472b6 0%, #22d3ee 100%)',
                                color: '#0a0a0b',
                                fontWeight: 600,
                                px: 4
                            }}
                        >
                            Register as Provider
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/provider/dashboard')}
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
