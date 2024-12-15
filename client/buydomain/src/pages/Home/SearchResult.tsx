import React from 'react';
import { Card, CardContent, Typography, styled, Zoom } from '@mui/material';
import { motion } from 'framer-motion';



const StyledCard = styled(motion(Card))(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  textAlign: 'center',
  width: '30%',
  maxWidth: 500,
  margin: '0 auto',
  marginLeft: '0',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.08)',
  },
}));




interface SearchResultProps {
  domain: string;

}

export default function SearchResult({ domain }: SearchResultProps) {
  return (
    <Zoom in={true} style={{ transitionDelay: '400ms' }}>
      <StyledCard sx={{ mt: 1, mb: 4, mr: 2, width: '30%'}}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {domain?? "Not Available"}
          </Typography>
        </CardContent>
      </StyledCard>
    </Zoom>
  );
}

