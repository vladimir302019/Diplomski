import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../Store/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state)=>state.cart.cartArticles);
  const totalPrice = useSelector((state)=>state.cart.totalPrice);
  const handleCheckout = () => {
    navigate('/checkout');
  }

  const handleRemoveArticle = (article) => {
    dispatch(removeFromCart(article));
  }
  
  const handlePayPal = () => {
    navigate('/review');
  }
  const user = useSelector((state) => state.user.user);
  const isAdmin = user.type ===2;
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography color="primary" variant="h6" sx={{ mb: 2 }}>
          Cart
        </Typography>
        {cartItems.map((article) => (
          <Grid item key={article.id} xs={12} sx={{ mb: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', width: '30%' }}>
                <Typography>{article.name}</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'center', width: '30%' }}>
                <Typography variant="body2">Price: {article.price}</Typography>
              </div>
              <div style={{ textAlign: 'right', width: '30%' }}>
                <Typography variant="body2"
                  sx={{ textAlign: 'right' }}>Quantity: {article.quantity}</Typography>
              </div>
              <div>
                <Button color='error' onClick={()=> handleRemoveArticle(article)}>Remove</Button>
              </div>
            </div>
          </Grid>
        ))}
        <Grid container>
          <Grid item xs={8}>
            <Typography variant="h5" textAlign="left">
              Total price:
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Typography variant="h5">{totalPrice}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" textAlign="left">
              Shipping is not included in price
            </Typography>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCheckout} disabled ={isAdmin || totalPrice === 0}>
          Checkout
        </Button>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePayPal} disabled ={isAdmin || totalPrice === 0}>
          Pay with PayPal
        </Button>
      </Paper>
    </Grid>
  );
};

export default Cart;