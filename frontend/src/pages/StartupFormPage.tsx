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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { startupService } from '../services/api/startupService';
import { Startup, StartupStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from '../components/FileUpload';
import { FileUpload as FileUploadType } from '../services/api/fileService';

const STAGES = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'];

const StartupFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    stage: '',
    fundingGoal: '',
    currentFunding: '',
    website: '',
    linkedinUrl: '',
    pitchDeckUrl: '',
    status: StartupStatus.DRAFT,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoFile, setLogoFile] = useState<FileUploadType | null>(null);
  const [pitchDeckFile, setPitchDeckFile] = useState<FileUploadType | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadStartup();
    }
  }, [id]);

  const loadStartup = async () => {
    setLoading(true);
    try {
      const startup = await startupService.getStartupById(id!);
      setFormData({
        companyName: startup.companyName || '',
        description: startup.description || '',
        stage: startup.stage || '',
        fundingGoal: startup.fundingGoal?.toString() || '',
        currentFunding: startup.currentFunding?.toString() || '',
        website: startup.website || '',
        linkedinUrl: startup.linkedinUrl || '',
        pitchDeckUrl: startup.pitchDeckUrl || '',
        status: startup.status || StartupStatus.DRAFT,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load startup');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.stage) {
      newErrors.stage = 'Stage is required';
    }

    if (!formData.fundingGoal) {
      newErrors.fundingGoal = 'Funding goal is required';
    } else if (isNaN(Number(formData.fundingGoal)) || Number(formData.fundingGoal) < 0) {
      newErrors.fundingGoal = 'Invalid funding goal';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Invalid URL';
    }

    if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Invalid URL';
    }

    if (formData.pitchDeckUrl && !isValidUrl(formData.pitchDeckUrl)) {
      newErrors.pitchDeckUrl = 'Invalid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setSaving(true);
    try {
      const startupData: Partial<Startup> = {
        userId: user?.id,
        companyName: formData.companyName,
        description: formData.description,
        stage: formData.stage,
        fundingGoal: Number(formData.fundingGoal),
        currentFunding: Number(formData.currentFunding) || 0,
        website: formData.website || undefined,
        linkedinUrl: formData.linkedinUrl || undefined,
        pitchDeckUrl: formData.pitchDeckUrl || undefined,
        status: formData.status,
      };

      if (isEdit) {
        await startupService.updateStartup(id!, startupData);
        setSuccess('Startup updated successfully!');
        setTimeout(() => navigate(`/startups/${id}`), 1500);
      } else {
        const created = await startupService.createStartup(startupData);
        setSuccess('Startup created successfully!');
        setTimeout(() => navigate(`/startups/${created.id}`), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save startup');
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
        onClick={() => navigate(isEdit ? `/startups/${id}` : '/startups')}
        sx={{ mb: 3 }}
      >
        {isEdit ? 'Back to Startup' : 'Back to Startups'}
      </Button>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        {isEdit ? 'Edit Startup' : 'Create New Startup'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.stage}>
                  <InputLabel>Stage</InputLabel>
                  <Select
                    value={formData.stage}
                    label="Stage"
                    onChange={(e) => handleSelectChange('stage', e.target.value)}
                  >
                    {STAGES.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {stage}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.stage && (
                    <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                      {errors.stage}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleSelectChange('status', e.target.value as StartupStatus)}
                  >
                    <MenuItem value={StartupStatus.DRAFT}>Draft</MenuItem>
                    <MenuItem value={StartupStatus.PUBLISHED}>Published</MenuItem>
                    <MenuItem value={StartupStatus.ARCHIVED}>Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Funding Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Funding Goal"
                  name="fundingGoal"
                  type="number"
                  value={formData.fundingGoal}
                  onChange={handleChange}
                  error={!!errors.fundingGoal}
                  helperText={errors.fundingGoal}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Funding"
                  name="currentFunding"
                  type="number"
                  value={formData.currentFunding}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Links (Optional)
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  error={!!errors.website}
                  helperText={errors.website || 'e.g., https://yourcompany.com'}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  error={!!errors.linkedinUrl}
                  helperText={errors.linkedinUrl}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pitch Deck URL"
                  name="pitchDeckUrl"
                  value={formData.pitchDeckUrl}
                  onChange={handleChange}
                  error={!!errors.pitchDeckUrl}
                  helperText={errors.pitchDeckUrl || 'Or upload a pitch deck below'}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Media & Documents
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Company Logo
                </Typography>
                <FileUpload
                  fileType="STARTUP_LOGO"
                  referenceId={id}
                  label="Upload Logo"
                  helperText="PNG, JPG up to 5MB"
                  existingFile={logoFile}
                  onUploadComplete={(file) => setLogoFile(file)}
                  onDelete={() => setLogoFile(null)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Pitch Deck (PDF)
                </Typography>
                <FileUpload
                  fileType="PITCH_DECK"
                  referenceId={id}
                  label="Upload Pitch Deck"
                  helperText="PDF up to 20MB"
                  existingFile={pitchDeckFile}
                  onUploadComplete={(file) => setPitchDeckFile(file)}
                  onDelete={() => setPitchDeckFile(null)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(isEdit ? `/startups/${id}` : '/startups')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Saving...' : isEdit ? 'Update Startup' : 'Create Startup'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default StartupFormPage;
