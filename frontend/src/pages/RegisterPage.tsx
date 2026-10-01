import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Link,
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const MotionCard = motion(Card);

const validationSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password should be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain one uppercase, one lowercase and one number')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    role: yup.string().required('Role is required'),
    licenseType: yup.string().when('role', {
        is: 'provider',
        then: (schema) => schema.required('License type is required'),
    }),
    licenseNumber: yup.string().when('role', {
        is: 'provider',
        then: (schema) => schema.required('License number is required'),
    }),
    agreeToTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'caregiver',
            licenseType: 'RN',
            licenseNumber: '',
            agreeToTerms: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await register({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                    licenseType: values.role === 'provider' ? values.licenseType : undefined,
                    licenseNumber: values.role === 'provider' ? values.licenseNumber : undefined,
                });
                navigate('/dashboard');
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
            }
        },
    });

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 50%, #0a0a0b 100%)',
                py: 4,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
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
            {[...Array(10)].map((_, i) => (
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
                <MotionCard
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.3 }
                    }}
                    sx={{
                        borderRadius: 3,
                        boxShadow: '0 25px 50px -12px rgba(251, 191, 36, 0.25)',
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Typography
                                    variant="h3"
                                    fontWeight="800"
                                    gutterBottom
                                    sx={{
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #6ee7b7 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        fontFamily: 'Poppins, sans-serif'
                                    }}
                                >
                                    {t('auth.registerTitle')}
                                </Typography>
                            </motion.div>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {t('auth.registerSubtitle')}
                            </Typography>
                        </Box>

                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Personal Info */}
                                <Grid item xs={12} md={6}>
                                    <motion.div whileFocus={{ scale: 1.02 }}>
                                        <TextField
                                            fullWidth
                                            label={t('auth.firstName')}
                                            name="firstName"
                                            value={formik.values.firstName}
                                            onChange={formik.handleChange}
                                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                            helperText={formik.touched.firstName && formik.errors.firstName}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                                                    }
                                                }
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <motion.div whileFocus={{ scale: 1.02 }}>
                                        <TextField
                                            fullWidth
                                            label={t('auth.lastName')}
                                            name="lastName"
                                            value={formik.values.lastName}
                                            onChange={formik.handleChange}
                                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                            helperText={formik.touched.lastName && formik.errors.lastName}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                                                    }
                                                }
                                            }}
                                        />
                                    </motion.div>
                                </Grid>

                                <Grid item xs={12}>
                                    <motion.div whileFocus={{ scale: 1.02 }}>
                                        <TextField
                                            fullWidth
                                            label={t('auth.email')}
                                            name="email"
                                            type="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                                                    }
                                                }
                                            }}
                                        />
                                    </motion.div>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <motion.div whileFocus={{ scale: 1.02 }}>
                                        <TextField
                                            fullWidth
                                            label={t('auth.password')}
                                            name="password"
                                            type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            error={formik.touched.password && Boolean(formik.errors.password)}
                                            helperText={formik.touched.password && formik.errors.password}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                                                    }
                                                }
                                            }}
                                        />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <motion.div whileFocus={{ scale: 1.02 }}>
                                        <TextField
                                            fullWidth
                                            label={t('auth.confirmPassword')}
                                            name="confirmPassword"
                                            type="password"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                                                    }
                                                }
                                            }}
                                        />
                                    </motion.div>
                                </Grid>

                                {/* Role Selection */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label={t('auth.role')}
                                        name="role"
                                        value={formik.values.role}
                                        onChange={formik.handleChange}
                                        error={formik.touched.role && Boolean(formik.errors.role)}
                                        helperText={formik.touched.role && formik.errors.role}
                                    >
                                        <MenuItem value="caregiver">{t('auth.roleProvider')}</MenuItem>
                                        <MenuItem value="provider">{t('auth.roleDelegator')}</MenuItem>
                                    </TextField>
                                </Grid>

                                {/* Conditional Provider Fields */}
                                {formik.values.role === 'provider' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="License Type"
                                                name="licenseType"
                                                value={formik.values.licenseType}
                                                onChange={formik.handleChange}
                                                error={formik.touched.licenseType && Boolean(formik.errors.licenseType)}
                                                helperText={formik.touched.licenseType && formik.errors.licenseType}
                                            >
                                                <MenuItem value="RN">Registered Nurse (RN)</MenuItem>
                                                <MenuItem value="LPN">Licensed Practical Nurse (LPN)</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="WA State License Number"
                                                name="licenseNumber"
                                                value={formik.values.licenseNumber}
                                                onChange={formik.handleChange}
                                                error={formik.touched.licenseNumber && Boolean(formik.errors.licenseNumber)}
                                                helperText={formik.touched.licenseNumber && formik.errors.licenseNumber}
                                            />
                                        </Grid>
                                    </>
                                )}

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="agreeToTerms"
                                                checked={formik.values.agreeToTerms}
                                                onChange={formik.handleChange}
                                                sx={{
                                                    color: '#fbbf24',
                                                    '&.Mui-checked': {
                                                        color: '#fbbf24',
                                                    }
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                I agree to the{' '}
                                                <Link component={RouterLink} to="/terms" sx={{ color: '#fbbf24' }}>Terms of Service</Link>
                                                {' '}and{' '}
                                                <Link component={RouterLink} to="/privacy" sx={{ color: '#fbbf24' }}>Privacy Policy</Link>
                                            </Typography>
                                        }
                                    />
                                    {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                                        <Typography variant="caption" color="error" display="block">
                                            {formik.errors.agreeToTerms}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            disabled={formik.isSubmitting}
                                            sx={{
                                                py: 2,
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                                color: '#0a0a0b',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 30px rgba(110, 231, 183, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                                }
                                            }}
                                        >
                                            {formik.isSubmitting ? t('common.loading') : t('auth.startFreeTrial')}
                                        </Button>
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </form>

                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {t('auth.hasAccount')}{' '}
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    sx={{
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                        color: '#fbbf24',
                                        '&:hover': { color: '#6ee7b7' }
                                    }}
                                >
                                    {t('common.signIn')}
                                </Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </MotionCard>
            </Container>
        </Box>
    );
}
