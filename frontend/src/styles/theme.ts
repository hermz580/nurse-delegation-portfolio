import { createTheme, alpha } from '@mui/material/styles';

// Premium Medical Tech Palette
// Primary: Deep Modern Teal (Trust, Technology, Health)
// Secondary: Vibrant Coral (Action, Warmth, Alert)
// Backgrounds: Clean, Clinical but warm whites and soft greys

const PRIMARY_MAIN = '#0F766E'; // Teal 700
const PRIMARY_LIGHT = '#14B8A6'; // Teal 500
const PRIMARY_DARK = '#0D9488'; // Teal 600

const SECONDARY_MAIN = '#F43F5E'; // Rose 500
const SECONDARY_LIGHT = '#FB7185'; // Rose 400
const SECONDARY_DARK = '#E11D48'; // Rose 600

const BACKGROUND_DEFAULT = '#F8FAFC'; // Slate 50
const BACKGROUND_PAPER = '#FFFFFF';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY_MAIN,
      light: PRIMARY_LIGHT,
      dark: PRIMARY_DARK,
      contrastText: '#ffffff',
    },
    secondary: {
      main: SECONDARY_MAIN,
      light: SECONDARY_LIGHT,
      dark: SECONDARY_DARK,
      contrastText: '#ffffff',
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: '#0F172A', // Slate 900
      secondary: '#64748B', // Slate 500
    },
    success: {
      main: '#10B981', // Emerald 500
    },
    warning: {
      main: '#F59E0B', // Amber 500
    },
    error: {
      main: '#EF4444', // Red 500
    },
    info: {
      main: '#3B82F6', // Blue 500
    },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Modern button style (no caps)
    },
  },
  shape: {
    borderRadius: 16, // Softer, more modern corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shaped buttons
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)', // Soft colored shadow
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${PRIMARY_MAIN} 0%, ${PRIMARY_DARK} 100%)`,
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${SECONDARY_MAIN} 0%, ${SECONDARY_DARK} 100%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          backgroundImage: 'none', // Remove weird MUI overlay in dark mode
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
        filled: {
          backgroundColor: alpha(PRIMARY_MAIN, 0.1),
          color: PRIMARY_MAIN,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(BACKGROUND_PAPER, 0.8),
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        },
      },
    },
  },
});
