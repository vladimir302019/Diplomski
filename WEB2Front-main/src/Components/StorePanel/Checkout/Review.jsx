import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';

export default function Review() {
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const cartArticles = useSelector((state) => state.cart.cartArticles);
  const [shipping, setShipping] = useState(null);
  const [payment, setPayment] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const storedShipping = JSON.parse(localStorage.getItem('shipping'));
    const storedPayment = JSON.parse(localStorage.getItem('payment'));

    setShipping(storedShipping);
    setPayment(storedPayment);
  }, []);
  
  useEffect(() => {
localStorage.setItem("comment", comment);

  },[comment])
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {cartArticles.map((product) => (
          <ListItem key={product.id} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={product.name} secondary={product.description} />
            <ListItemText primary={product.price} secondary={product.quantity}  sx={{ textAlign: 'right' }}  />
          </ListItem>
        ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {totalPrice}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          {shipping && (
            <Grid container>
              <React.Fragment key={shipping.firstName + ' ' + shipping.lastName}>
                <Grid item xs={12}>
                  <Typography gutterBottom>{shipping.address + ', ' + shipping.city + ', ' + shipping.zip}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>{shipping.state +', '+ shipping.country}</Typography>
                </Grid>
              </React.Fragment>
            </Grid>
          )}
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment details
          </Typography>
          {!payment && (
            <Grid container>
             <Grid container>
                <Grid item xs={12}>
                  <Typography gutterBottom>Cash on delivery</Typography>
                </Grid>
                
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item container xs={12} direction={'column'}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }} lg={12}>
            Leave a comment:
          </Typography>
            <Grid>
              <TextField  multiline rows={2} lg={12} sx={{width:'100%'}} onChange={(e) => (setComment(e.target.value))}/>
            </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
