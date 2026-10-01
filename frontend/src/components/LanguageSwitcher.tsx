import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Menu,
    MenuItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { Language, KeyboardArrowDown } from '@mui/icons-material';
import { languages } from '../i18n';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        handleClose();
    };

    return (
        <Box>
            <Button
                onClick={handleClick}
                sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                    },
                }}
                startIcon={<Language sx={{ fontSize: 20 }} />}
                endIcon={<KeyboardArrowDown sx={{ fontSize: 18 }} />}
            >
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {currentLanguage.flag} {currentLanguage.nativeName}
                </Typography>
                <Typography variant="body2" sx={{ display: { xs: 'block', sm: 'none' } }}>
                    {currentLanguage.flag}
                </Typography>
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        bgcolor: '#1e293b',
                        color: 'white',
                        minWidth: 200,
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        selected={lang.code === i18n.language}
                        sx={{
                            py: 1.5,
                            px: 2,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                            '&.Mui-selected': {
                                bgcolor: 'rgba(34,211,238,0.1)',
                                '&:hover': { bgcolor: 'rgba(34,211,238,0.15)' },
                            },
                        }}
                    >
                        <ListItemText>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography variant="h6" sx={{ lineHeight: 1 }}>
                                    {lang.flag}
                                </Typography>
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        {lang.nativeName}
                                    </Typography>
                                    <Typography variant="caption" color="rgba(255,255,255,0.5)">
                                        {lang.name}
                                    </Typography>
                                </Box>
                            </Box>
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
