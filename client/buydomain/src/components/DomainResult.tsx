import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, styled, Box, Zoom } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { motion, AnimatePresence } from 'framer-motion';

const StyledCard = styled(motion(Card))(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  textAlign: 'center',
  maxWidth: 500,
  margin: '0 auto',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const AvailabilityIndicator = styled(Box)<{ available: boolean }>(({ theme, available }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: available ? '#4caf50' : '#f44336',
}));

interface Domain {
  name: string;
  price: number;
  available: boolean;
}

interface DomainResultProps {
  domain: Domain;
  onAddToCart: (domain: Domain) => void;
  isAdded: boolean;
  available: boolean;
}

export default function DomainResult({ domain, onAddToCart, isAdded, available}: DomainResultProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(domain);
      setIsAdding(false);
    }, 6000);
  };

  return (
    <Zoom in={true} style={{ transitionDelay: '400ms' }}>
      <StyledCard sx={{ mt: 1, mb: 4, mr: 2, width: '100%' }}>
        <AvailabilityIndicator available={available} />
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {domain.name}
          </Typography>
          <Typography variant="h5" color="rgba(255, 255, 255, 0.7)" gutterBottom>
            ${domain.price? domain.price / 10**6 : 0}
          </Typography>
          <Box sx={{ mt: 2, position: 'relative' }}>
            <Button 
              variant="contained" 
              onClick={handleAddToCart}
              startIcon={<AddShoppingCartIcon />}
              disabled={isAdding || isAdded || !available}
              sx={{ 
                bgcolor: '#1e88e5', 
                color: 'white', 
                '&:hover': { 
                  bgcolor: '#1565c0' 
                } 
              }}
            >
              Add to Cart
            </Button>
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ scale: 1, x: 0, y: 0 }}
                  animate={{ scale: 0.5, x: '15000%', y: '-15000%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.5 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#1e88e5',
                  }}
                />
              )}
            </AnimatePresence>
          </Box>
        </CardContent>
      </StyledCard>
    </Zoom>
  );
}
