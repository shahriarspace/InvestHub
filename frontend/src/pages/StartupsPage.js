import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Card, CardContent, CardActions, Button, Typography, Grid, CircularProgress, Alert, Chip } from '@mui/material';
import { startupService } from '../services/api/startupService';
import { StartupStatus } from '../types';
export const StartupsPage = () => {
    const navigate = useNavigate();
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    useEffect(() => {
        loadStartups();
    }, [page]);
    const loadStartups = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await startupService.getAllStartups(page, 12);
            setStartups(response.content);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to load startups');
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case StartupStatus.PUBLISHED:
                return 'success';
            case StartupStatus.DRAFT:
                return 'warning';
            default:
                return 'default';
        }
    };
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Box, { sx: { mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(Typography, { variant: "h4", component: "h1", sx: { fontWeight: 'bold' }, children: "Startups" }), _jsx(Button, { variant: "contained", onClick: () => navigate('/startups/new'), children: "Create Startup" })] }), error && _jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }), loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 8 }, children: _jsx(CircularProgress, {}) })) : startups.length === 0 ? (_jsx(Alert, { severity: "info", children: "No startups found" })) : (_jsx(Grid, { container: true, spacing: 3, children: startups.map((startup) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsxs(Card, { sx: { height: '100%', display: 'flex', flexDirection: 'column' }, children: [_jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsx(Box, { sx: { mb: 2 }, children: _jsx(Chip, { label: startup.status, size: "small", color: getStatusColor(startup.status), variant: "outlined" }) }), _jsx(Typography, { variant: "h6", component: "h2", gutterBottom: true, children: startup.name }), _jsx(Typography, { variant: "body2", color: "textSecondary", paragraph: true, children: startup.description }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Industry:" }), " ", startup.industry] }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Funding Goal:" }), " $", startup.fundingGoal?.toLocaleString()] })] }), _jsx(CardActions, { children: _jsx(Button, { size: "small", onClick: () => navigate(`/startups/${startup.id}`), children: "View Details" }) })] }) }, startup.id))) })), !loading && startups.length > 0 && (_jsxs(Box, { sx: { mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }, children: [_jsx(Button, { disabled: page === 0, onClick: () => setPage(p => p - 1), children: "Previous" }), _jsxs(Typography, { sx: { py: 1 }, children: ["Page ", page + 1] }), _jsx(Button, { onClick: () => setPage(p => p + 1), children: "Next" })] }))] }));
};
export default StartupsPage;
