import React, { useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [checkingOut, setCheckingOut] = useState<boolean>(false);
  const [couponAdded, setCouponAdded] = useState<boolean>(false);
  const [isCouponAdding, setIsCouponAdding] = useState<boolean>(false);
  const [counponAddedMessage, setCouponAddedMessage] = useState<string>("")
  const [couponErrorMessage, setCouponErrorMessage] = useState<string>("")
  const [discounted, setDiscounted] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const total = items.reduce((sum, item) => sum + item.price, 0) / 10**6;

  const handleCartClose = () => {
    setCouponAddedMessage("");
    setCouponErrorMessage("");
    setErrorMessage("");
    onClose()
  }

  const handleCouponUpdate = () => {
    if (!coupon || coupon === ""){
      setCouponAddedMessage("");
      setCouponErrorMessage("Coupon is needed");
      return;
    }
    if (!email || email === ""  || !email.includes("@") || !email.includes(".")) {
      setErrorMessage("Email is needed");
      return;
    }
    setIsCouponAdding(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/purchase-services/coupons?coupon=${coupon}&email=${email}`,
      {
        method: 'GET',
      }
    )
    .then(async (res) => {
      const mess = await res.json()
      if (!res.ok){
        throw new Error(mess.message?? "error adding coupon")
      }
      if (mess.status) return mess;
      throw new Error(mess.message)
    })
    .then(data => {
      setIsCouponAdding(false);
      setCouponAdded(true);
      setCouponAddedMessage(data.message);
      setCouponErrorMessage("");  
      if (data.deductByPerc?? false) {
        const value = (total - ((data.percentage / 100) * total)).toFixed(2)
        setDiscounted(Number((data.percentage * total / 100).toFixed(2)))
        setTotalPrice(Number(value))
        return;
      }
      const value = (total - data.discount).toFixed(2);
      setDiscounted(data.discount);
      setTotalPrice(Number(value))

    })
    .catch(err => {
      setIsCouponAdding(false);
      setCouponAddedMessage("");
      setCouponErrorMessage(err.message);
    })
  }

  useEffect(() => {
    if (coupon && coupon !== "") {
      handleCouponUpdate()
    }
  }, [items])

  const handleCloseCoupon = () => { 
    setCouponAdded(false);
    setCouponAddedMessage("");
    setCoupon("");

  }
  
  const handleBuy = () => {
    if (!email || email === ""  || !email.includes("@") || !email.includes(".")) return;
    setCheckingOut(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/purchase-services/buy-domain?coupon=${coupon?? null}`,
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
    .then(async res=> {
      if(res.ok) {
        return res.json()
      }
      const mess = await res.json()
      throw new Error(mess.message)
    })
    .then(data => {
      setCheckingOut(false);
      window.location.href = data.session.url;
    })
    .catch(err => {
      setCheckingOut(false);
      setErrorMessage(`Error checking out: ${err.message}`)
      setTimeout(() => {
        setErrorMessage("");
      }, 10000);
    })
  }

  return (
    <Drawer anchor="right" open={open} onClose={handleCartClose}>
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
        <ListItem sx={{display: 'flex', flexDirection: 'row'}}>
          <Typography variant="subtitle1">Total: </Typography>
          <Typography variant="subtitle1" sx={{textDecoration: couponAdded? 'line-through': 'none', ml: 1}}>${total}</Typography>
          {couponAdded &&
           <><Typography variant='subtitle2' sx={{mb: 1.5}}>-{discounted}</Typography><Typography variant="subtitle1" sx={{ ml: 3 }}>${(totalPrice > 0)? totalPrice: 0}</Typography></>}
        </ListItem>
      </List>
      <Box sx={{display: 'flex', m: 3}}>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
            {
              counponAddedMessage &&
                      <Alert severity='success' sx={{width: '86%', mb: 2}} onClick={() => setCouponAddedMessage("")}>
                          {counponAddedMessage}
                      </Alert>
            }
            {
              couponErrorMessage &&
                      <Alert severity='error' sx={{width: '86%', mb: 2}} onClick={() => setCouponErrorMessage("")}>
                          {couponErrorMessage}
                      </Alert>
            }
            <TextField
              label="Coupon"
              size='small'
              value={coupon}
              disabled={couponAdded || isCouponAdding}
              onChange={(e) => setCoupon(e.target.value)}
              />
          </Box>
          <Button variant='contained' onClick={couponAdded? handleCloseCoupon : handleCouponUpdate} sx={{
            ml: 6,
            mr: 1,
            maxHeight: (couponErrorMessage || counponAddedMessage)? '45%': '100%',
            mt: (couponErrorMessage || counponAddedMessage)? 7.6: 0
           }}
           size='small'
           disabled={isCouponAdding}
           >
            {
              isCouponAdding? <CircularProgress size={30} />: couponAdded? <CloseIcon/> : "Apply"
            }
          </Button>
      </Box>
      <Box component="form" sx={{display: 'flex', m: 3, mt: 0, mb: 0}}>
         <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            {
              errorMessage &&
                      <Alert severity='error' sx={{width: '70%', mb: 2, overflow: 'hidden'}} onClick={() => setErrorMessage("")}>
                          {errorMessage}
                      </Alert>
            }
            <TextField
              label="Email"
              size='small'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Button variant='contained' onClick={handleBuy} sx={{
            ml: 6,
            mr: 1,
            maxHeight: errorMessage? '40%': '100%',
            mt: errorMessage? 10: 0,
            // marginLeft: errorMessage? "" : 6
           }}
           disabled={checkingOut || items.length <= 0}
           >
            {
              checkingOut? <CircularProgress size={30}/> : (<>Buy<KeyboardDoubleArrowRightIcon/></>)
            }
          </Button>
      </Box>

    </Drawer>
  );
}

