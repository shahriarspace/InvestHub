import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Link,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import { startupService } from '../services/api/startupService';
import { Startup, StartupStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import MakeOfferDialog from '../components/MakeOfferDialog';

const StartupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadStartup();
    }
  }, [id]);

  const loadStartup = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await startupService.getStartupById(id!);
      setStartup(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load startup');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: StartupStatus): 'success' | 'warning' | 'default' => {
    switch (status) {
      case StartupStatus.PUBLISHED:
        return 'success';
      case StartupStatus.DRAFT:
        return 'warning';
      default:
        return 'default';
    }
  };

  const calculateFundingProgress = (): number => {
    if (!startup || !startup.fundingGoal || startup.fundingGoal === 0) return 0;
    return Math.min((startup.currentFunding / startup.fundingGoal) * 100, 100);
  };

  const isOwner = user?.id === startup?.userId;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !startup) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Startup not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/startups')}>
          Back to Startups
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/startups')}
          sx={{ mb: 2 }}
        >
          Back to Startups
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                {startup.companyName}
              </Typography>
              <Chip
                label={startup.status}
                size="small"
                color={getStatusColor(startup.status)}
                variant="outlined"
              />
            </Box>
            {startup.stage && (
              <Typography variant="subtitle1" color="text.secondary">
                Stage: {startup.stage}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isOwner && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/startups/${id}/edit`)}
              >
                Edit
              </Button>
            )}
            {!isOwner && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOfferDialogOpen(true)}
              >
                Make Investment Offer
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {startup.description || 'No description provided.'}
              </Typography>
            </CardContent>
          </Card>

          {/* Links */}
          {(startup.website || startup.linkedinUrl || startup.pitchDeckUrl) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Links
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {startup.website && (
                    <Button
                      variant="outlined"
                      startIcon={<LanguageIcon />}
                      component={Link}
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </Button>
                  )}
                  {startup.linkedinUrl && (
                    <Button
                      variant="outlined"
                      startIcon={<LinkedInIcon />}
                      component={Link}
                      href={startup.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </Button>
                  )}
                  {startup.pitchDeckUrl && (
                    <Button
                      variant="outlined"
                      startIcon={<DescriptionIcon />}
                      component={Link}
                      href={startup.pitchDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pitch Deck
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Funding Progress */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Funding Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Raised
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Goal
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={calculateFundingProgress()}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary">
                    ${startup.currentFunding?.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="h6">
                    ${startup.fundingGoal?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                {calculateFundingProgress().toFixed(1)}% funded
              </Typography>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Stage
                  </Typography>
                  <Typography variant="body2">
                    {startup.stage || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip label={startup.status} size="small" color={getStatusColor(startup.status)} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {startup.createdAt ? new Date(startup.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Make Offer Dialog */}
      <MakeOfferDialog
        open={offerDialogOpen}
        onClose={() => setOfferDialogOpen(false)}
        onSuccess={() => setSuccessMessage('Investment offer submitted successfully!')}
        startupId={startup.id}
        startupName={startup.companyName}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </Container>
  );
};

export default StartupDetailPage;
