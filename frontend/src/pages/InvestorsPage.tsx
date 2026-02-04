import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { investorService } from '../services/api/investorService';
import { Investor, InvestorStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import { CardGridSkeleton } from '../components/Skeletons';

const STAGES = ['All', 'Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'];

const InvestorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  useEffect(() => {
    loadInvestors();
  }, [page]);

  useEffect(() => {
    applyFilters();
  }, [investors, searchTerm, stageFilter]);

  const loadInvestors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await investorService.getAllInvestors(page, 50);
      setInvestors(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load investors');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...investors];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.sectorsInterested?.toLowerCase().includes(term) ||
          i.portfolioCompanies?.toLowerCase().includes(term)
      );
    }

    // Stage filter
    if (stageFilter !== 'All') {
      filtered = filtered.filter((i) => i.investmentStage?.includes(stageFilter));
    }

    setFilteredInvestors(filtered);
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
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount?.toLocaleString() || 0}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Investors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/investors/new')}
        >
          Create Investor Profile
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <SearchBar
                placeholder="Search by sectors or portfolio..."
                value={searchTerm}
                onChange={setSearchTerm}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Investment Stage</InputLabel>
                <Select
                  value={stageFilter}
                  label="Investment Stage"
                  onChange={(e) => setStageFilter(e.target.value)}
                >
                  {STAGES.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setStageFilter('All');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <CardGridSkeleton count={6} columns={{ xs: 12, sm: 6, md: 4 }} />
      ) : filteredInvestors.length === 0 ? (
        <Alert severity="info">
          {investors.length === 0
            ? 'No investors found. Be the first to create an investor profile!'
            : 'No investors match your filters.'}
        </Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredInvestors.length} of {investors.length} investors
          </Typography>

          <Grid container spacing={3}>
            {filteredInvestors.map((investor) => (
              <Grid item xs={12} sm={6} md={4} key={investor.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        label={investor.status}
                        size="small"
                        color={getStatusColor(investor.status)}
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom>
                      Investment Profile
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Budget
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(investor.investmentBudget)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Ticket Size
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(investor.minTicketSize)} - {formatCurrency(investor.maxTicketSize)}
                      </Typography>
                    </Box>

                    {investor.investmentStage && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Preferred Stages
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {investor.investmentStage.split(',').map((stage, idx) => (
                            <Chip key={idx} label={stage.trim()} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {investor.sectorsInterested && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Sectors
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {investor.sectorsInterested}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/investors/${investor.id}`)}>
                      View Details
                    </Button>
                    {investor.userId !== user?.id && (
                      <Button size="small" color="primary" onClick={() => navigate(`/messages`)}>
                        Contact
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Typography sx={{ py: 1 }}>
            Page {page + 1} of {totalPages}
          </Typography>
          <Button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default InvestorsPage;
