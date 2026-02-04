import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { startupService } from '../services/api/startupService';
import { investorService } from '../services/api/investorService';
import { investmentOfferService } from '../services/api/investmentOfferService';
import { useAuth } from '../contexts/AuthContext';
import { Startup, Investor, InvestmentOffer, UserRole, OfferStatus } from '../types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Startup user data
  const [startups, setStartups] = useState<Startup[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<InvestmentOffer[]>([]);

  // Investor user data
  const [investorProfile, setInvestorProfile] = useState<Investor | null>(null);
  const [madeOffers, setMadeOffers] = useState<InvestmentOffer[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError('');

    try {
      // Load startups owned by user
      try {
        const startupsResponse = await startupService.getStartupsByUserId(user.id);
        const userStartups = Array.isArray(startupsResponse) ? startupsResponse : startupsResponse.content || [];
        setStartups(userStartups);

        // Load offers for each startup
        let allReceivedOffers: InvestmentOffer[] = [];
        for (const startup of userStartups) {
          try {
            const offersResponse = await investmentOfferService.getOffersByIdeaId(startup.id);
            const offers = Array.isArray(offersResponse) ? offersResponse : offersResponse.content || [];
            allReceivedOffers = [...allReceivedOffers, ...offers];
          } catch (e) {
            // No offers for this startup
          }
        }
        setReceivedOffers(allReceivedOffers);
      } catch (e) {
        // User might not have startups
      }

      // Load investor profile and offers
      try {
        const investor = await investorService.getInvestorByUserId(user.id);
        setInvestorProfile(investor);

        if (investor?.id) {
          const offersResponse = await investmentOfferService.getOffersByInvestorId(investor.id);
          const offers = Array.isArray(offersResponse) ? offersResponse : offersResponse.content || [];
          setMadeOffers(offers);
        }
      } catch (e) {
        // User might not be an investor
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    if (!amount) return '$0';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: OfferStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case OfferStatus.ACCEPTED:
        return 'success';
      case OfferStatus.PENDING:
        return 'warning';
      case OfferStatus.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Please log in to view your dashboard.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Calculate stats
  const totalFundingGoal = startups.reduce((sum, s) => sum + (s.fundingGoal || 0), 0);
  const totalFundingRaised = startups.reduce((sum, s) => sum + (s.currentFunding || 0), 0);
  const pendingReceivedOffers = receivedOffers.filter((o) => o.status === OfferStatus.PENDING).length;
  const pendingMadeOffers = madeOffers.filter((o) => o.status === OfferStatus.PENDING).length;
  const acceptedOffers = [...receivedOffers, ...madeOffers].filter((o) => o.status === OfferStatus.ACCEPTED).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Welcome back, {user.firstName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your activity
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(user.userRole === UserRole.INVESTOR ? '/investors/new' : '/startups/new')}
        >
          {user.userRole === UserRole.INVESTOR ? 'New Investor Profile' : 'New Startup'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    My Startups
                  </Typography>
                  <Typography variant="h4">{startups.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MonetizationOnIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Funding Raised
                  </Typography>
                  <Typography variant="h4">{formatCurrency(totalFundingRaised)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending Offers
                  </Typography>
                  <Typography variant="h4">{pendingReceivedOffers + pendingMadeOffers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Accepted Offers
                  </Typography>
                  <Typography variant="h4">{acceptedOffers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* My Startups Section */}
        {startups.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">My Startups</Typography>
                  <Button size="small" onClick={() => navigate('/startups')}>
                    View All
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {startups.slice(0, 5).map((startup) => (
                    <ListItem
                      key={startup.id}
                      sx={{ px: 0, cursor: 'pointer' }}
                      onClick={() => navigate(`/startups/${startup.id}`)}
                    >
                      <ListItemText
                        primary={startup.companyName}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={startup.fundingGoal ? (startup.currentFunding / startup.fundingGoal) * 100 : 0}
                              sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatCurrency(startup.currentFunding)} / {formatCurrency(startup.fundingGoal)} raised
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip label={startup.stage} size="small" sx={{ ml: 1 }} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Received Offers Section */}
        {receivedOffers.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Received Offers</Typography>
                  <Button size="small" onClick={() => navigate('/offers')}>
                    View All
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {receivedOffers.slice(0, 5).map((offer) => (
                    <ListItem key={offer.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={formatCurrency(offer.offeredAmount)}
                        secondary={`${offer.equityPercentage}% equity`}
                      />
                      <Chip
                        label={offer.status}
                        size="small"
                        color={getStatusColor(offer.status)}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Investor Profile Section */}
        {investorProfile && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Investor Profile</Typography>
                  <Button size="small" onClick={() => navigate(`/investors/${investorProfile.id}`)}>
                    View Profile
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Investment Budget
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(investorProfile.investmentBudget)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Preferred Stage
                    </Typography>
                    <Typography variant="body1">
                      {investorProfile.investmentStage || 'Any'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Ticket Size
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(investorProfile.minTicketSize)} - {formatCurrency(investorProfile.maxTicketSize)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Offers Made
                    </Typography>
                    <Typography variant="h6">{madeOffers.length}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Made Offers Section */}
        {madeOffers.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">My Investment Offers</Typography>
                  <Button size="small" onClick={() => navigate('/offers')}>
                    View All
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {madeOffers.slice(0, 5).map((offer) => (
                    <ListItem
                      key={offer.id}
                      sx={{ px: 0, cursor: 'pointer' }}
                      onClick={() => navigate(`/startups/${offer.ideaId}`)}
                    >
                      <ListItemText
                        primary={formatCurrency(offer.offeredAmount)}
                        secondary={`${offer.equityPercentage}% equity`}
                      />
                      <Chip
                        label={offer.status}
                        size="small"
                        color={getStatusColor(offer.status)}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Empty State */}
        {startups.length === 0 && !investorProfile && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Get Started
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {user.userRole === UserRole.STARTUP
                    ? "You haven't created any startups yet. Create your first startup to start receiving investment offers!"
                    : user.userRole === UserRole.INVESTOR
                    ? "You haven't created an investor profile yet. Create one to start making investment offers!"
                    : 'Start exploring startups and investment opportunities.'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="contained" onClick={() => navigate('/startups/new')}>
                    Create Startup
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/investors/new')}>
                    Create Investor Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default DashboardPage;
