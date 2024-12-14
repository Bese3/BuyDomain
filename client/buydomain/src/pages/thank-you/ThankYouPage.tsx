import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SessionData } from './types';

export default function ThankYouPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        if (sessionId) {
          // const data = await verifyPayment(sessionId);
          // setSession(data);
        } else {
          throw new Error('No session ID provided');
        }
      } catch (err) {
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !session) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 5, p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'An error occurred'}
          </Typography>
          <Button variant="contained" color="primary" href="/">
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 5, p: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Thank You for Your Purchase!
        </Typography>
        <Typography variant="body1" paragraph>
          Your payment was successful. We appreciate your business!
        </Typography>
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="subtitle1">
            Order Details:
          </Typography>
          <Typography variant="body2">
            Order ID: {session.id}
          </Typography>
          <Typography variant="body2">
            Amount: ${(session.amount_total / 100).toFixed(2)}
          </Typography>
        </Box>
        <Button variant="contained" color="primary" href="/">
          Return to Home
        </Button>
      </Paper>
    </Container>
  );
}

