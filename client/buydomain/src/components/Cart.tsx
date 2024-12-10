import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const total = items.reduce((sum, item) => sum + item.price, 0) / 10**6;
  
  const handleBuy = () => {
    console.log(items)
    fetch(`http://localhost:3001/purchase-services/buy-domain`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'thrj@gmail.com',
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
      console.log(data)
      window.location.href = data.session.url;
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List sx={{ width: 300 }}>
        <ListItem>
          <Typography variant="h6">Shopping Cart</Typography>
        </ListItem>
        <Divider />
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
        <Divider />
        <ListItem>
          <Typography variant="subtitle1">Total: ${total}</Typography>
        </ListItem>
      </List>
      <Button variant='contained' onClick={handleBuy} sx={{
        ml: 25,
        mr: 1
      }}>
         Buy
      </Button>
    </Drawer>
  );
}

