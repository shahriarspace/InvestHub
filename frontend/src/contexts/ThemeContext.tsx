import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'grafana' | 'midnight' | 'ocean';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  availableThemes: { id: ThemeMode; name: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'investhub-theme-mode';

// Available themes configuration
const availableThemes: { id: ThemeMode; name: string; description: string }[] = [
  { id: 'light', name: 'Light', description: 'Clean and bright' },
  { id: 'dark', name: 'Dark', description: 'Easy on the eyes' },
  { id: 'grafana', name: 'Grafana', description: 'Professional dark theme' },
  { id: 'midnight', name: 'Midnight', description: 'Deep blue dark theme' },
  { id: 'ocean', name: 'Ocean', description: 'Calm teal accents' },
];

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Theme palettes
const themePalettes = {
  light: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    success: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    warning: { main: '#ed6c02', light: '#ff9800', dark: '#e65100' },
    error: { main: '#d32f2f', light: '#ef5350', dark: '#c62828' },
    info: { main: '#0288d1', light: '#03a9f4', dark: '#01579b' },
  },
  dark: {
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    success: { main: '#66bb6a', light: '#81c784', dark: '#388e3c' },
    warning: { main: '#ffa726', light: '#ffb74d', dark: '#f57c00' },
    error: { main: '#f44336', light: '#e57373', dark: '#d32f2f' },
    info: { main: '#29b6f6', light: '#4fc3f7', dark: '#0288d1' },
  },
  // Grafana-inspired professional dark theme
  grafana: {
    primary: {
      main: '#FF9830', // Grafana orange
      light: '#FFB357',
      dark: '#E07B1C',
      contrastText: '#000000',
    },
    secondary: {
      main: '#6E9FFF', // Grafana blue
      light: '#8FB4FF',
      dark: '#4D7FE0',
      contrastText: '#000000',
    },
    background: {
      default: '#111217', // Grafana dark background
      paper: '#181B1F', // Grafana panel background
    },
    text: {
      primary: '#D8D9DA', // Grafana text
      secondary: '#8E8E8E',
    },
    divider: '#2C3235',
    success: { main: '#73BF69', light: '#96D98D', dark: '#56A64B' },
    warning: { main: '#FF9830', light: '#FFBF6B', dark: '#E07B1C' },
    error: { main: '#F2495C', light: '#FF7383', dark: '#C4162A' },
    info: { main: '#6E9FFF', light: '#8FB4FF', dark: '#4D7FE0' },
  },
  // Midnight - Deep blue dark theme
  midnight: {
    primary: {
      main: '#7C4DFF', // Deep purple
      light: '#B47CFF',
      dark: '#651FFF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00E5FF', // Cyan accent
      light: '#6EFFFF',
      dark: '#00B8D4',
      contrastText: '#000000',
    },
    background: {
      default: '#0A0E1A', // Very dark blue
      paper: '#121829', // Slightly lighter
    },
    text: {
      primary: '#E8EAED',
      secondary: '#9AA0A6',
    },
    divider: '#2D3548',
    success: { main: '#00E676', light: '#69F0AE', dark: '#00C853' },
    warning: { main: '#FFAB00', light: '#FFD740', dark: '#FF8F00' },
    error: { main: '#FF5252', light: '#FF8A80', dark: '#FF1744' },
    info: { main: '#448AFF', light: '#82B1FF', dark: '#2962FF' },
  },
  // Ocean - Calm teal theme
  ocean: {
    primary: {
      main: '#26A69A', // Teal
      light: '#4DB6AC',
      dark: '#00897B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF8A65', // Coral accent
      light: '#FFAB91',
      dark: '#E64A19',
      contrastText: '#000000',
    },
    background: {
      default: '#0D1B2A', // Deep ocean blue
      paper: '#1B2838', // Slightly lighter
    },
    text: {
      primary: '#E0E6ED',
      secondary: '#8899A6',
    },
    divider: '#2C3E50',
    success: { main: '#26A69A', light: '#4DB6AC', dark: '#00897B' },
    warning: { main: '#FFC107', light: '#FFD54F', dark: '#FFA000' },
    error: { main: '#EF5350', light: '#E57373', dark: '#E53935' },
    info: { main: '#42A5F5', light: '#64B5F6', dark: '#1E88E5' },
  },
};

// Component overrides for each theme
const getComponentOverrides = (mode: ThemeMode, palette: typeof themePalettes.grafana) => {
  const isDark = mode !== 'light';
  
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: isDark ? '#3a3f44 #1a1d21' : '#c1c1c1 #f1f1f1',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            background: isDark ? palette.background.default : '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            background: isDark ? '#3a3f44' : '#c1c1c1',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            background: isDark ? '#4a4f54' : '#a1a1a1',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? palette.background.paper : palette.primary.main,
          backgroundImage: 'none',
          borderBottom: isDark ? `1px solid ${palette.divider}` : 'none',
          boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
          color: isDark ? palette.text.primary : palette.primary.contrastText,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          backgroundImage: 'none',
          borderRadius: 8,
          border: `1px solid ${palette.divider}`,
          boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
          border: isDark ? `1px solid ${palette.divider}` : 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 500,
          borderRadius: 6,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: palette.divider,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.background.paper,
          borderRight: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${palette.divider}`,
        },
        head: {
          fontWeight: 600,
          backgroundColor: isDark ? palette.background.default : palette.background.paper,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: isDark 
              ? `${palette.primary.main}10` 
              : 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        outlined: {
          borderColor: palette.divider,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: palette.divider,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 500,
          minWidth: 'auto',
          padding: '12px 16px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: `${palette.primary.main}20`,
            '&:hover': {
              backgroundColor: `${palette.primary.main}30`,
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: palette.divider,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.background.paper,
          backgroundImage: 'none',
          border: isDark ? `1px solid ${palette.divider}` : 'none',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.background.paper,
          backgroundImage: 'none',
          border: `1px solid ${palette.divider}`,
          boxShadow: isDark 
            ? '0 4px 20px rgba(0,0,0,0.5)' 
            : '0 4px 20px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? '#3a3f44' : 'rgba(0,0,0,0.87)',
          fontSize: '0.75rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: `${palette.success.main}20`,
          color: palette.success.main,
        },
        standardError: {
          backgroundColor: `${palette.error.main}20`,
          color: palette.error.main,
        },
        standardWarning: {
          backgroundColor: `${palette.warning.main}20`,
          color: palette.warning.main,
        },
        standardInfo: {
          backgroundColor: `${palette.info.main}20`,
          color: palette.info.main,
        },
      },
    },
  };
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedMode && availableThemes.some(t => t.id === savedMode)) {
      return savedMode as ThemeMode;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'grafana'; // Default to Grafana theme for dark preference
    }
    return 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedMode) {
        setModeState(e.matches ? 'grafana' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setModeState((prevMode) => {
      const newMode = prevMode === 'light' ? 'grafana' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
      return newMode;
    });
  };

  const setMode = (newMode: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
    setModeState(newMode);
  };

  const theme = useMemo((): Theme => {
    const palette = themePalettes[mode];
    const isDark = mode !== 'light';

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        ...palette,
      },
      components: getComponentOverrides(mode, palette),
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 600 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
        subtitle2: { fontWeight: 500 },
        button: { fontWeight: 500 },
      },
      shape: {
        borderRadius: 8,
      },
    });
  }, [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
      availableThemes,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
