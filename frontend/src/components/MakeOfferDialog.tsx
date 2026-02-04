import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { investmentOfferService } from '../services/api/investmentOfferService';
import { investorService } from '../services/api/investorService';
import { useAuth } from '../contexts/AuthContext';
import { OfferStatus } from '../types';

interface MakeOfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  startupId: string;
  startupName: string;
}

const MakeOfferDialog: React.FC<MakeOfferDialogProps> = ({
  open,
  onClose,
  onSuccess,
  startupId,
  startupName,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [investorId, setInvestorId] = useState<string | null>(null);
  const [checkingInvestor, setCheckingInvestor] = useState(true);

  const [formData, setFormData] = useState({
    offeredAmount: '',
    equityPercentage: '',
    valuation: '',
    message: '',
  });

  useEffect(() => {
    if (open && user?.id) {
      checkInvestorProfile();
    }
  }, [open, user?.id]);

  const checkInvestorProfile = async () => {
    if (!user?.id) return;
    
    setCheckingInvestor(true);
    try {
      const investor = await investorService.getInvestorByUserId(user.id);
      setInvestorId(investor?.id || null);
    } catch (err) {
      setInvestorId(null);
    } finally {
      setCheckingInvestor(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!investorId) {
      setError('You need an investor profile to make offers. Please create one first.');
      return;
    }

    if (!formData.offeredAmount || !formData.equityPercentage) {
      setError('Offered amount and equity percentage are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await investmentOfferService.createOffer({
        investorId,
        ideaId: startupId,
        offeredAmount: parseFloat(formData.offeredAmount),
        equityPercentage: parseFloat(formData.equityPercentage),
        valuation: formData.valuation ? parseFloat(formData.valuation) : undefined,
        message: formData.message || undefined,
        status: OfferStatus.PENDING,
      });

      // Reset form and close
      setFormData({
        offeredAmount: '',
        equityPercentage: '',
        valuation: '',
        message: '',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setFormData({
        offeredAmount: '',
        equityPercentage: '',
        valuation: '',
        message: '',
      });
      onClose();
    }
  };

  // Calculate implied valuation from amount and equity
  const calculateValuation = (): string => {
    const amount = parseFloat(formData.offeredAmount);
    const equity = parseFloat(formData.equityPercentage);
    if (amount && equity && equity > 0) {
      const implied = (amount / equity) * 100;
      return `$${implied.toLocaleString()}`;
    }
    return '';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Make Investment Offer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              You are making an offer to invest in <strong>{startupName}</strong>
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {checkingInvestor ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : !investorId ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You need an investor profile to make offers. Please create one in the Investors section first.
              </Alert>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Offered Amount"
                  name="offeredAmount"
                  type="number"
                  value={formData.offeredAmount}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText="The amount you are offering to invest"
                />

                <TextField
                  fullWidth
                  label="Equity Percentage"
                  name="equityPercentage"
                  type="number"
                  value={formData.equityPercentage}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0.01, max: 100, step: 0.01 }}
                  helperText={
                    calculateValuation()
                      ? `Implied valuation: ${calculateValuation()}`
                      : 'The equity stake you are requesting'
                  }
                />

                <TextField
                  fullWidth
                  label="Proposed Valuation (optional)"
                  name="valuation"
                  type="number"
                  value={formData.valuation}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText="Your proposed company valuation"
                />

                <TextField
                  fullWidth
                  label="Message (optional)"
                  name="message"
                  multiline
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Add a message to the startup founders..."
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || checkingInvestor || !investorId}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Offer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MakeOfferDialog;
