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
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import MessageIcon from '@mui/icons-material/Message';
import { investorService } from '../services/api/investorService';
import { Investor, InvestorStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

const InvestorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadInvestor();
    }
  }, [id]);

  const loadInvestor = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await investorService.getInvestorById(id!);
      setInvestor(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load investor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: InvestorStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case InvestorStatus.ACTIVE:
        return 'success';
      case InvestorStatus.INACTIVE:
        return 'warning';
      case InvestorStatus.SUSPENDED:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number): string => {
    if (!amount) return 'N/A';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const isOwner = user?.id === investor?.userId;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !investor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Investor not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/investors')}>
          Back to Investors
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
          onClick={() => navigate('/investors')}
          sx={{ mb: 2 }}
        >
          Back to Investors
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Investor Profile
              </Typography>
              <Chip
                label={investor.status}
                size="small"
                color={getStatusColor(investor.status)}
                variant="outlined"
              />
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Investment Budget: {formatCurrency(investor.investmentBudget)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isOwner ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/investors/${id}/edit`)}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<MessageIcon />}
                onClick={() => navigate('/messages')}
              >
                Contact Investor
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Investment Preferences */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Preferences
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Minimum Ticket Size
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(investor.minTicketSize)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Maximum Ticket Size
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(investor.maxTicketSize)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Preferred Stages */}
          {investor.investmentStage && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preferred Investment Stages
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {investor.investmentStage.split(',').map((stage, idx) => (
                    <Chip key={idx} label={stage.trim()} color="primary" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Sectors */}
          {investor.sectorsInterested && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sectors of Interest
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {investor.sectorsInterested.split(',').map((sector, idx) => (
                    <Chip key={idx} label={sector.trim()} variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Portfolio */}
          {investor.portfolioCompanies && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portfolio Companies
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {investor.portfolioCompanies}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Budget
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(investor.investmentBudget)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Ticket Range
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(investor.minTicketSize)} - {formatCurrency(investor.maxTicketSize)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip label={investor.status} size="small" color={getStatusColor(investor.status)} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body2">
                    {investor.createdAt ? new Date(investor.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InvestorDetailPage;
