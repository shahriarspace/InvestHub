import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {
  analyticsService,
  PlatformStats,
  InvestmentTrend,
  StageDistribution,
  TopStartup,
  TopInvestor,
} from '../services/api/analyticsService';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [investmentTrends, setInvestmentTrends] = useState<InvestmentTrend[]>([]);
  const [stageDistribution, setStageDistribution] = useState<StageDistribution[]>([]);
  const [topStartups, setTopStartups] = useState<TopStartup[]>([]);
  const [topInvestors, setTopInvestors] = useState<TopInvestor[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      const [stats, trends, stages, startups, investors] = await Promise.all([
        analyticsService.getPlatformStats(),
        analyticsService.getInvestmentTrends(12),
        analyticsService.getStageDistribution(),
        analyticsService.getTopStartups(10),
        analyticsService.getTopInvestors(10),
      ]);

      setPlatformStats(stats);
      setInvestmentTrends(trends);
      setStageDistribution(stages);
      setTopStartups(startups);
      setTopInvestors(investors);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Platform Analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Platform Stats */}
      {platformStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Startups
                    </Typography>
                    <Typography variant="h4">{platformStats.totalStartups}</Typography>
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
                      Total Investors
                    </Typography>
                    <Typography variant="h4">{platformStats.totalInvestors}</Typography>
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
                      Total Funding
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(platformStats.totalFundingRaised)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Accepted Offers
                    </Typography>
                    <Typography variant="h4">{platformStats.acceptedOffersCount}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs for detailed analytics */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Investment Trends" />
          <Tab label="Stage Distribution" />
          <Tab label="Top Startups" />
          <Tab label="Top Investors" />
        </Tabs>

        <CardContent>
          {/* Investment Trends */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Monthly Investment Activity (Last 12 Months)
              </Typography>
              {investmentTrends.length === 0 ? (
                <Typography color="text.secondary">No data available</Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Box sx={{ display: 'flex', gap: 2, minWidth: 800, pb: 2 }}>
                    {investmentTrends.map((trend) => (
                      <Box
                        key={`${trend.year}-${trend.month}`}
                        sx={{
                          flex: 1,
                          minWidth: 60,
                          textAlign: 'center',
                          p: 1,
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {trend.monthName} {trend.year}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {trend.offerCount}
                        </Typography>
                        <Typography variant="caption">offers</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {formatCurrency(trend.totalAmount)}
                        </Typography>
                        <Chip
                          label={`${trend.acceptedCount} accepted`}
                          size="small"
                          color="success"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Stage Distribution */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Startups by Funding Stage
              </Typography>
              {stageDistribution.length === 0 ? (
                <Typography color="text.secondary">No data available</Typography>
              ) : (
                <List>
                  {stageDistribution.map((stage) => (
                    <ListItem key={stage.stage}>
                      <ListItemText
                        primary={stage.stage}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={stage.percentage}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 0.5,
                              }}
                            >
                              <Typography variant="caption">
                                {stage.startupCount} startups ({stage.percentage.toFixed(1)}%)
                              </Typography>
                              <Typography variant="caption">
                                Avg: {formatCurrency(stage.averageFunding)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Top Startups */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Top Startups by Funding
              </Typography>
              {topStartups.length === 0 ? (
                <Typography color="text.secondary">No data available</Typography>
              ) : (
                <List>
                  {topStartups.map((startup, index) => (
                    <ListItem
                      key={startup.id}
                      button
                      onClick={() => navigate(`/startups/${startup.id}`)}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <ListItemText
                        primary={startup.companyName}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(startup.fundingProgress, 100)}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatCurrency(startup.currentFunding)} /{' '}
                              {formatCurrency(startup.fundingGoal)} (
                              {startup.fundingProgress.toFixed(1)}%)
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip label={startup.stage} size="small" />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Top Investors */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Most Active Investors
              </Typography>
              {topInvestors.length === 0 ? (
                <Typography color="text.secondary">No data available</Typography>
              ) : (
                <List>
                  {topInvestors.map((investor, index) => (
                    <ListItem
                      key={investor.id}
                      button
                      onClick={() => navigate(`/investors/${investor.id}`)}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: 'secondary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <ListItemText
                        primary={investor.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              {investor.offersMade} offers made, {investor.offersAccepted} accepted
                            </Typography>
                            <br />
                            <Typography variant="body2" color="success.main" component="span">
                              {formatCurrency(investor.totalInvested)} invested
                            </Typography>
                          </Box>
                        }
                      />
                      {investor.sectorsInterested && investor.sectorsInterested.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                          {investor.sectorsInterested.slice(0, 3).map((sector) => (
                            <Chip key={sector} label={sector.trim()} size="small" variant="outlined" />
                          ))}
                        </Box>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AnalyticsPage;
