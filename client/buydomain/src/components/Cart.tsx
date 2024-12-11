import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

interface Domain {
  name: string;
  price: number;
}

interface CartProps {
  open: boolean;
  onClose: () => void;
  items: Domain[];
  onRemove: (domainName: string) => void;
}

export default function Cart({ open, onClose, items, onRemove }: CartProps) {
  const [coupon, setCoupon] = useState<string>("");
  const [checkingOut, setCheckingOut] = useState<boolean>(false);
  const [couponAdded, setCouponAdded] = useState<boolean>(false);
  const [counponAddedMessage, setCouponAddedMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const total = items.reduce((sum, item) => sum + item.price, 0) / 10**6;
  
  const handleBuy = () => {
    setCheckingOut(true);
    if (!email || email === ""  || !email.includes("@") || !email.includes(".")) return;
    fetch(`http://localhost:3001/purchase-services/buy-domain`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          domains: items
        })
      }
    )
    .then(res=> {
      if(res.ok) {
        return res.json()
      }
      throw new Error(`${res.status} ${res.statusText}`)
    })
    .then(data => {
      setCheckingOut(false);
      console.log(data)
      window.location.href = data.session.url;
    })
    .catch(err => {
      setCheckingOut(false);
      setErrorMessage(`Error checking out: ${err.message}`)
      setTimeout(() => {
        setErrorMessage("");
      }, 10000);
      console.log(err)
    })
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List sx={{ width: '100%' }}>
        <ListItem>
          <Typography variant="h6">Shopping Cart</Typography>
        </ListItem>
        <Divider variant='middle' />
        {items.map((item) => (
          <ListItem key={item.name}>
            <ListItemText primary={item.name} secondary={`$${item.price / 10**6}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onRemove(item.name)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <Divider variant='middle' />
        <ListItem>
          <Typography variant="subtitle1" sx={{textDecoration: 'line-through'}}>{total}</Typography>
        </ListItem>
      </List>
      <Box sx={{display: 'flex', m: 3}}>
         {
          counponAddedMessage &&
                  <Alert severity='success' onClick={() => setCouponAddedMessage("")}>
                      {counponAddedMessage}
                  </Alert>
         }
         <TextField
           label="Coupon"
           size='small'
           value={coupon}
           onChange={(e) => setCoupon(e.target.value)}
          />
          <Button variant='contained' sx={{
            ml: 6,
            mr: 1
           }}>
            Apply
          </Button>
      </Box>
      <Box sx={{display: 'flex', m: 3, mt: 0}}>
         <TextField
           label="Email"
           size='small'
           type='email'
           value={email}
           onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant='contained' onClick={handleBuy} sx={{
            ml: 6,
            mr: 1
           }}>
            Buy
            <KeyboardDoubleArrowRightIcon/>
          </Button>
      </Box>

    </Drawer>
  );
}

