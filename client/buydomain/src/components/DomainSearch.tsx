import React, { useState } from 'react';
import { TextField, Button, Box, styled, InputAdornment, CircularProgress, LinearProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1e88e5',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
}));

interface DomainSearchProps {
  onSearch: (domain: string) => void;
  isSearching: boolean;
}

export default function DomainSearch({ onSearch, isSearching }: DomainSearchProps) {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain == "") return;
    onSearch(domain);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, maxWidth: 600, margin: '0 auto' }}>
      <StyledTextField
        fullWidth
        variant="outlined"
        label="Enter your desired domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </InputAdornment>
          ),
        }}
      />
      <Button 
        type="submit" 
        variant="contained"
        onClick={handleSubmit}
        size="large"
        disabled={isSearching}
        sx={{
          width: '20%',
          bgcolor: '#1e88e5', 
          color: 'white', 
          '&:hover': { 
            bgcolor: '#1565c0' 
          } 
        }}
      >
        {
          isSearching? <CircularProgress size={35}/> : ("Search")
        }
      </Button>
    </Box>
  );
}

