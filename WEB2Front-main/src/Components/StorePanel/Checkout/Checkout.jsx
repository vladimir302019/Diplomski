import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { useDispatch } from 'react-redux';
import { addOrderItemsAction, newOrderAction } from '../../../Store/orderSlice'
import Navbar from '../../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../../Store/cartSlice';
import { CssBaseline } from '@mui/material';

function getStepContent(step, addressSet, paymentSet) {
  switch (step) {
    case 0:
      return <AddressForm addressSet={addressSet} />;
    case 1:
     // return <PaymentForm paymentSet={paymentSet} />;
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(0);
  const [orderDone, setOrderDone] = useState(false);
  const steps = ['Shipping address', 'Review your order'];
  const [activeStep, setActiveStep] = useState(0);
  const [addressSet, setAddressSet] = useState(false);
  const [paymentSet, setPaymentSet] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (orderDone) {
    setOrderId(localStorage.getItem("orderId"));
    localStorage.setItem("orderId", 0);
    }
  }, [orderDone]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    if (activeStep === steps.length ) 
    {
      const comment = localStorage.getItem("comment");
      const totalPrice = localStorage.getItem("totalPrice");
      const shipping = JSON.parse(localStorage.getItem("shipping"));

      const requestBody =
      {
        comment: comment,
        totalPrice: totalPrice,
        address: shipping.address,
      }

      const execute = () => {
        dispatch(newOrderAction(requestBody)).unwrap().then(() => {
          setOrderDone(true);
        });
        
      };
      execute();

    };
  };
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
      dispatch(addOrderItemsAction(responseBody)).then(() =>{ clearCart(); localStorage.removeItem("comment")})
    }else return;
  },[orderId]);
    const handleBack = () => {
      setActiveStep(activeStep - 1);
    };

    useEffect(() => {
      if (activeStep === 2) {
        setPaymentSet(true);
      } else {
        setPaymentSet(false);
      }
    }, [activeStep]);

    useEffect(() => {
      if (activeStep === 1) {
        setAddressSet(true);
      } else {
        setAddressSet(false);
      }
    }, [activeStep]);

    const handleMenuClick = (event)=>{
      event.preventDefault();
      dispatch(clearCart());
      navigate('/menu');
    }

    return (
      <React.Fragment>
        <Navbar/>
        <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length + 1 ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Button sx={{ mt: 3, ml: 1 }} variant='contained' onClick={handleMenuClick}>
                Back to main menu.
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep, addressSet, paymentSet)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                
                >
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
      
      </React.Fragment>
    )
  }

