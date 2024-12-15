import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, AppBar, Toolbar, Typography, Badge, IconButton, Box, Button, Alert } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import DomainSearch from '../components/DomainSearch.tsx';
import DomainResult from '../components/DomainResult.tsx';
import Cart from '../components/Cart.tsx';
import Features from '../components/Features.tsx';
import { styled } from '@mui/material/styles';

interface Domain {
  name: string;
  price: number;
  available: boolean;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 0),
  color: 'white',
}));

export default function DomainPurchase() {
  const [cart, setCart] = useState<Domain[]>([]);
  const [searchResult, setSearchResult] = useState<Domain[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate()
  
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addedCartNames = cart.map((c) => c.name);

  const handleSearch = (domain: string) => {
    setIsSearching(true);
    console.log(process.env.REACT_APP_SERVER_URL);
    fetch(`${process.env.REACT_APP_SERVER_URL}/domain/search-domain/${domain}`,{
      method: 'GET',
    })
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      throw new Error(`${res.status} ${res.statusText}`)
    })
    .then((data) => {
         setIsSearching(false)
         setSearchResult([...cart,
            {
              name: data.domain,
              price: data.price,
              available: data.available
            }])
    })
    .catch((err) => {
        setIsSearching(false);
        setErrorMessage(`Error searching domain: ${err.message}`);
        setTimeout(() => {
          setErrorMessage("");
        }, 10000);
    })
  };
  const addToCart = (domain: Domain) => {
    setCart([...cart, domain]);
  };

  const removeFromCart = (domainName: string) => {
    setCart(cart.filter(item => item.name !== domainName));
  };


  return (
      <>
      <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }} onClick={() => navigate('/')}>
          DomainMaster
        </Typography>
        <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
          <Badge badgeContent={cart.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </StyledAppBar>
    <ContentContainer maxWidth="lg" sx={{ width: '100%' }}>
        <HeroSection>
          <Typography id='finder' variant="h2" component="h1" gutterBottom>
            Find Your Perfect Domain
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Secure your online presence with our easy-to-use domain search
          </Typography>
          <Box sx={{ mt: 4 }}>
            {errorMessage &&
              <Alert severity='error' onClick={() => setErrorMessage("")} sx={{
                ml: 34.5,
                mr: 34.5,
                mb: 2
              }}>
                {errorMessage}
              </Alert>}
            <DomainSearch onSearch={handleSearch} isSearching={isSearching} />
          </Box>
        </HeroSection>
        <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'left' }}>
          {searchResult &&
            searchResult.map(res => {
              return (<DomainResult domain={res} onAddToCart={addToCart} isAdded={addedCartNames.includes(res.name)} available={res.available} />);
            })}
        </Box>
      </ContentContainer>
      <Cart
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart} />
        </>
  );
}

