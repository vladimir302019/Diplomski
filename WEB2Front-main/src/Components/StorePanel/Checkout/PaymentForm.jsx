import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function PaymentForm({paymentSet}) {
  const [nameOfCard, setNameOfCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(()=> {
    if(paymentSet)
     { return;}
      else{
        const payment ={
          nameOfCard: nameOfCard,
          cardNumber: cardNumber,
          expDate: expDate,
          cvv: cvv,
        }

        localStorage.setItem("payment", JSON.stringify(payment));
      }
  },[nameOfCard, expDate, cardNumber, cvv]);
  
  useEffect(() => {
    const storedPayment = JSON.parse(localStorage.getItem('payment'));
    if (storedPayment) {
      setNameOfCard(storedPayment.nameOfCard);
      setExpDate(storedPayment.expDate);
      setCardNumber(storedPayment.cardNumber);
      setCvv(storedPayment.cvv);
    }
  }, []);


  const handleNameOfCardBlur = (event) => {
    setNameOfCard(event.target.value);
  };

  const handleCardNumberBlur = (event) => {
    setCardNumber(event.target.value);
  };

  const handleExpDateBlur = (event) => {
    setExpDate(event.target.value);
  };

  const handleCvvBlur = (event) => {
    setCvv(event.target.value);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            fullWidth
            value={nameOfCard}
            autoComplete="cc-name"
            variant="standard"
            onChange={handleNameOfCardBlur}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            value={cardNumber}
            autoComplete="cc-number"
            variant="standard"
            onChange={handleCardNumberBlur}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            value={expDate}
            autoComplete="cc-exp"
            variant="standard"
            onChange={handleExpDateBlur}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            value={cvv}
            autoComplete="cc-csc"
            variant="standard"
            onChange={handleCvvBlur}
          />
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </React.Fragment>
  );
}
