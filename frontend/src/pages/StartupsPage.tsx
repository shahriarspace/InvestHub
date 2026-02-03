import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Card, CardContent, CardActions, Button, Typography, Grid, CircularProgress, Alert, Chip } from '@mui/material';
import { startupService } from '../services/api/startupService';
import { Startup, StartupStatus } from '../types';

export const StartupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState<Startup[]>([]);
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load startups');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: StartupStatus): any => {
    switch (status) {
      case StartupStatus.PUBLISHED:
        return 'success';
      case StartupStatus.DRAFT:
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Startups
        </Typography>
        <Button variant="contained" onClick={() => navigate('/startups/new')}>
          Create Startup
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : startups.length === 0 ? (
        <Alert severity="info">No startups found</Alert>
      ) : (
        <Grid container spacing={3}>
          {startups.map((startup) => (
            <Grid item xs={12} sm={6} md={4} key={startup.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip label={startup.status} size="small" color={getStatusColor(startup.status)} variant="outlined" />
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {startup.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {startup.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Industry:</strong> {startup.industry}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Funding Goal:</strong> ${startup.fundingGoal?.toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/startups/${startup.id}`)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && startups.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <Typography sx={{ py: 1 }}>Page {page + 1}</Typography>
          <Button onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default StartupsPage;
