import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  CheckCircle,
  Lock,
  Schedule,
  SignalCellularAlt,
  ArrowBack,
} from '@mui/icons-material';

const MotionCard = motion(Card);

export default function ModulesPage() {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: 'Introduction to Nurse Delegation',
      description: 'Learn the fundamentals of delegation in nursing practice',
      duration: 45,
      difficulty: 'beginner',
      progress: 100,
      status: 'completed',
      lessons: 8,
    },
    {
      id: 2,
      title: 'Legal & Regulatory Framework',
      description: 'Understanding Washington State delegation laws and regulations',
      duration: 60,
      difficulty: 'intermediate',
      progress: 100,
      status: 'completed',
      lessons: 10,
    },
    {
      id: 3,
      title: 'Delegation Fundamentals',
      description: 'Core principles and best practices for effective delegation',
      duration: 90,
      difficulty: 'intermediate',
      progress: 75,
      status: 'in_progress',
      lessons: 12,
    },
    {
      id: 4,
      title: 'Assessment & Evaluation',
      description: 'How to assess competency and evaluate delegated tasks',
      duration: 75,
      difficulty: 'intermediate',
      progress: 30,
      status: 'in_progress',
      lessons: 9,
    },
    {
      id: 5,
      title: 'Documentation Standards',
      description: 'Proper documentation practices for delegated care',
      duration: 60,
      difficulty: 'beginner',
      progress: 0,
      status: 'locked',
      lessons: 7,
    },
    {
      id: 6,
      title: 'Communication Skills',
      description: 'Effective communication strategies for delegation',
      duration: 50,
      difficulty: 'beginner',
      progress: 0,
      status: 'locked',
      lessons: 8,
    },
    {
      id: 7,
      title: 'Supervision & Monitoring',
      description: 'Ongoing supervision of delegated tasks',
      duration: 70,
      difficulty: 'advanced',
      progress: 0,
      status: 'locked',
      lessons: 11,
    },
    {
      id: 8,
      title: 'Complex Care Scenarios',
      description: 'Advanced delegation scenarios and problem-solving',
      duration: 120,
      difficulty: 'advanced',
      progress: 0,
      status: 'locked',
      lessons: 15,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#6ee7b7';
      case 'intermediate':
        return '#fbbf24';
      case 'advanced':
        return '#f472b6';
      default:
        return '#d4d4d8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle sx={{ color: '#6ee7b7' }} />;
      case 'in_progress':
        return <PlayCircle sx={{ color: '#3b82f6' }} />;
      case 'locked':
        return <Lock sx={{ color: 'rgba(255,255,255,0.3)' }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: '#0a0a0b', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
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

      {/* Header */}
      <Box sx={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        py: 3,
        mb: 4,
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => navigate('/dashboard')}
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fbbf24' } }}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #fbbf24 0%, #6ee7b7 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Training Modules
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Complete all modules to earn your certification
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: 6 }}>
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{
            mb: 4,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'white', mb: 2, fontFamily: 'Poppins, sans-serif' }}
                  >
                    Overall Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={48}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      mb: 1,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                        borderRadius: 6
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    12 of 25 modules completed (48%)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ color: '#6ee7b7' }}>
                      ✓ 2 Completed
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#3b82f6' }}>
                      ▶ 2 In Progress
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      🔒 4 Locked
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modules Grid */}
        <Grid container spacing={3}>
          {modules.map((module, index) => (
            <Grid item xs={12} md={6} key={module.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={module.status !== 'locked' ? {
                  y: -5,
                  boxShadow: '0 20px 40px rgba(251, 191, 36, 0.15)'
                } : {}}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  opacity: module.status === 'locked' ? 0.5 : 1,
                  cursor: module.status !== 'locked' ? 'pointer' : 'not-allowed',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  if (module.status !== 'locked') {
                    console.log(`Opening module ${module.id}`);
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: 'white', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}
                      >
                        {module.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {module.description}
                      </Typography>
                    </Box>
                    {getStatusIcon(module.status)}
                  </Stack>

                  {/* Progress */}
                  {module.status !== 'locked' && (
                    <Box sx={{ mb: 2 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          Progress
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#6ee7b7' }}>
                          {module.progress}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={module.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: module.status === 'completed'
                              ? 'linear-gradient(135deg, #6ee7b7 0%, #22d3ee 100%)'
                              : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Meta Info */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                    <Chip
                      label={module.difficulty}
                      size="small"
                      icon={<SignalCellularAlt sx={{ fontSize: 14 }} />}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: getDifficultyColor(module.difficulty),
                        border: `1px solid ${getDifficultyColor(module.difficulty)}30`,
                        '& .MuiChip-icon': { color: getDifficultyColor(module.difficulty) }
                      }}
                    />
                    <Chip
                      label={`${module.duration} min`}
                      size="small"
                      icon={<Schedule sx={{ fontSize: 14 }} />}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.7)',
                        '& .MuiChip-icon': { color: 'rgba(255,255,255,0.5)' }
                      }}
                    />
                    <Chip
                      label={`${module.lessons} lessons`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.7)'
                      }}
                    />
                  </Stack>

                  {/* Action Button */}
                  <motion.div whileHover={{ scale: module.status !== 'locked' ? 1.02 : 1 }}>
                    <Button
                      variant={module.status === 'completed' ? 'outlined' : 'contained'}
                      fullWidth
                      disabled={module.status === 'locked'}
                      startIcon={
                        module.status === 'completed' ? (
                          <CheckCircle />
                        ) : module.status === 'in_progress' ? (
                          <PlayCircle />
                        ) : (
                          <Lock />
                        )
                      }
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 600,
                        ...(module.status === 'completed' ? {
                          borderColor: 'rgba(110, 231, 183, 0.5)',
                          color: '#6ee7b7',
                          '&:hover': {
                            borderColor: '#6ee7b7',
                            bgcolor: 'rgba(110, 231, 183, 0.1)'
                          }
                        } : module.status === 'in_progress' ? {
                          background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                          color: '#0a0a0b',
                          boxShadow: '0 4px 15px rgba(110, 231, 183, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)'
                          }
                        } : {
                          bgcolor: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.4)'
                        })
                      }}
                    >
                      {module.status === 'completed'
                        ? 'Review Module'
                        : module.status === 'in_progress'
                          ? 'Continue Learning'
                          : 'Complete Previous Modules'}
                    </Button>
                  </motion.div>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
