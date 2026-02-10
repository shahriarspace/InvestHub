import React from 'react';
import { 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Typography,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckIcon from '@mui/icons-material/Check';
import { useThemeMode, ThemeMode } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  showMenu?: boolean;
}

// Theme icons and colors
const themeConfig: Record<ThemeMode, { icon: React.ReactNode; color: string; gradient?: string }> = {
  light: { 
    icon: <LightModeIcon fontSize="small" />, 
    color: '#1976d2',
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
  },
  dark: { 
    icon: <DarkModeIcon fontSize="small" />, 
    color: '#90caf9',
    gradient: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)'
  },
  grafana: { 
    icon: <DarkModeIcon fontSize="small" />, 
    color: '#FF9830',
    gradient: 'linear-gradient(135deg, #181B1F 0%, #111217 100%)'
  },
  midnight: { 
    icon: <DarkModeIcon fontSize="small" />, 
    color: '#7C4DFF',
    gradient: 'linear-gradient(135deg, #121829 0%, #0A0E1A 100%)'
  },
  ocean: { 
    icon: <DarkModeIcon fontSize="small" />, 
    color: '#26A69A',
    gradient: 'linear-gradient(135deg, #1B2838 0%, #0D1B2A 100%)'
  },
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showMenu = true }) => {
  const { mode, toggleTheme, setMode, availableThemes } = useThemeMode();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (showMenu) {
      setAnchorEl(event.currentTarget);
    } else {
      toggleTheme();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeSelect = (selectedMode: ThemeMode) => {
    setMode(selectedMode);
    handleClose();
  };

  const currentThemeConfig = themeConfig[mode];
  // In light mode the AppBar background matches the theme color, so use 'inherit' (white) for visibility
  const iconColor = mode === 'light' ? 'inherit' : currentThemeConfig.color;

  return (
    <>
      <Tooltip title="Change theme">
        <IconButton 
          color="inherit" 
          onClick={handleClick}
          sx={{
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? 'rgba(255,255,255,0.15)' 
                : alpha(currentThemeConfig.color, 0.1),
            }
          }}
        >
          <PaletteIcon sx={{ color: iconColor }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
            minWidth: 220,
            mt: 1,
          }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Choose Theme
          </Typography>
        </Box>
        <Divider />
        {availableThemes.map((themeOption) => {
          const config = themeConfig[themeOption.id];
          const isSelected = mode === themeOption.id;
          
          return (
            <MenuItem 
              key={themeOption.id}
              onClick={() => handleModeSelect(themeOption.id)}
              selected={isSelected}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: alpha(config.color, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(config.color, 0.15),
                  }
                }
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: config.gradient,
                    border: `2px solid ${config.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <CheckIcon sx={{ fontSize: 14, color: config.color }} />
                  )}
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary={themeOption.name}
                secondary={themeOption.description}
                primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default ThemeToggle;
