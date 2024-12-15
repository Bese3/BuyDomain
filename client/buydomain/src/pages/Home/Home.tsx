import React, { useState,  } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  TextField,
  Box,
  createTheme,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Search, Language } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Features from '../../components/Features.tsx';
import DomainResult from '../../components/DomainResult.tsx';
import SearchResult from './SearchResult.tsx';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    width: '100%'
  }));



export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading ,setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<Array<string>>([]);

  const navigate = useNavigate()

  const handleSearch = () => {
      // if (!searchQuery || searchQuery === "") return;
      setLoading(true)
      fetch(`${process.env.REACT_APP_SERVER_URL}/users/get-domains`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: searchQuery
        })
      })
        .then(res => {
          if (res.ok) {
            return res.json()
          }
          throw new Error("error getting domains")
        })
        .then(data => {
          setSearchResult(data.domains);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        })
    };


  return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        //   background: 'linear-gradient(to bottom right, #e8eaf6, #c5cae9)',
        }}
      >
        <StyledAppBar position="static">
            <Toolbar sx={{}}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
                DomainMaster
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <TextField
                size="small"
                type='email'
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button variant="contained" size="small" onClick={handleSearch} disabled={loading}>
                {loading? <CircularProgress/> :  <Search />}
              </Button>
            </Box>
            </Toolbar>
        </StyledAppBar>

        <Container component="main" sx={{ mt: 8, mb: 2, textAlign: 'center', flexGrow: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Find Your Perfect Domain
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{ ml: 7, mr: 7, mb: 4, color: 'text.secondary' }}>
            Secure your online presence with our wide selection of domain names.
            Easy search, instant purchase, and reliable hosting all in one place.
          </Typography>
          <Button variant="contained" size="large" sx={{ py: 2, px: 4 }} onClick={() => navigate('/search-domain')}>
            Start Your Search
          </Button>
          {Array.isArray(searchResult) && searchResult.length > 0 &&
            <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'left', mt: 3 }}>
            {searchResult &&
              searchResult.map(res => {
                return (<SearchResult domain={res.name}/>);
              })}
          </Box>
          }
           <Features />
        </Container>
      </Box>
  );
}

