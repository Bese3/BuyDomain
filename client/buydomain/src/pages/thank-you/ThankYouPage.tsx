import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, AppBar, Toolbar, Grid2, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SessionData } from './types';
import { styled } from '@mui/material/styles';



const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  width: '100%'
}));

export default function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const purchaseId = searchParams.get('purchase_id');

  useEffect(() => {
    const fetchSessionData = async () => {
      fetch(`${process.env.REACT_APP_SERVER_URL}/purchase-services/verify-payement?purchase_id=${purchaseId}`, {
        method: 'PATCH',
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }

      })
      .then(data => {
        if (!data.status) {
          throw new Error(data.message)
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
  
      })
    };

    fetchSessionData();
  }, [purchaseId]);
  const navigate = useNavigate()


  return (
    <Grid2 sx={{height: '100%'}}>
      <StyledAppBar position="static">
        <Toolbar sx={{}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }} onClick={() => navigate('/')}>
            DomainMaster
          </Typography>
        </Toolbar>
      </StyledAppBar>
      {
        loading?
      (
      <Paper elevation={3} sx={{ mt: 5, p: 4, height: '100%', textAlign: 'center', backgroundColor: 'inherit', boxShadow: 'none' }}>
        <CircularProgress size={50} sx={{marginTop: '13%'}} />
        <Typography sx={{ml: 3, mt: 2}}>
          Verifiying......
        </Typography>
      </Paper>) :
      (error)?
        (
          <Paper elevation={3} sx={{ mt: 5, p: 4, height: '100%', textAlign: 'center', backgroundColor: 'inherit', boxShadow: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h5" color="error" gutterBottom sx={{mb: 3, mt: 5}}>
                  {error || 'An error occurred'}
              </Typography>
              <Button variant="contained" color="primary" href="/">
                  Return to Home
              </Button>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ mt: 5, p: 4, height: '100%', textAlign: 'center', backgroundColor: 'inherit', boxShadow: 'none' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Thank You for Your Purchase!
          </Typography>
          <Typography variant="body1" paragraph>
            Your payment was successful. We appreciate your business!
          </Typography>
          <Button variant="contained" color="primary" href="/">
            Return to Home
          </Button>
        </Paper>
        )
      }
    </Grid2>

  );
}

