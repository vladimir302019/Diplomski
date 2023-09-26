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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { useEffect } from 'react';
import { MenuItem } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { registerAction } from '../../Store/userSlice';
import { toast } from 'react-toastify';
const userRoles = [ 'Buyer', 'Seller' ];


function Register(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //VALIDATE STATES
  // eslint-disable-next-line no-unused-vars
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [isFullNameValid, setIsFullNameValid] = useState(false);
  const [isFullNameBlur, setIsFullNameBlur] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isUsernameBlur, setIsUsernameBlur] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailBlur, setIsEmailBlur] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordBlur, setIsPasswordBlur] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isConfirmPasswordBlur, setIsConfirmPasswordBlur] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isAddressBlur, setIsAddressBlur] = useState(false);
  const [isUserRoleValid, setIsUserRoleValid] = useState(false);
  const [isUserRoleBlur, setIsUserRoleBlur] = useState(false);
  //STATES
  const [selectedDate, setSelectedDate] = useState(null);
  const [localDate, setLocalDate] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  //FULLNAME HANDLE
  const handleFullNameChange = (event) =>{
    setIsFullNameValid(event.target.value.trim().length > 0);
  }
  const handleFullNameBlur = (event) => {
    setIsFullNameBlur(true)
  }

  //USERNAME HANDLE
  const handleUsernameChange = (event) =>{
    setIsUsernameValid(event.target.value.trim().length > 0);
  }
  const handleUsernameBlur = (event) => {
    setIsUsernameBlur(true)
  }

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

  //CONFIRM PASSWORD HANDLE
  const handleConfirmPasswordChange = (event) =>{
    setIsConfirmPasswordValid(event.target.value.trim().length > 0);
  }
  const handleConfirmPasswordBlur = (event) => {
    setIsConfirmPasswordBlur(true)
  }

  //ADDRESS HANDLE
  const handleAddressChange = (event) =>{
    setIsAddressValid(event.target.value.trim().length > 0);
  }
  const handleAddressBlur = (event) => {
    setIsAddressBlur(true)
  }
  //ROLE HANDLE
  const handleUserRoleBlur = (event) => {
    setIsUserRoleBlur(true)
  }
  //DATE HANDLE
  const handleDateChange = (date) =>{
    setSelectedDate(date);
  };
  useEffect(() => {
    if (selectedDate) {
      const localDateTime = new Date(selectedDate).toLocaleDateString();
      setLocalDate(localDateTime ? localDateTime : "");
    }
  }, [selectedDate, navigate]);



  //ROLE HANDLE
  const handleUserRole = (event) =>{
    setSelectedRole(event.target.value);
    setIsUserRoleValid(event.target.value.trim().length > 0)
  }

  // SUBMIT
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const password = data.get('password');
    const confirmPassword = data.get('confirmpassword');

    if(password !== confirmPassword) {
      setIsPasswordConfirmed(false);
    }

    const requestBody = {
      fullName: data.get('name').toString().trim(),
      username: data.get('username').toString().trim(),
      email: data.get('email').toString().trim(),
      password: data.get('password').toString().trim(),
      birthdate: localDate ? new Date(localDate.toString()).toISOString() : "",
      address: data.get('address').toString().trim(),
      type: data.get('userrole').toString() === 'Buyer' ? 1 : 0,
    }
    if(isFullNameValid && isUserRoleValid && isUsernameValid && isEmailValid && isPasswordValid && isAddressValid && localDate!== "") 
    {  
    dispatch(registerAction(requestBody)).then(() => navigate("/signin"))
    }else{
      toast.error("All fields must be filled!",{
        position: "top-center",
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    };
  };

  return (
  
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: '10%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  onChange={handleFullNameChange}
                  onBlur={handleFullNameBlur}
                  error={!isFullNameValid && isFullNameBlur}
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={handleUsernameChange}
                  onBlur={handleUsernameBlur}
                  error={!isUsernameValid && isUsernameBlur}
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  error={!isEmailValid && isEmailBlur}
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  error={!isPasswordValid && isPasswordBlur}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  error={!isConfirmPasswordValid && isConfirmPasswordBlur}
                  name="confirmpassword"
                  label="Confirm password"
                  type="password"
                  id="confirmpassword"
                  autoComplete="confirm-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        required
                        fullWidth
                        name="birthdate"
                        label="Birth Date *"
                        id="birthdate"
                        onChange={handleDateChange}
                    />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                required
                fullWidth
                name="userrole"
                label="User role"
                id="userrole"
                select
                value={selectedRole}
                onChange={handleUserRole}
                onBlur={handleUserRoleBlur}
                error={!isUserRoleValid && isUserRoleBlur}
                >
                  {userRoles.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={handleAddressChange}
                  onBlur={handleAddressBlur}
                  error={!isAddressValid && isAddressBlur}
                  name="address"
                  label="Address "
                  id="address"
                  autoComplete="street-address"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
};


export default Register;