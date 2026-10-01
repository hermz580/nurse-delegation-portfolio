import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Button,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  School,
  EmojiEvents,
  Assessment,
  PlayCircle,
  CheckCircle,
  Schedule,
  Logout,
  Settings,
  Notifications,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const MotionCard = motion(Card);

// Mock notifications data
const mockNotifications = [
  { id: 1, title: 'Assessment Due Tomorrow', message: 'Delegation Fundamentals Quiz is scheduled for tomorrow at 10:00 AM', time: '2 hours ago', read: false },
  { id: 2, title: 'Module Completed', message: 'Congratulations! You completed Legal & Regulatory Framework', time: '5 hours ago', read: false },
  { id: 3, title: 'New Training Available', message: 'Advanced Medication Administration module is now available', time: '1 day ago', read: true },
  { id: 4, title: 'Certificate Expiring', message: 'Your Basic Life Support certification expires in 30 days', time: '2 days ago', read: true },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const stats = [
    {
      label: 'Modules Completed',
      value: '12/25',
      percentage: 48,
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      label: 'Average Score',
      value: '92%',
      percentage: 92,
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success',
    },
    {
      label: 'Assessments Passed',
      value: '8/10',
      percentage: 80,
      icon: <Assessment sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info',
    },
    {
      label: 'Certifications',
      value: '0/1',
      percentage: 85,
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning',
    },
  ];

  const currentModules = [
    {
      title: 'Delegation Fundamentals',
      progress: 75,
      duration: '2 hours remaining',
      status: 'in_progress',
    },
    {
      title: 'Legal & Regulatory Framework',
      progress: 100,
      duration: 'Completed',
      status: 'completed',
    },
    {
      title: 'Assessment & Evaluation',
      progress: 30,
      duration: '4 hours remaining',
      status: 'in_progress',
    },
  ];

  const upcomingAssessments = [
    {
      title: 'Delegation Fundamentals Quiz',
      date: 'Tomorrow, 10:00 AM',
      questions: 20,
      duration: '30 min',
    },
    {
      title: 'Legal Framework Exam',
      date: 'Dec 15, 2025',
      questions: 50,
      duration: '90 min',
    },
  ];

  const recentActivity = [
    {
      action: 'Completed module',
      module: 'Legal & Regulatory Framework',
      time: '2 hours ago',
      icon: <CheckCircle color="success" />,
    },
    {
      action: 'Started module',
      module: 'Assessment & Evaluation',
      time: '5 hours ago',
      icon: <PlayCircle color="primary" />,
    },
    {
      action: 'Passed assessment',
      module: 'Documentation Standards',
      time: '1 day ago',
      icon: <EmojiEvents color="warning" />,
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                🏥 Nurse Delegation Network
              </Typography>
              <Chip label="Student" size="small" color="primary" variant="outlined" />
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={handleNotificationOpen}>
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationClose}
                PaperProps={{
                  sx: { width: 360, maxHeight: 400, mt: 1 }
                }}
              >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                </Box>
                {mockNotifications.map((notif, index) => (
                  <Box key={notif.id}>
                    <MenuItem
                      onClick={handleNotificationClose}
                      sx={{
                        py: 1.5,
                        px: 2,
                        bgcolor: notif.read ? 'transparent' : 'action.hover',
                        whiteSpace: 'normal'
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={notif.read ? 'normal' : 'bold'}>
                          {notif.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {notif.time}
                        </Typography>
                      </Box>
                    </MenuItem>
                    {index < mockNotifications.length - 1 && <Divider />}
                  </Box>
                ))}
                <Divider />
                <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center', color: 'primary.main' }}>
                  View All Notifications
                </MenuItem>
              </Menu>
              <IconButton onClick={() => navigate('/profile')}>
                <Settings />
              </IconButton>
              <IconButton
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/');
                }}
              >
                <Logout />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {t('dashboard.welcomeBack', { name: 'Sarah' })} 👋
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  {t('dashboard.progressMessage', { percent: 48 })}
                  {' '}{t('dashboard.keepItUp')}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    onClick={() => navigate('/modules')}
                  >
                    {t('dashboard.continueLearning')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.100' } }}
                    onClick={() => navigate('/assessments')}
                  >
                    {t('dashboard.viewAssessments')}
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120, mx: 'auto', bgcolor: 'white', color: 'primary.main', fontSize: '3rem' }}
                >
                  SJ
                </Avatar>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  License: RN
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </MotionCard>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                sx={{ height: '100%', borderRadius: 3 }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stat.percentage}
                    color={stat.color as any}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Current Modules */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Current Modules
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {currentModules.map((module, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        '&:hover': { bgcolor: 'grey.100' },
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate('/modules')}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {module.title}
                        </Typography>
                        <Chip
                          label={module.status === 'completed' ? 'Completed' : 'In Progress'}
                          size="small"
                          color={module.status === 'completed' ? 'success' : 'primary'}
                        />
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box sx={{ flex: 1, mr: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={module.progress}
                            color={module.status === 'completed' ? 'success' : 'primary'}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Schedule fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {module.duration}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/modules')}
                >
                  View All Modules
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Activity
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {recentActivity.map((activity, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                      }}
                    >
                      {activity.icon}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {activity.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.module}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Upcoming Assessments */}
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Upcoming Assessments
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {upcomingAssessments.map((assessment, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate('/assessments')}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        {assessment.title}
                      </Typography>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          📅 {assessment.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          📝 {assessment.questions} questions • {assessment.duration}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/assessments')}
                >
                  View All Assessments
                </Button>
              </CardContent>
            </Card>

            {/* Progress to Certification */}
            <Card sx={{ borderRadius: 3, bgcolor: 'success.50' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Progress to Certification
                </Typography>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      border: 8,
                      borderColor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      85%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    You're almost there! Complete 3 more modules and pass the final exam to earn your certification.
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/certifications')}
                  >
                    View Requirements
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
