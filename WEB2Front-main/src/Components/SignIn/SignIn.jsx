import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAction, googleLoginAction } from '../../Store/userSlice';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

function SignIn(){
  const dispatch = useDispatch();
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailBlur, setIsEmailBlur] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordBlur, setIsPasswordBlur] = useState(false);



  //EMAIL HANDLE
  const handleEmailChange = (event) =>{
    setIsEmailValid(event.target.value.trim().length > 0);
  }
  const handleEmailBlur = (event) => {
    setIsEmailBlur(true)
  }

  //PASSWORD HANDLE
  const handlePasswordChange = (event) =>{
    setIsPasswordValid(event.target.value.trim().length > 0);
  }
  const handlePasswordBlur = (event) => {
    setIsPasswordBlur(true)
  }

  //GOOGLE HANDLE
  const googleLoginHandler = (response) => {
    let data = new FormData();
    data.append("googleToken", response.credential);
    dispatch(googleLoginAction(data))
      .unwrap()
      .then(() => navigate("/menu"))
      .catch((error)=> {
        console.error("Google login failed:", error);
      });
  };

  const googleLoginErrorHandler = () => {
    toast.error("Google login error", {
      position: "top-center",
      autoClose: 2500,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const requestBody = {
      email: data.get('email').toString().trim(),
      password: data.get('password').toString().trim(),
    };

    dispatch(loginAction(requestBody))
      .unwrap()
      .then(() => navigate("/menu"))
      .catch((error)=> {
        console.error("Login failed:", error);
      })
  };

  return (
    
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              error={!isEmailValid && isEmailBlur}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={!isPasswordValid && isPasswordBlur}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Grid
              item
              xs
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <GoogleLogin
                onSuccess={googleLoginHandler}
                onError={googleLoginErrorHandler}
              />
            </Grid>
          </Box>
        </Box>
        
      </Container>
  
    
  );
};

export default SignIn;