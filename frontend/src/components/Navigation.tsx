import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Startups', path: '/startups', requireAuth: true },
  ];

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
          InvestHub
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
          {navItems.map((item) => (
            (!item.requireAuth || isAuthenticated) && (
              <Button key={item.label} color="inherit" onClick={() => navigate(item.path)}>
                {item.label}
              </Button>
            )
          ))}

          {isAuthenticated ? (
            <>
              <IconButton size="large" onClick={handleMenuOpen} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem disabled>
                  <Typography variant="body2">{user?.firstName} {user?.lastName}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="contained" color="secondary" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <List>
          {navItems.map((item) => (
            (!item.requireAuth || isAuthenticated) && (
              <ListItem button key={item.label} onClick={() => { navigate(item.path); setMobileOpen(false); }}>
                <ListItemText primary={item.label} />
              </ListItem>
            )
          ))}
        </List>
        {isAuthenticated ? (
          <MenuItem onClick={handleLogout} sx={{ borderTop: 1, borderColor: 'divider', mt: 2 }}>
            Logout
          </MenuItem>
        ) : (
          <Box sx={{ p: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Button fullWidth color="primary" variant="outlined" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
              Login
            </Button>
            <Button fullWidth color="primary" variant="contained" onClick={() => { navigate('/register'); setMobileOpen(false); }}>
              Sign Up
            </Button>
          </Box>
        )}
      </Drawer>
    </AppBar>
  );
};

export default Navigation;
