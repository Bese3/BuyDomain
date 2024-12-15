import logo from './logo.svg';
import './App.css';
import DomainPurchase from './pages/DomainPurchase.tsx';
import { Route, Routes } from 'react-router-dom';
import ThankYouPage from './pages/thank-you/ThankYouPage.tsx';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import HomePage from './pages/Home/Home.tsx';



const BackgroundContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    radial-gradient(circle at bottom right, #0a24, #000015)
  `,
}));

function App() {
  return (
    <BackgroundContainer sx={{display: 'flex', flexDirection: 'column'}}>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/search-domain' element={<DomainPurchase/>} />
      <Route path='/thank-you' element={<ThankYouPage/>}/>
    </Routes>
    <Box component="footer" sx={{mt: 3, py: 3, px: 2, mt: 'auto', backgroundColor: 'transparent' }}>
          <Typography variant="h5" color="text.secondary" align="center">
            © 2023 DomainMaster. All rights reserved.
          </Typography>
    </Box>
    </BackgroundContainer>
  );
}

export default App;
