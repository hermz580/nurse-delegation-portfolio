import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, TextField, Button, Stack, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Email,
    Phone,
    LocationOn,
    Send,
    AccessTime,
    Help
} from '@mui/icons-material';

const MotionCard = motion(Card);

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Message sent! We\'ll get back to you within 24 hours.', {
            icon: '✉️',
            style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid rgba(110, 231, 183, 0.3)',
            },
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: <Email sx={{ fontSize: 24 }} />,
            title: 'Email',
            value: 'support@example.com',
            action: 'mailto:support@example.com'
        },
        {
            icon: <Phone sx={{ fontSize: 24 }} />,
            title: 'Phone',
            value: '(206) 555-0100',
            action: 'tel:+12065550100'
        },
        {
            icon: <AccessTime sx={{ fontSize: 24 }} />,
            title: 'Hours',
            value: 'Mon-Fri 8AM-5PM PST',
            action: null
        },
        {
            icon: <LocationOn sx={{ fontSize: 24 }} />,
            title: 'Location',
            value: 'Seattle, Washington',
            action: null
        }
    ];

    const faqs = [
        {
            q: 'How do I become a contracted nurse delegator?',
            a: 'Visit our Providers page for complete requirements including RN license, orientation training, and DSHS contract information.'
        },
        {
            q: 'Is there a cost to use Nurse Delegation Network?',
            a: 'No, Nurse Delegation Network is completely free for case workers and providers. We are funded through healthcare system partnerships.'
        },
        {
            q: 'How do I update my provider information?',
            a: 'Log in to your Provider Dashboard to update your profile, service areas, availability, and contact information.'
        },
        {
            q: 'I can\'t find a provider in my area. What should I do?',
            a: 'Some rural counties have limited coverage. Contact us and we\'ll help identify the nearest available RN delegator or alternatives.'
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0b', pt: 10, pb: 8 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Chip
                        label="Get In Touch"
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
                        Contact{' '}
                        <Box component="span" sx={{
                            background: 'linear-gradient(135deg, #6ee7b7 0%, #22d3ee 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            Us
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.6)" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Have questions? We're here to help case workers, providers, and healthcare organizations.
                    </Typography>
                </Box>

                <Grid container spacing={6}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <MotionCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 3
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" fontWeight={600} color="white" mb={3}>
                                    Send a Message
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        bgcolor: 'rgba(0,0,0,0.2)',
                                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#6ee7b7' }
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                                    '& .MuiInputBase-input': { color: 'white' }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        bgcolor: 'rgba(0,0,0,0.2)',
                                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#6ee7b7' }
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                                    '& .MuiInputBase-input': { color: 'white' }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Subject"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        bgcolor: 'rgba(0,0,0,0.2)',
                                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#6ee7b7' }
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                                    '& .MuiInputBase-input': { color: 'white' }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                multiline
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        bgcolor: 'rgba(0,0,0,0.2)',
                                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#6ee7b7' }
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                                    '& .MuiInputBase-input': { color: 'white' }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                startIcon={<Send />}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #6ee7b7 0%, #22d3ee 100%)',
                                                    color: '#0a0a0b',
                                                    fontWeight: 600,
                                                    px: 4,
                                                    py: 1.5
                                                }}
                                            >
                                                Send Message
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardContent>
                        </MotionCard>
                    </Grid>

                    {/* Contact Info & FAQ */}
                    <Grid item xs={12} md={5}>
                        <Stack spacing={4}>
                            {/* Contact Info Cards */}
                            <MotionCard
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 3
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} color="white" mb={3}>
                                        Contact Information
                                    </Typography>
                                    <Stack spacing={2}>
                                        {contactInfo.map((info, i) => (
                                            <Box
                                                key={i}
                                                component={info.action ? 'a' : 'div'}
                                                href={info.action || undefined}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'rgba(0,0,0,0.2)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.3s',
                                                    ...(info.action && {
                                                        cursor: 'pointer',
                                                        '&:hover': { bgcolor: 'rgba(110,231,183,0.1)' }
                                                    })
                                                }}
                                            >
                                                <Box sx={{ color: '#6ee7b7' }}>{info.icon}</Box>
                                                <Box>
                                                    <Typography variant="body2" color="rgba(255,255,255,0.5)">
                                                        {info.title}
                                                    </Typography>
                                                    <Typography variant="body1" color="white" fontWeight={500}>
                                                        {info.value}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </MotionCard>

                            {/* FAQ */}
                            <MotionCard
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 3
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                                        <Help sx={{ color: '#fbbf24' }} />
                                        <Typography variant="h6" fontWeight={600} color="white">
                                            Quick Answers
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={2} divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />}>
                                        {faqs.map((faq, i) => (
                                            <Box key={i}>
                                                <Typography variant="subtitle2" color="white" fontWeight={600} mb={0.5}>
                                                    {faq.q}
                                                </Typography>
                                                <Typography variant="body2" color="rgba(255,255,255,0.6)">
                                                    {faq.a}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </MotionCard>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
