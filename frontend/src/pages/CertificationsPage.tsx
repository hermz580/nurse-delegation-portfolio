import { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent,
  Button, Avatar, Chip, IconButton, Tabs, Tab, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  VerifiedUser, Download, Share, EmojiEvents, CalendarToday,
  School, LocalHospital, Assignment, Print, Email, CheckCircle
} from '@mui/icons-material';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  category: string;
  issuedDate: string;
  expiryDate: string;
  credentialId: string;
  status: 'active' | 'expiring' | 'expired';
  skills: string[];
  hoursRequired: number;
  hoursCompleted: number;
}

const mockCertifications: Certification[] = [
  {
    id: '1',
    title: 'Certified Nurse Delegation Specialist',
    issuer: 'Washington State DSHS',
    category: 'Core Certification',
    issuedDate: '2024-01-15',
    expiryDate: '2025-01-15',
    credentialId: 'SB-2024-001234',
    status: 'active',
    skills: ['Medication Administration', 'Blood Glucose Monitoring', 'Insulin Administration'],
    hoursRequired: 40,
    hoursCompleted: 40
  },
  {
    id: '2',
    title: 'Medication Administration Certification',
    issuer: 'Nurse Delegation Network Training Institute',
    category: 'Clinical Skills',
    issuedDate: '2024-02-01',
    expiryDate: '2025-02-01',
    credentialId: 'SB-MED-005678',
    status: 'active',
    skills: ['Oral Medications', 'Topical Medications', 'Eye/Ear Drops', 'Inhalers'],
    hoursRequired: 16,
    hoursCompleted: 16
  },
  {
    id: '3',
    title: 'Diabetes Care Specialist',
    issuer: 'Nurse Delegation Network Training Institute',
    category: 'Specialized Care',
    issuedDate: '2024-03-01',
    expiryDate: '2024-12-20',
    credentialId: 'SB-DCS-009012',
    status: 'expiring',
    skills: ['Blood Glucose Testing', 'Insulin Injection', 'Hypoglycemia Management'],
    hoursRequired: 12,
    hoursCompleted: 12
  },
  {
    id: '4',
    title: 'CPR & First Aid',
    issuer: 'American Red Cross',
    category: 'Safety',
    issuedDate: '2023-06-15',
    expiryDate: '2024-06-15',
    credentialId: 'ARC-CPR-456789',
    status: 'expired',
    skills: ['Adult CPR', 'Pediatric CPR', 'AED Use', 'First Aid'],
    hoursRequired: 8,
    hoursCompleted: 8
  },
];

export default function CertificationsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [shareDialog, setShareDialog] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const activeCount = mockCertifications.filter(c => c.status === 'active').length;
  const expiringCount = mockCertifications.filter(c => c.status === 'expiring').length;
  const expiredCount = mockCertifications.filter(c => c.status === 'expired').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'expiring': return '#f59e0b';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'expiring': return 'Expiring Soon';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const filteredCerts = tabValue === 0
    ? mockCertifications
    : tabValue === 1
      ? mockCertifications.filter(c => c.status === 'active')
      : tabValue === 2
        ? mockCertifications.filter(c => c.status === 'expiring')
        : mockCertifications.filter(c => c.status === 'expired');

  const handleShare = (cert: Certification) => {
    setSelectedCert(cert);
    setShareDialog(true);
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
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
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
              My Certifications
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
              View and manage your professional certifications and credentials
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{
              background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
              color: '#0a0a0b',
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)' }
            }}
          >
            Download All
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#1e293b', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(34,211,238,0.2)', width: 48, height: 48 }}>
                  <VerifiedUser sx={{ color: '#22d3ee' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">{mockCertifications.length}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">Total Certifications</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#1e293b', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(16,185,129,0.2)', width: 48, height: 48 }}>
                  <CheckCircle sx={{ color: '#10b981' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">{activeCount}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">Active</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#1e293b', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(245,158,11,0.2)', width: 48, height: 48 }}>
                  <CalendarToday sx={{ color: '#f59e0b' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">{expiringCount}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">Expiring Soon</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#1e293b', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(239,68,68,0.2)', width: 48, height: 48 }}>
                  <School sx={{ color: '#ef4444' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="bold">{expiredCount}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">Need Renewal</Typography>
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
          <Tab label={`All (${mockCertifications.length})`} />
          <Tab label={`Active (${activeCount})`} />
          <Tab label={`Expiring (${expiringCount})`} />
          <Tab label={`Expired (${expiredCount})`} />
        </Tabs>

        {/* Certification Cards */}
        <Grid container spacing={3}>
          {filteredCerts.map((cert) => (
            <Grid item xs={12} md={6} key={cert.id}>
              <Card sx={{
                bgcolor: '#1e293b',
                borderRadius: 2,
                border: cert.status === 'expiring' ? '2px solid #f59e0b' :
                  cert.status === 'expired' ? '2px solid #ef4444' :
                    '1px solid rgba(255,255,255,0.1)',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{
                        bgcolor: `${getStatusColor(cert.status)}20`,
                        width: 56,
                        height: 56
                      }}>
                        <VerifiedUser sx={{ color: getStatusColor(cert.status), fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" color="white" fontWeight="bold">
                          {cert.title}
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.6)">
                          {cert.issuer}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={getStatusLabel(cert.status)}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(cert.status)}20`,
                        color: getStatusColor(cert.status),
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.5)">Credential ID</Typography>
                      <Typography variant="body2" color="white" fontFamily="monospace">
                        {cert.credentialId}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.5)">Issued</Typography>
                      <Typography variant="body2" color="white">
                        {new Date(cert.issuedDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.5)">Expires</Typography>
                      <Typography variant="body2" color={getStatusColor(cert.status)}>
                        {new Date(cert.expiryDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ mb: 1, display: 'block' }}>
                      Skills Certified
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {cert.skills.map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(34,211,238,0.1)',
                            color: '#22d3ee',
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { borderColor: '#22d3ee', color: '#22d3ee' }
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Share />}
                      onClick={() => handleShare(cert)}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { borderColor: '#22d3ee', color: '#22d3ee' }
                      }}
                    >
                      Share
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Print />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { borderColor: '#22d3ee', color: '#22d3ee' }
                      }}
                    >
                      Print
                    </Button>
                    {cert.status === 'expired' && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: '#22d3ee',
                          color: '#0f172a',
                          '&:hover': { bgcolor: '#06b6d4' }
                        }}
                      >
                        Renew
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Share Dialog */}
        <Dialog
          open={shareDialog}
          onClose={() => setShareDialog(false)}
          PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', minWidth: 400 } }}
        >
          <DialogTitle>Share Certification</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mb: 2 }}>
              Share your certification via email or copy the verification link.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              placeholder="Enter recipient's email"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
              }}
            />
            <TextField
              fullWidth
              label="Verification Link"
              value={`https://nurse-delegation-network.vercel.app/verify/${selectedCert?.credentialId}`}
              InputProps={{ readOnly: true }}
              sx={{
                '& .MuiOutlinedInput-root': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialog(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Email />}
              sx={{ bgcolor: '#22d3ee', color: '#0f172a' }}
            >
              Send Email
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
