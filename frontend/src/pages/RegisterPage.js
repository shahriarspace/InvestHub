import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api/userService';
import { UserRole, UserStatus } from '../types';
export const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userRole: UserRole.STARTUP,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const newUser = await userService.createUser({
                ...formData,
                status: UserStatus.ACTIVE,
            });
            const mockToken = 'mock-jwt-token-' + Date.now();
            login(newUser, mockToken);
            navigate('/');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Container, { maxWidth: "sm", sx: { py: 8 }, children: [_jsx(Box, { sx: { textAlign: 'center', mb: 4 }, children: _jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "Create Account" }) }), error && _jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }), _jsxs(Box, { component: "form", onSubmit: handleSubmit, sx: { mt: 3 }, children: [_jsx(TextField, { fullWidth: true, label: "First Name", name: "firstName", value: formData.firstName, onChange: handleChange, margin: "normal", required: true, disabled: loading }), _jsx(TextField, { fullWidth: true, label: "Last Name", name: "lastName", value: formData.lastName, onChange: handleChange, margin: "normal", required: true, disabled: loading }), _jsx(TextField, { fullWidth: true, label: "Email", type: "email", name: "email", value: formData.email, onChange: handleChange, margin: "normal", required: true, disabled: loading }), _jsxs(FormControl, { fullWidth: true, margin: "normal", disabled: loading, children: [_jsx(InputLabel, { children: "I am a..." }), _jsxs(Select, { name: "userRole", value: formData.userRole, onChange: handleChange, label: "I am a...", children: [_jsx(MenuItem, { value: UserRole.STARTUP, children: "Startup Founder" }), _jsx(MenuItem, { value: UserRole.INVESTOR, children: "Investor" })] })] }), _jsx(Button, { fullWidth: true, variant: "contained", size: "large", type: "submit", sx: { mt: 3, mb: 2 }, disabled: loading, children: loading ? _jsx(CircularProgress, { size: 24 }) : 'Create Account' })] })] }));
};
export default RegisterPage;
