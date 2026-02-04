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
  CircularProgress,
  Alert,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { startupService } from '../services/api/startupService';
import { Startup, StartupStatus } from '../types';

const STAGES = ['All', 'Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'];

export const StartupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    loadStartups();
  }, [page]);

  useEffect(() => {
    applyFilters();
  }, [startups, searchTerm, stageFilter, statusFilter]);

  const loadStartups = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await startupService.getAllStartups(page, 50);
      setStartups(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load startups');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...startups];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.companyName?.toLowerCase().includes(term) ||
          s.description?.toLowerCase().includes(term)
      );
    }

    // Stage filter
    if (stageFilter !== 'All') {
      filtered = filtered.filter((s) => s.stage === stageFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredStartups(filtered);
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

  const calculateFundingProgress = (startup: Startup): number => {
    if (!startup.fundingGoal || startup.fundingGoal === 0) return 0;
    return Math.min((startup.currentFunding / startup.fundingGoal) * 100, 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Startups
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/startups/new')}
        >
          Create Startup
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search startups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Stage</InputLabel>
                <Select
                  value={stageFilter}
                  label="Stage"
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
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value={StartupStatus.PUBLISHED}>Published</MenuItem>
                  <MenuItem value={StartupStatus.DRAFT}>Draft</MenuItem>
                  <MenuItem value={StartupStatus.ARCHIVED}>Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setStageFilter('All');
                  setStatusFilter('All');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredStartups.length === 0 ? (
        <Alert severity="info">
          {startups.length === 0
            ? 'No startups found. Create your first startup!'
            : 'No startups match your filters.'}
        </Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredStartups.length} of {startups.length} startups
          </Typography>

          <Grid container spacing={3}>
            {filteredStartups.map((startup) => (
              <Grid item xs={12} sm={6} md={4} key={startup.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        label={startup.status}
                        size="small"
                        color={getStatusColor(startup.status)}
                        variant="outlined"
                      />
                      {startup.stage && (
                        <Chip label={startup.stage} size="small" variant="outlined" />
                      )}
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {startup.companyName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {startup.description}
                    </Typography>

                    {/* Funding Progress */}
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          ${startup.currentFunding?.toLocaleString() || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ${startup.fundingGoal?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateFundingProgress(startup)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {calculateFundingProgress(startup).toFixed(0)}% funded
                      </Typography>
                    </Box>
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

export default StartupsPage;
