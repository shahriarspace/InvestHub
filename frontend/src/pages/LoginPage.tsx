import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api/userService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await userService.getUserByEmail(email);
      const mockToken = 'mock-jwt-token-' + Date.now();
      login(user, mockToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Sign In
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required disabled={loading} />
        <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Sign up</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
