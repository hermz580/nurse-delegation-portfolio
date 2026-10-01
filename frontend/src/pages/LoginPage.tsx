import { useState } from 'react';
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
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const MotionCard = motion(Card);

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await login({ email: values.email, password: values.password });
        navigate('/dashboard');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    },
  });

  const handleForgotPassword = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResetLoading(false);
    setResetEmailSent(true);
    toast.success(`Password reset link sent to ${resetEmail}`);
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setResetEmail('');
    setResetEmailSent(false);
  };

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

      {/* Scrollable Background Text Layer */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          zIndex: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: 8,
          pb: 8,
          px: { xs: 2, md: 8 },
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(251,191,36,0.3)',
            borderRadius: '4px'
          }
        }}
      >
        <Box
          sx={{
            maxWidth: '900px',
            py: 20,
            userSelect: 'none'
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 2.2,
              color: 'rgba(255,255,255,0.08)',
              fontFamily: 'Poppins, serif',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textAlign: 'justify',
              textJustify: 'inter-word'
            }}
          >
            The Nurse Delegation Program, under Washington State law, allows caregivers (homecare workers and nursing assistants) working in certain settings to perform some basic nursing tasks—such as, but not limited to, the administration of prescription medications, oxygen or blood glucose testing—normally, under the law, performed only by licensed nurses. A registered nurse must teach and supervise the caregivers, as well as provide nursing assessments of the patient's condition. This service allows clients to remain in their community setting such as their own home, Adult Family Home, or Supported Living Agency vs. a more formal HC setting (assisted living, nursing home) even though they require a basic level of skilled nursing care.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 2.2,
              color: 'rgba(255,255,255,0.08)',
              fontFamily: 'Poppins, serif',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textAlign: 'justify',
              textJustify: 'inter-word',
              mt: 4
            }}
          >
            Delegation is specific to each client's needs. Delegation of the client's nursing tasks is also specific for each caregiver and nurse (delegation is non-transferrable between different clients or delegating nurses)—unless client's ongoing delegation is "assumed" by another nurse delegator. Delegation is specific to the nurse, because the caregivers work under the delegating nurse's license. These services ensure the quality of care being provided to clients by caregivers, and the competency of those caregivers in the community setting to do these tasks. Without these delegation services, the caregivers cannot, by law, perform the skilled nursing tasks the client's condition may require.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 2.2,
              color: 'rgba(255,255,255,0.08)',
              fontFamily: 'Poppins, serif',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textAlign: 'justify',
              textJustify: 'inter-word',
              mt: 4
            }}
          >
            In order for a client to qualify for delegation, the client must be either: Unable to physically complete the task themselves, or Cognitively unaware of the need for/understanding of the task. These services are covered by DSHS Medicaid, but are not, however, covered by Medicare or most HC insurance policies.
          </Typography>
          {/* Repeat for scroll depth */}
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 2.2,
              color: 'rgba(255,255,255,0.05)',
              fontFamily: 'Poppins, serif',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textAlign: 'justify',
              textJustify: 'inter-word',
              mt: 8
            }}
          >
            The Nurse Delegation Program, under Washington State law, allows caregivers (homecare workers and nursing assistants) working in certain settings to perform some basic nursing tasks—such as, but not limited to, the administration of prescription medications, oxygen or blood glucose testing—normally, under the law, performed only by licensed nurses. A registered nurse must teach and supervise the caregivers, as well as provide nursing assessments of the patient's condition.
          </Typography>
        </Box>
      </Box>

      <style>{`
        @keyframes shimmerBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{
            scale: 1.02,
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
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h4"
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
                  {t('auth.loginTitle')}
                </Typography>
              </motion.div>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('auth.loginSubtitle')}
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#fbbf24' }} />
                        </InputAdornment>
                      ),
                    }}
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

                <motion.div whileFocus={{ scale: 1.02 }}>
                  <TextField
                    fullWidth
                    label={t('auth.password')}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#fbbf24' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={formik.isSubmitting}
                    sx={{
                      py: 1.5,
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
                    {formik.isSubmitting ? t('common.loading') : t('common.signIn')}
                  </Button>
                </motion.div>
              </Stack>
            </form>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }} gutterBottom>
                {t('auth.noAccount')}{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: '#fbbf24',
                    '&:hover': { color: '#6ee7b7' }
                  }}
                >
                  {t('landing.createAccount')}
                </Link>
              </Typography>

              <Link
                component="button"
                variant="body2"
                onClick={() => setForgotPasswordOpen(true)}
                sx={{
                  mt: 1,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': { color: '#fbbf24' }
                }}
              >
                {t('auth.forgotPassword')}
              </Link>
            </Box>

            {/* Back to Home */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                component={RouterLink}
                to="/"
                sx={{
                  textTransform: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  '&:hover': { color: '#fbbf24' }
                }}
              >
                ← Back to Home
              </Button>
            </Box>
          </CardContent>
        </MotionCard>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins, sans-serif' }}>
            {resetEmailSent ? '📧 Check Your Email' : '🔐 Reset Password'}
          </Typography>
          <IconButton onClick={handleCloseForgotPassword} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {resetEmailSent ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>✅</Typography>
              <Typography variant="body1" gutterBottom>
                We've sent a password reset link to:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fbbf24', mb: 2 }}>
                {resetEmail}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Check your inbox and follow the link to reset your password.
                If you don't see it, check your spam folder.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ py: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              <TextField
                autoFocus
                fullWidth
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#fbbf24' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {resetEmailSent ? (
            <Button
              fullWidth
              variant="contained"
              onClick={handleCloseForgotPassword}
              sx={{
                background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                color: '#0a0a0b',
                '&:hover': { background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)' }
              }}
            >
              Back to Login
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseForgotPassword}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                sx={{
                  background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                  color: '#0a0a0b',
                  '&:hover': { background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)' }
                }}
              >
                {resetLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
