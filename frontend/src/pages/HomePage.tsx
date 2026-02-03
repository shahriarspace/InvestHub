import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome to InvestHub
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Connect startups with investors and make your vision a reality
        </Typography>
      </Box>

      {isAuthenticated ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Browse Startups</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Discover innovative startups looking for investment
              </Typography>
              <Button variant="contained" onClick={() => navigate('/startups')} fullWidth>
                View Startups
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>My Profile</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Manage your startup or investor profile
              </Typography>
              <Button variant="contained" onClick={() => navigate('/profile')} fullWidth>
                Go to Profile
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" paragraph>Sign up or log in to get started</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" size="large" onClick={() => navigate('/register')}>
              Sign Up
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
