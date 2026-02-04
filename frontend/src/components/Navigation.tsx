import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem, Typography, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

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
    { label: 'Dashboard', path: '/dashboard', requireAuth: true },
    { label: 'Startups', path: '/startups', requireAuth: true },
    { label: 'Investors', path: '/investors', requireAuth: true },
    { label: 'Offers', path: '/offers', requireAuth: true },
    { label: 'Messages', path: '/messages', requireAuth: true },
    { label: 'Analytics', path: '/analytics', requireAuth: true },
  ];

  const isAdmin = user?.userRole === UserRole.ADMIN;

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
              <ThemeToggle />
              <NotificationBell />
              <IconButton size="large" onClick={handleMenuOpen} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem disabled>
                  <Typography variant="body2">{user?.firstName} {user?.lastName}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
                  Dashboard
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                    Admin Panel
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <ThemeToggle />
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
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Menu</Typography>
          <ThemeToggle showMenu />
        </Box>
        <Divider />
        <List sx={{ minWidth: 200 }}>
          {navItems.map((item) => (
            (!item.requireAuth || isAuthenticated) && (
              <ListItem button key={item.label} onClick={() => { navigate(item.path); setMobileOpen(false); }}>
                <ListItemText primary={item.label} />
              </ListItem>
            )
          ))}
        </List>
        {isAuthenticated ? (
          <>
            <Divider />
            <List>
              <ListItem button onClick={() => { navigate('/profile'); setMobileOpen(false); }}>
                <ListItemText primary="My Profile" />
              </ListItem>
              {isAdmin && (
                <ListItem button onClick={() => { navigate('/admin'); setMobileOpen(false); }}>
                  <ListItemText primary="Admin Panel" />
                </ListItem>
              )}
            </List>
            <Divider />
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </>
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
