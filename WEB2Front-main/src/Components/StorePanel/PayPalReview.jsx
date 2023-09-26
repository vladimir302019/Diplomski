import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { CssBaseline, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Navbar from '../Navbar/Navbar';
import { addOrderItemsAction, newOrderAction } from '../../Store/orderSlice';
import { clearCart } from '../../Store/cartSlice';
import { useNavigate } from 'react-router-dom';

export default function PayPalReview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const cartArticles = useSelector((state) => state.cart.cartArticles);
  const [payPal, setPaypal] = useState(false);
  const [comment, setComment] = useState('');
  const paypal = useRef();

  const [orderId, setOrderId] = useState(0);
  const [orderDone, setOrderDone] = useState(false);

  useEffect(() => {
    if(payPal){
    const comment = localStorage.getItem("comment");
    const totalPrice = localStorage.getItem("totalPrice");

    const requestBody =
    {
      comment: comment,
      totalPrice: totalPrice,
      address: "Default address",
      isPayed: true,
    }
    const execute = () => {
      dispatch(newOrderAction(requestBody)).then(() => {
        setOrderDone(true);
      });
      
    };
    execute();
  }else return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[payPal]);

  useEffect(() => {
    if (orderDone) {
    setOrderId(localStorage.getItem("orderId"));
    localStorage.setItem("orderId", 0);
    }
  }, [orderDone]);

  useEffect(() => {
    window.paypal.Buttons({
        createOrder: (data,actions, err) => {
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                    {
                       amount: {
                        value: totalPrice.toFixed(2).toString(),
                        currency_code: "USD",
                       },
                    },
                ],
            });
        },
        onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            setPaypal(true);
        },
        onError : (err) => {
            console.log(err);
        },
    }).render(paypal.current)
  },[])

  useEffect(() => {
    if (orderId !== 0) {
      const cartArticles = JSON.parse(localStorage.getItem("cartArticles"));
      const responseBody = {
        orderId: orderId,
        orderItems: cartArticles.map(article => ({
          quantity: article.quantity,
          articleId: article.id,
        })),
      }
      dispatch(addOrderItemsAction(responseBody)).then(() => {dispatch(clearCart()); localStorage.removeItem("comment"); navigate('/store');});

    }else return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[orderId]);

  useEffect(() => {
    localStorage.setItem("comment", comment);
  },[comment])
  return (
    <React.Fragment>
      <CssBaseline/>
        <Navbar/>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">Order summary</Typography>
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
        <Grid item container xs={12} direction={'column'}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }} lg={12}>
            Leave a comment:
          </Typography>
            <Grid>
              <TextField  multiline rows={2} lg={12} sx={{width:'100%'}} onChange={(e) => (setComment(e.target.value))}/>
            </Grid>
        </Grid>
        <Grid item container xs={12} direction={'column'}>
          <div ref={paypal}>

          </div>
        </Grid>
      </Grid>
      </Paper>
      </Container>
    </React.Fragment>
  );
}
