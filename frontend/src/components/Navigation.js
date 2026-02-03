import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';
const Navigation = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleMenuOpen = (event) => {
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
    return (_jsxs(AppBar, { position: "static", sx: { mb: 4 }, children: [_jsxs(Toolbar, { children: [_jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }, onClick: () => navigate('/'), children: "InvestHub" }), _jsxs(Box, { sx: { display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }, children: [navItems.map((item) => ((!item.requireAuth || isAuthenticated) && (_jsx(Button, { color: "inherit", onClick: () => navigate(item.path), children: item.label }, item.label)))), isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx(IconButton, { size: "large", onClick: handleMenuOpen, color: "inherit", children: _jsx(AccountCircle, {}) }), _jsxs(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleMenuClose, children: [_jsx(MenuItem, { disabled: true, children: _jsxs(Typography, { variant: "body2", children: [user?.firstName, " ", user?.lastName] }) }), _jsx(MenuItem, { onClick: handleLogout, children: "Logout" })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Button, { color: "inherit", onClick: () => navigate('/login'), children: "Login" }), _jsx(Button, { variant: "contained", color: "secondary", onClick: () => navigate('/register'), children: "Sign Up" })] }))] }), _jsx(Box, { sx: { display: { xs: 'flex', md: 'none' } }, children: _jsx(IconButton, { color: "inherit", onClick: handleDrawerToggle, children: _jsx(MenuIcon, {}) }) })] }), _jsxs(Drawer, { anchor: "right", open: mobileOpen, onClose: handleDrawerToggle, children: [_jsx(List, { children: navItems.map((item) => ((!item.requireAuth || isAuthenticated) && (_jsx(ListItem, { button: true, onClick: () => { navigate(item.path); setMobileOpen(false); }, children: _jsx(ListItemText, { primary: item.label }) }, item.label)))) }), isAuthenticated ? (_jsx(MenuItem, { onClick: handleLogout, sx: { borderTop: 1, borderColor: 'divider', mt: 2 }, children: "Logout" })) : (_jsxs(Box, { sx: { p: 2, display: 'flex', gap: 1, flexDirection: 'column' }, children: [_jsx(Button, { fullWidth: true, color: "primary", variant: "outlined", onClick: () => { navigate('/login'); setMobileOpen(false); }, children: "Login" }), _jsx(Button, { fullWidth: true, color: "primary", variant: "contained", onClick: () => { navigate('/register'); setMobileOpen(false); }, children: "Sign Up" })] }))] })] }));
};
export default Navigation;
