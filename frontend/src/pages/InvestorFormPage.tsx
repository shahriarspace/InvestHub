import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { investorService } from '../services/api/investorService';
import { Investor, InvestorStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

const STAGES = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'];
const SECTORS = [
  'Technology',
  'Healthcare',
  'Fintech',
  'E-commerce',
  'SaaS',
  'AI/ML',
  'Clean Energy',
  'Education',
  'Real Estate',
  'Consumer Goods',
  'Manufacturing',
  'Logistics',
];

const InvestorFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    investmentBudget: '',
    investmentStages: [] as string[],
    sectorsInterested: [] as string[],
    minTicketSize: '',
    maxTicketSize: '',
    portfolioCompanies: '',
    status: InvestorStatus.ACTIVE,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      loadInvestor();
    }
  }, [id]);

  const loadInvestor = async () => {
    setLoading(true);
    try {
      const investor = await investorService.getInvestorById(id!);
      setFormData({
        investmentBudget: investor.investmentBudget?.toString() || '',
        investmentStages: investor.investmentStage?.split(',').map((s) => s.trim()) || [],
        sectorsInterested: investor.sectorsInterested?.split(',').map((s) => s.trim()) || [],
        minTicketSize: investor.minTicketSize?.toString() || '',
        maxTicketSize: investor.maxTicketSize?.toString() || '',
        portfolioCompanies: investor.portfolioCompanies || '',
        status: investor.status || InvestorStatus.ACTIVE,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load investor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelectChange = (name: string, value: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.investmentBudget) {
      newErrors.investmentBudget = 'Investment budget is required';
    } else if (isNaN(Number(formData.investmentBudget)) || Number(formData.investmentBudget) < 0) {
      newErrors.investmentBudget = 'Invalid amount';
    }

    if (!formData.minTicketSize) {
      newErrors.minTicketSize = 'Minimum ticket size is required';
    }

    if (!formData.maxTicketSize) {
      newErrors.maxTicketSize = 'Maximum ticket size is required';
    }

    if (
      formData.minTicketSize &&
      formData.maxTicketSize &&
      Number(formData.minTicketSize) > Number(formData.maxTicketSize)
    ) {
      newErrors.maxTicketSize = 'Max must be greater than min';
    }

    if (formData.investmentStages.length === 0) {
      newErrors.investmentStages = 'Select at least one investment stage';
    }

    if (formData.sectorsInterested.length === 0) {
      newErrors.sectorsInterested = 'Select at least one sector';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setSaving(true);
    try {
      const investorData: Partial<Investor> = {
        userId: user?.id,
        investmentBudget: Number(formData.investmentBudget),
        investmentStage: formData.investmentStages.join(', '),
        sectorsInterested: formData.sectorsInterested.join(', '),
        minTicketSize: Number(formData.minTicketSize),
        maxTicketSize: Number(formData.maxTicketSize),
        portfolioCompanies: formData.portfolioCompanies || undefined,
        status: formData.status,
      };

      if (isEdit) {
        await investorService.updateInvestor(id!, investorData);
        setSuccess('Investor profile updated successfully!');
        setTimeout(() => navigate(`/investors/${id}`), 1500);
      } else {
        const created = await investorService.createInvestor(investorData);
        setSuccess('Investor profile created successfully!');
        setTimeout(() => navigate(`/investors/${created.id}`), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save investor profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(isEdit ? `/investors/${id}` : '/investors')}
        sx={{ mb: 3 }}
      >
        {isEdit ? 'Back to Profile' : 'Back to Investors'}
      </Button>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        {isEdit ? 'Edit Investor Profile' : 'Create Investor Profile'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Investment Capacity
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Total Investment Budget"
                  name="investmentBudget"
                  type="number"
                  value={formData.investmentBudget}
                  onChange={handleChange}
                  error={!!errors.investmentBudget}
                  helperText={errors.investmentBudget}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Ticket Size"
                  name="minTicketSize"
                  type="number"
                  value={formData.minTicketSize}
                  onChange={handleChange}
                  error={!!errors.minTicketSize}
                  helperText={errors.minTicketSize}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Ticket Size"
                  name="maxTicketSize"
                  type="number"
                  value={formData.maxTicketSize}
                  onChange={handleChange}
                  error={!!errors.maxTicketSize}
                  helperText={errors.maxTicketSize}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Investment Preferences
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.investmentStages}>
                  <InputLabel>Preferred Stages</InputLabel>
                  <Select
                    multiple
                    value={formData.investmentStages}
                    onChange={(e) =>
                      handleMultiSelectChange('investmentStages', e.target.value as string[])
                    }
                    input={<OutlinedInput label="Preferred Stages" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {STAGES.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        <Checkbox checked={formData.investmentStages.indexOf(stage) > -1} />
                        <ListItemText primary={stage} />
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.investmentStages && (
                    <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                      {errors.investmentStages}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.sectorsInterested}>
                  <InputLabel>Sectors of Interest</InputLabel>
                  <Select
                    multiple
                    value={formData.sectorsInterested}
                    onChange={(e) =>
                      handleMultiSelectChange('sectorsInterested', e.target.value as string[])
                    }
                    input={<OutlinedInput label="Sectors of Interest" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {SECTORS.map((sector) => (
                      <MenuItem key={sector} value={sector}>
                        <Checkbox checked={formData.sectorsInterested.indexOf(sector) > -1} />
                        <ListItemText primary={sector} />
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.sectorsInterested && (
                    <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                      {errors.sectorsInterested}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Portfolio Companies (Optional)"
                  name="portfolioCompanies"
                  value={formData.portfolioCompanies}
                  onChange={handleChange}
                  helperText="List your current or past portfolio companies"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as InvestorStatus,
                      }))
                    }
                  >
                    <MenuItem value={InvestorStatus.ACTIVE}>Active</MenuItem>
                    <MenuItem value={InvestorStatus.INACTIVE}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(isEdit ? `/investors/${id}` : '/investors')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default InvestorFormPage;
