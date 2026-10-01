import { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent,
  Button, Avatar, TextField, Switch, FormControlLabel, Divider,
  IconButton, Chip, Tab, Tabs, Alert, Snackbar, LinearProgress
} from '@mui/material';
import {
  Person, Email, Phone, LocationOn, Edit, Save, CameraAlt,
  Notifications, Security, Work, School, Settings, Badge,
  CheckCircle, Warning, Lock, Visibility, VisibilityOff
} from '@mui/icons-material';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  role: string;
  licenseNumber: string;
  licenseExpiry: string;
  employer: string;
  specialty: string;
  yearsExperience: number;
  bio: string;
  profileCompletion: number;
}

const mockProfile: UserProfile = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@example.com',
  phone: '(206) 555-0123',
  address: '1234 Healthcare Way',
  city: 'Seattle',
  state: 'WA',
  zip: '98101',
  role: 'Registered Nurse',
  licenseNumber: 'RN-WA-123456',
  licenseExpiry: '2025-06-30',
  employer: 'Sunrise Care Services',
  specialty: 'Geriatric Care',
  yearsExperience: 8,
  bio: 'Experienced RN specializing in nurse delegation services for adult family homes. Passionate about quality care and patient safety.',
  profileCompletion: 85
};

export default function ProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: false,
    certExpiry: true,
    newModules: true,
    marketing: false
  });

  const handleSave = () => {
    setEditing(false);
    setSnackbar({ open: true, message: 'Profile updated successfully!' });
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

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
            My Profile
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Manage your personal information and account settings
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ bgcolor: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
              {/* Profile Header */}
              <Box sx={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)',
                p: 4,
                textAlign: 'center',
                position: 'relative'
              }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid white',
                      fontSize: '2.5rem',
                      bgcolor: '#0f172a'
                    }}
                  >
                    {profile.firstName[0]}{profile.lastName[0]}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      '&:hover': { bgcolor: '#f1f5f9' }
                    }}
                    size="small"
                  >
                    <CameraAlt fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h5" color="white" fontWeight="bold" mt={2}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography color="rgba(255,255,255,0.8)">
                  {profile.role}
                </Typography>
              </Box>

              {/* Profile Completion */}
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">
                    Profile Completion
                  </Typography>
                  <Typography variant="body2" color="#22d3ee" fontWeight="bold">
                    {profile.profileCompletion}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={profile.profileCompletion}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#22d3ee',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Quick Info */}
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Email sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  <Typography variant="body2" color="white">{profile.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Phone sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  <Typography variant="body2" color="white">{profile.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <LocationOn sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  <Typography variant="body2" color="white">
                    {profile.city}, {profile.state}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Badge sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  <Box>
                    <Typography variant="body2" color="white">{profile.licenseNumber}</Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)">
                      Expires: {new Date(profile.licenseExpiry).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Settings Tabs */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ bgcolor: '#1e293b', borderRadius: 2 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  px: 2,
                  '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .Mui-selected': { color: '#22d3ee' },
                  '& .MuiTabs-indicator': { bgcolor: '#22d3ee' }
                }}
              >
                <Tab icon={<Person />} label="Personal" iconPosition="start" />
                <Tab icon={<Work />} label="Professional" iconPosition="start" />
                <Tab icon={<Notifications />} label="Notifications" iconPosition="start" />
                <Tab icon={<Security />} label="Security" iconPosition="start" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* Personal Info Tab */}
                {tabValue === 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" color="white">Personal Information</Typography>
                      <Button
                        variant={editing ? 'contained' : 'outlined'}
                        startIcon={editing ? <Save /> : <Edit />}
                        onClick={() => editing ? handleSave() : setEditing(true)}
                        sx={editing ? {
                          bgcolor: '#22d3ee',
                          color: '#0f172a',
                          '&:hover': { bgcolor: '#06b6d4' }
                        } : {
                          borderColor: '#22d3ee',
                          color: '#22d3ee'
                        }}
                      >
                        {editing ? 'Save Changes' : 'Edit Profile'}
                      </Button>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={profile.firstName}
                          disabled={!editing}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5)', WebkitTextFillColor: 'rgba(255,255,255,0.5)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={profile.lastName}
                          disabled={!editing}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5)', WebkitTextFillColor: 'rgba(255,255,255,0.5)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={profile.email}
                          disabled={!editing}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5)', WebkitTextFillColor: 'rgba(255,255,255,0.5)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={profile.phone}
                          disabled={!editing}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5)', WebkitTextFillColor: 'rgba(255,255,255,0.5)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          value={profile.city}
                          disabled={!editing}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5)', WebkitTextFillColor: 'rgba(255,255,255,0.5)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          value={profile.bio}
                          disabled={!editing}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5)', WebkitTextFillColor: 'rgba(255,255,255,0.5)' }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Professional Tab */}
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" color="white" mb={3}>Professional Information</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="License Number"
                          value={profile.licenseNumber}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5)', WebkitTextFillColor: 'rgba(255,255,255,0.5)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="License Expiry"
                          value={new Date(profile.licenseExpiry).toLocaleDateString()}
                          disabled
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5)', WebkitTextFillColor: 'rgba(255,255,255,0.5)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Employer"
                          value={profile.employer}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Specialty"
                          value={profile.specialty}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Years of Experience"
                          type="number"
                          value={profile.yearsExperience}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Notifications Tab */}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" color="white" mb={3}>Notification Preferences</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography color="white">Email Updates</Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.5)">
                            Receive updates about your courses and progress
                          </Typography>
                        </Box>
                        <Switch
                          checked={notifications.emailUpdates}
                          onChange={() => handleNotificationChange('emailUpdates')}
                          sx={{ '& .Mui-checked': { color: '#22d3ee' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#22d3ee' } }}
                        />
                      </Paper>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography color="white">SMS Alerts</Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.5)">
                            Get text messages for urgent updates
                          </Typography>
                        </Box>
                        <Switch
                          checked={notifications.smsAlerts}
                          onChange={() => handleNotificationChange('smsAlerts')}
                          sx={{ '& .Mui-checked': { color: '#22d3ee' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#22d3ee' } }}
                        />
                      </Paper>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography color="white">Certification Expiry Reminders</Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.5)">
                            Get notified before your certifications expire
                          </Typography>
                        </Box>
                        <Switch
                          checked={notifications.certExpiry}
                          onChange={() => handleNotificationChange('certExpiry')}
                          sx={{ '& .Mui-checked': { color: '#22d3ee' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#22d3ee' } }}
                        />
                      </Paper>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography color="white">New Module Alerts</Typography>
                          <Typography variant="body2" color="rgba(255,255,255,0.5)">
                            Be notified when new training modules are available
                          </Typography>
                        </Box>
                        <Switch
                          checked={notifications.newModules}
                          onChange={() => handleNotificationChange('newModules')}
                          sx={{ '& .Mui-checked': { color: '#22d3ee' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#22d3ee' } }}
                        />
                      </Paper>
                    </Box>
                  </Box>
                )}

                {/* Security Tab */}
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h6" color="white" mb={3}>Security Settings</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="rgba(255,255,255,0.6)" mb={2}>Change Password</Typography>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type={showPassword ? 'text' : 'password'}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="New Password"
                          type={showPassword ? 'text' : 'password'}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type={showPassword ? 'text' : 'password'}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                          }}
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showPassword}
                              onChange={() => setShowPassword(!showPassword)}
                              sx={{ '& .Mui-checked': { color: '#22d3ee' } }}
                            />
                          }
                          label="Show passwords"
                          sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          sx={{ bgcolor: '#22d3ee', color: '#0f172a', '&:hover': { bgcolor: '#06b6d4' } }}
                        >
                          Update Password
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                        <Typography variant="subtitle2" color="rgba(255,255,255,0.6)" mb={2}>Two-Factor Authentication</Typography>
                        <Alert
                          severity="warning"
                          sx={{
                            bgcolor: 'rgba(245,158,11,0.1)',
                            color: '#f59e0b',
                            '& .MuiAlert-icon': { color: '#f59e0b' }
                          }}
                        >
                          Two-factor authentication is not enabled. Enable it for extra security.
                        </Alert>
                        <Button
                          variant="outlined"
                          startIcon={<Lock />}
                          sx={{ mt: 2, borderColor: '#22d3ee', color: '#22d3ee' }}
                        >
                          Enable 2FA
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          message={snackbar.message}
        />
      </Container>
    </Box>
  );
}
