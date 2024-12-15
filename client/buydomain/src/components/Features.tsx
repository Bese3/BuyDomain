import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  fontSize: 48,
  marginBottom: theme.spacing(2),
  color: '#1e88e5',
}));

const features = [
  {
    icon: <SearchIcon fontSize="inherit" />,
    title: 'Easy Search',
    description: 'Find your perfect domain name with our powerful search tool.',
  },
  {
    icon: <SecurityIcon fontSize="inherit" />,
    title: 'Secure Transactions',
    description: 'Your purchases are protected with state-of-the-art security.',
  },
  {
    icon: <SupportAgentIcon fontSize="inherit" />,
    title: '24/7 Support',
    description: 'Our team is always here to help you with any questions.',
  },
];

export default function Features() {
  return (
    <Box sx={{ mt: 8, mb: 5 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 4 }}>
        Why Choose Us
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1">
                  {feature.description}
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

