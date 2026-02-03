import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api/userService';
export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await userService.getUserByEmail(email);
            const mockToken = 'mock-jwt-token-' + Date.now();
            login(user, mockToken);
            navigate('/');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Container, { maxWidth: "sm", sx: { py: 8 }, children: [_jsx(Box, { sx: { textAlign: 'center', mb: 4 }, children: _jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "Sign In" }) }), error && _jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }), _jsxs(Box, { component: "form", onSubmit: handleSubmit, sx: { mt: 3 }, children: [_jsx(TextField, { fullWidth: true, label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), margin: "normal", required: true, disabled: loading }), _jsx(Button, { fullWidth: true, variant: "contained", size: "large", type: "submit", sx: { mt: 3, mb: 2 }, disabled: loading, children: loading ? _jsx(CircularProgress, { size: 24 }) : 'Sign In' }), _jsx(Box, { sx: { textAlign: 'center', mt: 2 }, children: _jsxs(Typography, { variant: "body2", children: ["Don't have an account? ", _jsx(Link, { to: "/register", children: "Sign up" })] }) })] })] }));
};
export default LoginPage;
