import { Box, Container, Typography, Grid, Card, CardContent, Chip, Stack, Button, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    MenuBook,
    Gavel,
    School,
    Payment,
    Description,
    OpenInNew,
    Download
} from '@mui/icons-material';

const MotionCard = motion(Card);

export default function ResourcesPage() {

    const handleFormClick = (formNumber: string) => {
        toast('DSHS Form ' + formNumber + ' download coming soon!', {
            icon: '📄',
            style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid rgba(110, 231, 183, 0.3)',
            },
        });
    };

    const resources = [
        {
            category: 'Understanding Nurse Delegation',
            icon: <MenuBook sx={{ fontSize: 28, color: '#22d3ee' }} />,
            items: [
                {
                    title: 'What Is Nurse Delegation?',
                    description: 'DSHS overview of the nurse delegation program and its purpose',
                    link: 'https://www.dshs.wa.gov/faq/what-nurse-delegation',
                    external: true
                },
                {
                    title: 'Nurse Delegation Program Overview',
                    description: 'Complete guide to the RN delegation process in Washington',
                    link: 'https://www.dshs.wa.gov/altsa/residential-care-services/nurse-delegation-program',
                    external: true
                },
                {
                    title: 'Delegatable Nursing Tasks',
                    description: 'List of nursing tasks that can be legally delegated',
                    link: 'https://www.dshs.wa.gov/altsa/residential-care-services/delegatable-nursing-tasks',
                    external: true
                }
            ]
        },
        {
            category: 'Legal Framework',
            icon: <Gavel sx={{ fontSize: 28, color: '#fbbf24' }} />,
            items: [
                {
                    title: 'RCW 18.79.260',
                    description: 'Nurse Practice Act - Delegation authority for registered nurses',
                    link: 'https://app.leg.wa.gov/rcw/default.aspx?cite=18.79.260',
                    external: true
                },
                {
                    title: 'WAC 246-840-910',
                    description: 'Washington Administrative Code - Delegation definitions and scope',
                    link: 'https://app.leg.wa.gov/wac/default.aspx?cite=246-840-910',
                    external: true
                },
                {
                    title: 'WAC 246-840-930',
                    description: 'Standards for registered nurse delegation to unlicensed persons',
                    link: 'https://app.leg.wa.gov/wac/default.aspx?cite=246-840-930',
                    external: true
                }
            ]
        },
        {
            category: 'Training & Education',
            icon: <School sx={{ fontSize: 28, color: '#6ee7b7' }} />,
            items: [
                {
                    title: 'RN Orientation Training',
                    description: '6-hour DSHS-approved orientation class information',
                    link: 'https://www.dshs.wa.gov/altsa/residential-care-services/nurse-delegation-program-classes-rns',
                    external: true
                },
                {
                    title: 'Caregiver Core Training',
                    description: '9-hour basic training requirements for caregivers',
                    link: 'https://www.dshs.wa.gov/altsa/training/home-care-aide-certification',
                    external: true
                },
                {
                    title: 'Diabetes Specialty Training',
                    description: 'Additional training required for insulin delegation',
                    link: 'https://www.dshs.wa.gov/altsa/residential-care-services/diabetes-training',
                    external: true
                }
            ]
        },
        {
            category: 'Billing & Reimbursement',
            icon: <Payment sx={{ fontSize: 28, color: '#f472b6' }} />,
            items: [
                {
                    title: 'ProviderOne Billing Guide',
                    description: 'How to bill for nurse delegation services through Medicaid',
                    link: 'https://www.hca.wa.gov/billers-providers-partners/providerone/providerone-billing-and-resource-guide',
                    external: true
                },
                {
                    title: 'Procedure Codes',
                    description: 'CPT and HCPCS codes for delegation services',
                    link: 'https://www.hca.wa.gov/billers-providers-partners',
                    external: true
                }
            ]
        }
    ];

    const forms = [
        { number: '01-212', title: 'Nurse Delegation Referral', description: 'Request for RN delegation services' },
        { number: '10-217', title: 'Caregiver Credentials', description: 'Training and certification verification' },
        { number: '13-678', title: 'Delegation Instructions', description: 'Specific task delegation details' },
        { number: '14-484', title: 'Nursing Visit Record', description: 'Supervisory visit documentation' }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0b', pt: 10, pb: 8 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Chip
                        label="Washington State Resources"
                        sx={{
                            bgcolor: 'rgba(34,211,238,0.1)',
                            color: '#22d3ee',
                            border: '1px solid rgba(34,211,238,0.3)',
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
                        Nurse Delegation{' '}
                        <Box component="span" sx={{
                            background: 'linear-gradient(135deg, #22d3ee 0%, #6ee7b7 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            Resources
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.6)" sx={{ maxWidth: 700, mx: 'auto' }}>
                        Access official DSHS forms, training materials, legal frameworks, and billing guides
                    </Typography>
                </Box>

                {/* Resource Categories */}
                {resources.map((category, i) => (
                    <Box key={i} sx={{ mb: 6 }}>
                        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                            {category.icon}
                            <Typography variant="h5" fontWeight={600} color="white">
                                {category.category}
                            </Typography>
                        </Stack>
                        <Grid container spacing={3}>
                            {category.items.map((item, j) => (
                                <Grid item xs={12} md={4} key={j}>
                                    <MotionCard
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (i * 0.1) + (j * 0.05) }}
                                        whileHover={{ y: -4 }}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 2,
                                            height: '100%',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                borderColor: 'rgba(34,211,238,0.3)',
                                                bgcolor: 'rgba(255,255,255,0.05)'
                                            }
                                        }}
                                        onClick={() => window.open(item.link, '_blank')}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="h6" color="white" fontWeight={600} mb={1}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={2}>
                                                {item.description}
                                            </Typography>
                                            <Button
                                                size="small"
                                                endIcon={<OpenInNew fontSize="small" />}
                                                sx={{ color: '#22d3ee', p: 0 }}
                                            >
                                                Learn More
                                            </Button>
                                        </CardContent>
                                    </MotionCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}

                {/* DSHS Forms Section */}
                <Box sx={{ mt: 8 }}>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 6 }} />
                    <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                        <Description sx={{ fontSize: 28, color: '#fbbf24' }} />
                        <Typography variant="h5" fontWeight={600} color="white">
                            Quick DSHS Forms
                        </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                        {forms.map((form, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <MotionCard
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleFormClick(form.number)}
                                    sx={{
                                        bgcolor: 'rgba(251,191,36,0.05)',
                                        border: '1px solid rgba(251,191,36,0.2)',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: 'rgba(251,191,36,0.1)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography variant="h4" mb={1}>📄</Typography>
                                        <Chip
                                            label={form.number}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(251,191,36,0.2)',
                                                color: '#fbbf24',
                                                fontWeight: 600,
                                                mb: 1
                                            }}
                                        />
                                        <Typography variant="subtitle2" color="white" fontWeight={600}>
                                            {form.title}
                                        </Typography>
                                        <Typography variant="caption" color="rgba(255,255,255,0.5)">
                                            {form.description}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
