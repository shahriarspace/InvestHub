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
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { investmentOfferService } from '../services/api/investmentOfferService';
import { investorService } from '../services/api/investorService';
import { startupService } from '../services/api/startupService';
import { InvestmentOffer, OfferStatus, Startup } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface OfferWithDetails extends InvestmentOffer {
  startupName?: string;
}

const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState<OfferWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    offerId: string;
    action: 'accept' | 'reject';
  }>({ open: false, offerId: '', action: 'accept' });

  useEffect(() => {
    loadOffers();
  }, [user]);

  const loadOffers = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError('');
    try {
      // Try to get investor profile to get offers made by user
      let investorOffers: InvestmentOffer[] = [];
      try {
        const investor = await investorService.getInvestorByUserId(user.id);
        if (investor?.id) {
          const response = await investmentOfferService.getOffersByInvestorId(investor.id);
          investorOffers = Array.isArray(response) ? response : response.content || [];
        }
      } catch (e) {
        // User might not be an investor
      }

      // Get startups owned by user to get offers received
      let receivedOffers: InvestmentOffer[] = [];
      try {
        const startupsResponse = await startupService.getStartupsByUserId(user.id);
        const userStartups = Array.isArray(startupsResponse) ? startupsResponse : startupsResponse.content || [];
        
        for (const startup of userStartups) {
          try {
            const offersResponse = await investmentOfferService.getOffersByIdeaId(startup.id);
            const startupOffers = Array.isArray(offersResponse) ? offersResponse : offersResponse.content || [];
            receivedOffers = [
              ...receivedOffers,
              ...startupOffers.map((o: InvestmentOffer) => ({
                ...o,
                startupName: startup.companyName,
              })),
            ];
          } catch (e) {
            // No offers for this startup
          }
        }
      } catch (e) {
        // User might not have startups
      }

      // Combine and deduplicate
      const allOffers = [...investorOffers, ...receivedOffers];
      const uniqueOffers = allOffers.filter(
        (offer, index, self) => index === self.findIndex((o) => o.id === offer.id)
      );

      setOffers(uniqueOffers);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (offerId: string) => {
    setActionLoading(offerId);
    try {
      await investmentOfferService.acceptOffer(offerId);
      await loadOffers();
      setConfirmDialog({ open: false, offerId: '', action: 'accept' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept offer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (offerId: string) => {
    setActionLoading(offerId);
    try {
      await investmentOfferService.rejectOffer(offerId);
      await loadOffers();
      setConfirmDialog({ open: false, offerId: '', action: 'reject' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject offer');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: OfferStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case OfferStatus.ACCEPTED:
        return 'success';
      case OfferStatus.PENDING:
        return 'warning';
      case OfferStatus.REJECTED:
        return 'error';
      case OfferStatus.EXPIRED:
        return 'default';
      default:
        return 'default';
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

  const filteredOffers = offers.filter((offer) => {
    if (tab === 0) return true; // All
    if (tab === 1) return offer.status === OfferStatus.PENDING;
    if (tab === 2) return offer.status === OfferStatus.ACCEPTED;
    if (tab === 3) return offer.status === OfferStatus.REJECTED;
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Investment Offers
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`All (${offers.length})`} />
        <Tab label={`Pending (${offers.filter((o) => o.status === OfferStatus.PENDING).length})`} />
        <Tab label={`Accepted (${offers.filter((o) => o.status === OfferStatus.ACCEPTED).length})`} />
        <Tab label={`Rejected (${offers.filter((o) => o.status === OfferStatus.REJECTED).length})`} />
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredOffers.length === 0 ? (
        <Alert severity="info">
          {offers.length === 0
            ? 'No investment offers yet. Browse startups to make offers or create a startup to receive offers.'
            : 'No offers match this filter.'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredOffers.map((offer) => (
            <Grid item xs={12} md={6} key={offer.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      label={offer.status}
                      size="small"
                      color={getStatusColor(offer.status)}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>

                  {offer.startupName && (
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      For: {offer.startupName}
                    </Typography>
                  )}

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Offered Amount
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(offer.offeredAmount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Equity
                      </Typography>
                      <Typography variant="h6">
                        {offer.equityPercentage}%
                      </Typography>
                    </Grid>
                  </Grid>

                  {offer.valuation && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Implied Valuation
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(offer.valuation)}
                      </Typography>
                    </Box>
                  )}

                  {offer.message && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Message
                      </Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{offer.message}"
                      </Typography>
                    </Box>
                  )}

                  {offer.expiresAt && (
                    <Typography variant="caption" color="text.secondary">
                      Expires: {new Date(offer.expiresAt).toLocaleDateString()}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/startups/${offer.ideaId}`)}
                    >
                      View Startup
                    </Button>
                    
                    {offer.status === OfferStatus.PENDING && (
                      <>
                        <Button
                          size="small"
                          color="success"
                          variant="outlined"
                          startIcon={<CheckIcon />}
                          onClick={() =>
                            setConfirmDialog({ open: true, offerId: offer.id, action: 'accept' })
                          }
                          disabled={actionLoading === offer.id}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<CloseIcon />}
                          onClick={() =>
                            setConfirmDialog({ open: true, offerId: offer.id, action: 'reject' })
                          }
                          disabled={actionLoading === offer.id}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, offerId: '', action: 'accept' })}
      >
        <DialogTitle>
          {confirmDialog.action === 'accept' ? 'Accept Offer' : 'Reject Offer'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmDialog.action} this investment offer?
            {confirmDialog.action === 'accept' &&
              ' This will notify the investor and begin the investment process.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, offerId: '', action: 'accept' })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.action === 'accept' ? 'success' : 'error'}
            onClick={() =>
              confirmDialog.action === 'accept'
                ? handleAccept(confirmDialog.offerId)
                : handleReject(confirmDialog.offerId)
            }
            disabled={actionLoading === confirmDialog.offerId}
          >
            {actionLoading === confirmDialog.offerId ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              confirmDialog.action === 'accept' ? 'Accept' : 'Reject'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OffersPage;
