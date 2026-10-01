import { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent,
  LinearProgress, Chip, Button, Avatar, IconButton, Tabs, Tab,
  List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import {
  Assignment, CheckCircle, Schedule, PlayArrow, Lock,
  Timer, TrendingUp, Star, EmojiEvents, ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // minutes
  questions: number;
  passingScore: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  score?: number;
  completedAt?: string;
  attempts: number;
  maxAttempts: number;
}

const mockAssessments: Assessment[] = [
  {
    id: '1',
    title: 'Medication Administration Fundamentals',
    description: 'Core knowledge assessment covering medication types, routes, and safety protocols.',
    category: 'Core Competency',
    duration: 45,
    questions: 30,
    passingScore: 80,
    status: 'completed',
    score: 92,
    completedAt: '2024-01-15',
    attempts: 1,
    maxAttempts: 3
  },
  {
    id: '2',
    title: 'Blood Glucose Monitoring',
    description: 'Assessment on proper blood glucose testing procedures and documentation.',
    category: 'Clinical Skills',
    duration: 30,
    questions: 20,
    passingScore: 85,
    status: 'completed',
    score: 88,
    completedAt: '2024-01-20',
    attempts: 2,
    maxAttempts: 3
  },
  {
    id: '3',
    title: 'Insulin Administration',
    description: 'Comprehensive assessment on insulin types, dosing, and injection techniques.',
    category: 'Clinical Skills',
    duration: 40,
    questions: 25,
    passingScore: 90,
    status: 'in-progress',
    attempts: 0,
    maxAttempts: 3
  },
  {
    id: '4',
    title: 'Wound Care & Dressing Changes',
    description: 'Non-sterile wound care procedures, dressing selection, and documentation.',
    category: 'Clinical Skills',
    duration: 35,
    questions: 22,
    passingScore: 85,
    status: 'available',
    attempts: 0,
    maxAttempts: 3
  },
  {
    id: '5',
    title: 'Oxygen Therapy Management',
    description: 'Safe oxygen administration, equipment use, and monitoring requirements.',
    category: 'Advanced Skills',
    duration: 30,
    questions: 18,
    passingScore: 85,
    status: 'available',
    attempts: 0,
    maxAttempts: 3
  },
  {
    id: '6',
    title: 'Emergency Response Protocols',
    description: 'Emergency situation recognition, response procedures, and documentation.',
    category: 'Safety',
    duration: 25,
    questions: 15,
    passingScore: 90,
    status: 'locked',
    attempts: 0,
    maxAttempts: 3
  },
];

export default function AssessmentsPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const completedCount = mockAssessments.filter(a => a.status === 'completed').length;
  const averageScore = mockAssessments
    .filter(a => a.score)
    .reduce((acc, a) => acc + (a.score || 0), 0) / completedCount || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'available': return '#3b82f6';
      case 'locked': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'available': return 'Available';
      case 'locked': return 'Locked';
      default: return status;
    }
  };

  const filteredAssessments = tabValue === 0
    ? mockAssessments
    : tabValue === 1
      ? mockAssessments.filter(a => a.status === 'available' || a.status === 'in-progress')
      : mockAssessments.filter(a => a.status === 'completed');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0b', py: 4, position: 'relative', overflow: 'hidden' }}>
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
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            borderRadius: '50%',
            background: i % 2 === 0 ? '#fbbf24' : '#f5f5f0',
            opacity: 0.3,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            zIndex: 0,
            animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      <style>{`
        @keyframes shimmerBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-30px); opacity: 0.6; }
        }
      `}</style>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fbbf24 0%, #6ee7b7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontFamily: 'Poppins, sans-serif',
              mb: 1
            }}
          >
            Assessments
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Complete assessments to validate your competency in nurse delegation skills
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(34,211,238,0.2)', width: 48, height: 48 }}>
                  <Assignment sx={{ color: '#22d3ee' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">{mockAssessments.length}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">Total Assessments</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(16,185,129,0.2)', width: 48, height: 48 }}>
                  <CheckCircle sx={{ color: '#10b981' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">{completedCount}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">Completed</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(245,158,11,0.2)', width: 48, height: 48 }}>
                  <TrendingUp sx={{ color: '#f59e0b' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">{averageScore.toFixed(0)}%</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">Average Score</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(139,92,246,0.2)', width: 48, height: 48 }}>
                  <EmojiEvents sx={{ color: '#8b5cf6' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">
                    {Math.round((completedCount / mockAssessments.length) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">Progress</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)' },
            '& .Mui-selected': { color: '#22d3ee' },
            '& .MuiTabs-indicator': { bgcolor: '#22d3ee' }
          }}
        >
          <Tab label={`All (${mockAssessments.length})`} />
          <Tab label={`Available (${mockAssessments.filter(a => a.status === 'available' || a.status === 'in-progress').length})`} />
          <Tab label={`Completed (${completedCount})`} />
        </Tabs>

        {/* Assessment Cards */}
        <Grid container spacing={3}>
          {filteredAssessments.map((assessment) => (
            <Grid item xs={12} md={6} lg={4} key={assessment.id}>
              <Card sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: assessment.status === 'in-progress' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: assessment.status === 'locked' ? 0.6 : 1
              }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={assessment.category}
                      size="small"
                      sx={{ bgcolor: 'rgba(34,211,238,0.2)', color: '#22d3ee', fontSize: '0.7rem' }}
                    />
                    <Chip
                      icon={assessment.status === 'locked' ? <Lock sx={{ fontSize: 14 }} /> : undefined}
                      label={getStatusLabel(assessment.status)}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(assessment.status)}20`,
                        color: getStatusColor(assessment.status),
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>

                  <Typography variant="h6" color="white" fontWeight="bold" gutterBottom>
                    {assessment.title}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mb: 2, flex: 1 }}>
                    {assessment.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Timer sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        {assessment.duration} min
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Assignment sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        {assessment.questions} questions
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        {assessment.passingScore}% to pass
                      </Typography>
                    </Box>
                  </Box>

                  {assessment.status === 'completed' && assessment.score && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="rgba(255,255,255,0.6)">Your Score</Typography>
                        <Typography variant="body2" color={assessment.score >= assessment.passingScore ? '#10b981' : '#ef4444'} fontWeight="bold">
                          {assessment.score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={assessment.score}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: assessment.score >= assessment.passingScore ? '#10b981' : '#ef4444',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  )}

                  <Button
                    variant={assessment.status === 'completed' ? 'outlined' : 'contained'}
                    disabled={assessment.status === 'locked'}
                    fullWidth
                    endIcon={assessment.status === 'locked' ? <Lock /> : <ArrowForward />}
                    sx={{
                      bgcolor: assessment.status === 'completed' ? 'transparent' : '#22d3ee',
                      color: assessment.status === 'completed' ? '#22d3ee' : '#0f172a',
                      borderColor: '#22d3ee',
                      '&:hover': {
                        bgcolor: assessment.status === 'completed' ? 'rgba(34,211,238,0.1)' : '#06b6d4'
                      },
                      '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    {assessment.status === 'completed' ? 'Review' :
                      assessment.status === 'in-progress' ? 'Continue' :
                        assessment.status === 'locked' ? 'Locked' : 'Start Assessment'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
