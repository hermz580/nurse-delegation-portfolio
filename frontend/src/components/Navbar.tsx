import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem,
    Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,
    useMediaQuery, useTheme, Badge, Chip, Popover
} from '@mui/material';
import {
    Menu as MenuIcon, Home, Login, PersonAdd, Dashboard, School,
    Assignment, VerifiedUser, Person, Logout, AdminPanelSettings,
    Notifications, Close, AttachMoney, LocalHospital, CheckCircle,
    Warning, Info, Schedule, People
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

// Notification types and mock data
interface Notification {
    id: string;
    type: 'info' | 'warning' | 'success' | 'reminder';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'success',
        title: 'Certification Approved',
        message: 'Your Nurse Delegation certification has been approved.',
        time: '2 hours ago',
        read: false
    },
    {
        id: '2',
        type: 'reminder',
        title: 'Assessment Due Soon',
        message: 'Insulin Administration assessment is due in 3 days.',
        time: '1 day ago',
        read: false
    },
    {
        id: '3',
        type: 'info',
        title: 'New Module Available',
        message: 'Wound Care Essentials module is now available.',
        time: '2 days ago',
        read: false
    }
];

interface NavbarProps {
    isLoggedIn?: boolean;
    userName?: string;
    userRole?: 'caregiver' | 'provider' | 'admin';
    onLogout?: () => void;
}

export default function Navbar({ isLoggedIn = false, userName = 'Guest', userRole = 'caregiver' }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { logout } = useAuth();
    const { t } = useTranslation();

    const [mobileDrawer, setMobileDrawer] = useState(false);
    const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);
    const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />;
            case 'warning': return <Warning sx={{ color: '#f59e0b', fontSize: 20 }} />;
            case 'reminder': return <Schedule sx={{ color: '#8b5cf6', fontSize: 20 }} />;
            default: return <Info sx={{ color: '#22d3ee', fontSize: 20 }} />;
        }
    };

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const publicLinks = [
        { label: 'Home', path: '/', icon: <Home /> },
        { label: 'Pricing', path: '/pricing', icon: <AttachMoney /> },
        { label: 'Caseworkers', path: '/caseworkers', icon: <People /> },
        { label: 'Providers', path: '/providers', icon: <LocalHospital /> },
        { label: 'Resources', path: '/resources', icon: <Assignment /> },
    ];

    const caregiverLinks = [
        { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    ];

    const providerLinks = [
        { label: 'Dashboard', path: '/provider/dashboard', icon: <LocalHospital /> },
    ];

    const adminLinks = [
        { label: 'Admin', path: '/admin', icon: <AdminPanelSettings /> },
        { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    ];

    const getNavLinks = () => {
        const links = [...publicLinks];
        if (isLoggedIn) {
            if (userRole === 'admin') {
                links.push(...adminLinks);
            } else if (userRole === 'provider') {
                links.push(...providerLinks);
            } else {
                links.push(...caregiverLinks);
            }
        }
        return links;
    };

    const handleLogout = () => {
        setUserMenu(null);
        logout(); // Use auth context logout
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Logo - Pyramid Icon + Animated Nurse Delegation Network */}
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        {/* Pyramid Logo */}
                        <Box sx={{
                            width: 0,
                            height: 0,
                            borderLeft: '18px solid transparent',
                            borderRight: '18px solid transparent',
                            borderBottom: '32px solid',
                            borderBottomColor: '#ffd000',
                            filter: 'drop-shadow(0 0 8px rgba(255, 208, 0, 0.6))',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '10px',
                                left: '-8px',
                                width: 0,
                                height: 0,
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderBottom: '14px solid #00ffd5',
                            }
                        }} />
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                fontSize: '1.3rem',
                                animation: 'colorCycle 6s ease-in-out infinite',
                                '@keyframes colorCycle': {
                                    '0%, 100%': { color: '#ffd000', textShadow: '0 0 10px rgba(255, 208, 0, 0.5)' },
                                    '16%': { color: '#00ffd5', textShadow: '0 0 10px rgba(0, 255, 213, 0.5)' },
                                    '33%': { color: '#ff006e', textShadow: '0 0 10px rgba(255, 0, 110, 0.5)' },
                                    '50%': { color: '#00b4ff', textShadow: '0 0 10px rgba(0, 180, 255, 0.5)' },
                                    '66%': { color: '#00ff88', textShadow: '0 0 10px rgba(0, 255, 136, 0.5)' },
                                    '83%': { color: '#a855f7', textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' },
                                }
                            }}
                        >
                            Nurse Delegation Network
                        </Typography>
                    </Box>

                    {/* Desktop Navigation - Larger, More Presentable Tabs */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {getNavLinks().map((link) => (
                                <Button
                                    key={link.path}
                                    onClick={() => navigate(link.path)}
                                    startIcon={link.icon}
                                    sx={{
                                        color: isActive(link.path) ? '#0a0f14' : 'rgba(255,255,255,0.85)',
                                        background: isActive(link.path)
                                            ? 'linear-gradient(135deg, #ffd000 0%, #00ffd5 100%)'
                                            : 'transparent',
                                        '&:hover': {
                                            background: isActive(link.path)
                                                ? 'linear-gradient(135deg, #ffd000 0%, #00ffd5 100%)'
                                                : 'rgba(255,208,0,0.15)',
                                            color: isActive(link.path) ? '#0a0f14' : '#ffd000'
                                        },
                                        borderRadius: 3,
                                        px: 2.5,
                                        py: 1.2,
                                        fontSize: '0.9rem',
                                        fontWeight: isActive(link.path) ? 700 : 500,
                                        textTransform: 'none',
                                        letterSpacing: '0.5px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isActive(link.path)
                                            ? '0 4px 15px rgba(255, 208, 0, 0.3)'
                                            : 'none',
                                        '& .MuiButton-startIcon': {
                                            marginRight: 1,
                                        }
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {/* Right Side - Auth Buttons or User Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {!isLoggedIn ? (
                            <>
                                {!isMobile && (
                                    <>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/login')}
                                            startIcon={<Login />}
                                            sx={{
                                                borderColor: 'rgba(255,255,255,0.3)',
                                                color: 'white',
                                                '&:hover': { borderColor: '#22d3ee', color: '#22d3ee' }
                                            }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/register')}
                                            startIcon={<PersonAdd />}
                                            sx={{
                                                bgcolor: '#22d3ee',
                                                color: '#0f172a',
                                                '&:hover': { bgcolor: '#06b6d4' }
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {!isMobile && (
                                    <IconButton
                                        onClick={handleNotificationClick}
                                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                                    >
                                        <Badge badgeContent={unreadCount} color="error">
                                            <Notifications />
                                        </Badge>
                                    </IconButton>
                                )}
                                <Box
                                    onClick={(e) => setUserMenu(e.currentTarget)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        cursor: 'pointer',
                                        p: 1,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                                    }}
                                >
                                    <Avatar sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: '#22d3ee',
                                        fontSize: '0.9rem'
                                    }}>
                                        {userName.charAt(0).toUpperCase()}
                                    </Avatar>
                                    {!isMobile && (
                                        <Box>
                                            <Typography variant="body2" color="white">{userName}</Typography>
                                            <Chip
                                                label={userRole}
                                                size="small"
                                                sx={{
                                                    height: 18,
                                                    fontSize: '0.65rem',
                                                    bgcolor: userRole === 'admin' ? 'rgba(239,68,68,0.2)' :
                                                        userRole === 'provider' ? 'rgba(139,92,246,0.2)' :
                                                            'rgba(34,211,238,0.2)',
                                                    color: userRole === 'admin' ? '#ef4444' :
                                                        userRole === 'provider' ? '#8b5cf6' : '#22d3ee'
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton
                                onClick={() => setMobileDrawer(true)}
                                sx={{ color: 'white' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* User Dropdown Menu */}
            <Menu
                anchorEl={userMenu}
                open={Boolean(userMenu)}
                onClose={() => setUserMenu(null)}
                PaperProps={{
                    sx: { bgcolor: '#1e293b', color: 'white', minWidth: 200 }
                }}
            >
                <MenuItem onClick={() => { setUserMenu(null); navigate('/profile'); }}>
                    <ListItemIcon><Person sx={{ color: 'rgba(255,255,255,0.7)' }} /></ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { setUserMenu(null); navigate('/dashboard'); }}>
                    <ListItemIcon><Dashboard sx={{ color: 'rgba(255,255,255,0.7)' }} /></ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon><Logout sx={{ color: '#ef4444' }} /></ListItemIcon>
                    <ListItemText sx={{ color: '#ef4444' }}>Logout</ListItemText>
                </MenuItem>
            </Menu>

            {/* Notification Popover */}
            <Popover
                open={Boolean(notificationAnchor)}
                anchorEl={notificationAnchor}
                onClose={handleNotificationClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        bgcolor: '#1e293b',
                        color: 'white',
                        minWidth: 360,
                        maxWidth: 400,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    }
                }}
            >
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            onClick={handleMarkAllAsRead}
                            sx={{ color: '#22d3ee', textTransform: 'none', fontSize: '0.75rem' }}
                        >
                            Mark all as read
                        </Button>
                    )}
                </Box>
                <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
                    {notifications.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary="No notifications"
                                secondary="You're all caught up!"
                                primaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                                secondaryTypographyProps={{ color: 'rgba(255,255,255,0.5)' }}
                            />
                        </ListItem>
                    ) : (
                        notifications.map((notification) => (
                            <ListItem
                                key={notification.id}
                                onClick={() => handleMarkAsRead(notification.id)}
                                sx={{
                                    cursor: 'pointer',
                                    bgcolor: notification.read ? 'transparent' : 'rgba(34,211,238,0.05)',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                    py: 1.5,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {getNotificationIcon(notification.type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" fontWeight={notification.read ? 'normal' : 'bold'} color="white">
                                                {notification.title}
                                            </Typography>
                                            {!notification.read && (
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22d3ee' }} />
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ display: 'block', mb: 0.5 }}>
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="rgba(255,255,255,0.4)">
                                                {notification.time}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))
                    )}
                </List>
                <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <Button
                        size="small"
                        onClick={() => { handleNotificationClose(); navigate('/dashboard'); }}
                        sx={{ color: '#22d3ee', textTransform: 'none' }}
                    >
                        View all activity
                    </Button>
                </Box>
            </Popover>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileDrawer}
                onClose={() => setMobileDrawer(false)}
                PaperProps={{
                    sx: { width: 280, bgcolor: '#0f172a' }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="white" fontWeight="bold">Menu</Typography>
                    <IconButton onClick={() => setMobileDrawer(false)} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <List>
                    {getNavLinks().map((link) => (
                        <ListItem
                            key={link.path}
                            onClick={() => { navigate(link.path); setMobileDrawer(false); }}
                            sx={{
                                cursor: 'pointer',
                                bgcolor: isActive(link.path) ? 'rgba(34,211,238,0.1)' : 'transparent',
                                '&:hover': { bgcolor: 'rgba(34,211,238,0.1)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: isActive(link.path) ? '#22d3ee' : 'rgba(255,255,255,0.7)' }}>
                                {link.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={link.label}
                                sx={{ color: isActive(link.path) ? '#22d3ee' : 'white' }}
                            />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {!isLoggedIn ? (
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => { navigate('/login'); setMobileDrawer(false); }}
                            startIcon={<Login />}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                '&:hover': { borderColor: '#22d3ee' }
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => { navigate('/register'); setMobileDrawer(false); }}
                            startIcon={<PersonAdd />}
                            sx={{
                                bgcolor: '#22d3ee',
                                color: '#0f172a',
                                '&:hover': { bgcolor: '#06b6d4' }
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleLogout}
                            startIcon={<Logout />}
                            sx={{
                                borderColor: '#ef4444',
                                color: '#ef4444',
                                '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Drawer>
        </>
    );
}
