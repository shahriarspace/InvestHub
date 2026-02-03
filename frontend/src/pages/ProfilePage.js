import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Grid, TextField, Button, Alert, CircularProgress, Avatar, Tabs, Tab, Chip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api/userService';
import { startupService } from '../services/api/startupService';
import { investorService } from '../services/api/investorService';
import { UserRole } from '../types';
const TabPanel = ({ children, value, index }) => (_jsx("div", { hidden: value !== index, style: { paddingTop: 24 }, children: value === index && children }));
export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });
    const [startup, setStartup] = useState(null);
    const [investor, setInvestor] = useState(null);
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });
            loadProfile();
        }
    }, [user]);
    const loadProfile = async () => {
        if (!user)
            return;
        setLoading(true);
        try {
            if (user.userRole === UserRole.STARTUP) {
                const response = await startupService.getStartupsByUserId(user.id, 0, 1);
                if (response.content.length > 0) {
                    setStartup(response.content[0]);
                }
            }
            else if (user.userRole === UserRole.INVESTOR) {
                try {
                    const investorData = await investorService.getInvestorByUserId(user.id);
                    setInvestor(investorData);
                }
                catch (e) {
                    // No investor profile yet
                }
            }
        }
        catch (err) {
            console.error('Error loading profile:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!user)
            return;
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const updatedUser = await userService.updateUser(user.id, profileData);
            updateUser(updatedUser);
            setSuccess('Profile updated successfully!');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
        finally {
            setSaving(false);
        }
    };
    if (!user) {
        return (_jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsx(Alert, { severity: "warning", children: "Please log in to view your profile" }) }));
    }
    return (_jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsxs(Paper, { sx: { p: 4 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 4 }, children: [_jsxs(Avatar, { sx: { width: 80, height: 80, mr: 3, bgcolor: 'primary.main', fontSize: 32 }, children: [user.firstName?.[0], user.lastName?.[0]] }), _jsxs(Box, { children: [_jsxs(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: [user.firstName, " ", user.lastName] }), _jsxs(Box, { sx: { display: 'flex', gap: 1, mt: 1 }, children: [_jsx(Chip, { label: user.userRole, color: "primary", size: "small" }), _jsx(Chip, { label: user.status, color: "success", size: "small", variant: "outlined" })] })] })] }), _jsxs(Tabs, { value: tabValue, onChange: (_, v) => setTabValue(v), sx: { borderBottom: 1, borderColor: 'divider' }, children: [_jsx(Tab, { label: "Account Settings" }), _jsx(Tab, { label: user.userRole === UserRole.STARTUP ? 'My Startup' : 'Investor Profile' })] }), _jsxs(TabPanel, { value: tabValue, index: 0, children: [error && _jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }), success && _jsx(Alert, { severity: "success", sx: { mb: 2 }, children: success }), _jsx(Box, { component: "form", onSubmit: handleProfileUpdate, children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "First Name", value: profileData.firstName, onChange: (e) => setProfileData({ ...profileData, firstName: e.target.value }), required: true }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Last Name", value: profileData.lastName, onChange: (e) => setProfileData({ ...profileData, lastName: e.target.value }), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Email", type: "email", value: profileData.email, onChange: (e) => setProfileData({ ...profileData, email: e.target.value }), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Button, { type: "submit", variant: "contained", disabled: saving, children: saving ? _jsx(CircularProgress, { size: 24 }) : 'Save Changes' }) })] }) })] }), _jsx(TabPanel, { value: tabValue, index: 1, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 4 }, children: _jsx(CircularProgress, {}) })) : user.userRole === UserRole.STARTUP ? (startup ? (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: startup.name }), _jsx(Typography, { color: "textSecondary", paragraph: true, children: startup.description }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { children: [_jsx("strong", { children: "Industry:" }), " ", startup.industry] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { children: [_jsx("strong", { children: "Status:" }), " ", startup.status] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { children: [_jsx("strong", { children: "Funding Goal:" }), " $", startup.fundingGoal?.toLocaleString()] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { children: [_jsx("strong", { children: "Raised:" }), " $", startup.fundingRaised?.toLocaleString()] }) })] }), _jsx(Button, { variant: "outlined", sx: { mt: 3 }, onClick: () => navigate('/startups/' + startup.id + '/edit'), children: "Edit Startup" })] })) : (_jsxs(Box, { sx: { textAlign: 'center', py: 4 }, children: [_jsx(Typography, { color: "textSecondary", paragraph: true, children: "You have not created a startup yet" }), _jsx(Button, { variant: "contained", onClick: () => navigate('/startups/new'), children: "Create Your Startup" })] }))) : investor ? (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: investor.companyName }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsxs(Typography, { children: [_jsx("strong", { children: "Investment Focus:" }), " ", investor.investmentFocus] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { children: [_jsx("strong", { children: "Min Investment:" }), " $", investor.minInvestment?.toLocaleString()] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { children: [_jsx("strong", { children: "Max Investment:" }), " $", investor.maxInvestment?.toLocaleString()] }) })] }), _jsx(Button, { variant: "outlined", sx: { mt: 3 }, onClick: () => navigate('/investor/edit'), children: "Edit Profile" })] })) : (_jsxs(Box, { sx: { textAlign: 'center', py: 4 }, children: [_jsx(Typography, { color: "textSecondary", paragraph: true, children: "Complete your investor profile to start investing" }), _jsx(Button, { variant: "contained", onClick: () => navigate('/investor/setup'), children: "Setup Investor Profile" })] })) })] }) }));
};
