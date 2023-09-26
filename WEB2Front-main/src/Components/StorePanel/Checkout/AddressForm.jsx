import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

export default function AddressForm({addressSet }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  
  useEffect(()=> {
    if(addressSet)
     { return;}
      else{
        const shipping ={
          firstName: firstName,
          lastName: lastName,
          address: address1,
          city: city,
          country: country,
          state: state,
          zip: zip, 
        }

        localStorage.setItem("shipping", JSON.stringify(shipping));
      }
  },[firstName, lastName, address1, city, state, zip, country]);
  
  useEffect(() => {
    const storedShipping = JSON.parse(localStorage.getItem('shipping'));
    if (storedShipping) {
      setFirstName(storedShipping.firstName);
      setLastName(storedShipping.lastName);
      setAddress1(storedShipping.address);
      setCity(storedShipping.city);
      setState(storedShipping.state);
      setZip(storedShipping.zip);
      setCountry(storedShipping.country);
    }
  }, []);

  const handleFirstNameBlur = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameBlur = (event) => {
    setLastName(event.target.value);
  };

  const handleAddress1Blur = (event) => {
    setAddress1(event.target.value);

  };

  const handleCityBlur = (event) => {
    setCity(event.target.value);
  };

  const handleStateBlur = (event) => {
    setState(event.target.value);
  };

  const handleZipBlur = (event) => {
    setZip(event.target.value);
  };

  const handleCountryBlur = (event) => {
    setCountry(event.target.value);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            value={firstName}
            autoComplete="given-name"
            variant="standard"
            onChange={handleFirstNameBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            value={lastName}
            autoComplete="family-name"
            variant="standard"
            onChange={handleLastNameBlur}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            value={address1}
            autoComplete="shipping address-line1"
            variant="standard"
            onChange={handleAddress1Blur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            value={city}
            autoComplete="shipping address-level2"
            variant="standard"
            onChange={handleCityBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            value={state}
            variant="standard"
            onChange={handleStateBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            value={zip}
            autoComplete="shipping postal-code"
            variant="standard"
            onChange={handleZipBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            value={country}
            autoComplete="shipping country"
            variant="standard"
            onChange={handleCountryBlur}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
