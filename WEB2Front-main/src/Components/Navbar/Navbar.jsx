import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import {  Assignment, ExitToApp } from '@mui/icons-material';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/userSlice';
import { clearAll } from '../../Store/orderSlice';
import { clearCart } from '../../Store/cartSlice';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WidgetsIcon from '@mui/icons-material/Widgets';
import MapIcon from '@mui/icons-material/Map';
const Navbar = () => {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let isAdmin = false;
    let isBuyer = false;
    let isSeller = false;
    let isNotApprovedSeller = false;
    if(user.type === 0){
      isSeller = true;
      if(user.denied || (!user.denied && !user.approved)){
        isNotApprovedSeller = true;
      }
    }
    else if(user.type === 1)
      isBuyer = true;
    else
      isAdmin = true;

    const logoutClickHandler = (event) => {
        event.preventDefault();
        navigate('/signin');
        dispatch(logout());
        dispatch(clearAll());
        dispatch(clearCart());
    }
    
    const handleMapClick = (event) => {
      event.preventDefault();
      navigate('/map');
    }
    const handleProfileClick = (event) => {
      event.preventDefault();
      navigate('/profile');
    }

    const handleAdminPanelClick = (event) => {
      event.preventDefault();
      navigate('/adminPanel')
    }

    const handleSellerPanelClick = (event) => {
      event.preventDefault();
      navigate('/sellerPanel');
    }

    const handleStoreClick = (event) => {
      event.preventDefault();
      navigate('/store');
    }

    const handleOrdersClick = (event) => {
      event.preventDefault();
      navigate('/orders');
    }

    const handleMenuClick = (event)=> {
      event.preventDefault();
      navigate('/menu');
    }
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={handleMenuClick}>
          <WidgetsIcon fontSize="large" />
        </IconButton>
        <div style={{ flex: 1 }} /> 
        <div style={{ display: "flex", justifyContent: "center" }}>
        <IconButton color="inherit" onClick={handleProfileClick}>
          <AccountBoxIcon fontSize="large" />
        </IconButton>
        {(!isSeller && !isAdmin)  && <IconButton color="inherit" onClick={handleStoreClick}>
          <LocalMallIcon fontSize="large" />
        </IconButton>}
        {((isSeller && !isNotApprovedSeller) || isAdmin || isBuyer ) &&<IconButton color="inherit" onClick={handleOrdersClick}>
          <Assignment fontSize="large" />
        </IconButton>}
        {isSeller && !isBuyer && !isNotApprovedSeller && !isAdmin &&(
       <> <IconButton color="inherit" onClick={handleSellerPanelClick}>
          <PostAddIcon fontSize="large" />
        </IconButton>
         </>
        )}
        {!isSeller && !isBuyer && isAdmin &&(
        <IconButton color="inherit" onClick={handleAdminPanelClick}>
          <AdminPanelSettingsIcon fontSize="large" />
        </IconButton>
        )}
        </div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        </Typography>
        <Button color="inherit" endIcon={<ExitToApp fontSize="large"/>} sx={{fontSize: '1.2rem', padding: '12px'}} onClick={logoutClickHandler}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
