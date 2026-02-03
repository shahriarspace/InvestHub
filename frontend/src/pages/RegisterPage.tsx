import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api/userService';
import { UserRole, UserStatus } from '../types';

export const RegisterPage: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create Account
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} margin="normal" required disabled={loading} />
        <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} margin="normal" required disabled={loading} />
        <TextField fullWidth label="Email" type="email" name="email" value={formData.email} onChange={handleChange} margin="normal" required disabled={loading} />
        <FormControl fullWidth margin="normal" disabled={loading}>
          <InputLabel>I am a...</InputLabel>
          <Select name="userRole" value={formData.userRole} onChange={handleChange} label="I am a...">
            <MenuItem value={UserRole.STARTUP}>Startup Founder</MenuItem>
            <MenuItem value={UserRole.INVESTOR}>Investor</MenuItem>
          </Select>
        </FormControl>
        <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Create Account'}
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
