import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';
import Box from '@mui/material/Box';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Assignment } from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Store/userSlice';
import { useDispatch } from 'react-redux';
import { getImageAction, getUserInfoAction } from '../../Store/userSlice';
import { clearAll } from '../../Store/orderSlice';
import { clearCart } from '../../Store/cartSlice';
import CssBaseline from '@mui/material/CssBaseline';
import MapIcon from '@mui/icons-material/Map';
const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) !== null ? JSON.parse(localStorage.getItem("user")) : null;
 
  //useSelector((state) => state.user.user)
  const [isInitial, setIsInitial] = useState(true);
  //const [initial, setInitial] = useState(true);
  //const [user, setUser] = useState(null);
  
  const profileClickHandler = (event) => {
    event.preventDefault();
    navigate('/profile');
  }
  const storeClickHandler = (event) => {
    event.preventDefault();
    navigate('/store');
  }
  const ordersClickHandler = (event) => {
    event.preventDefault();
    navigate('/orders');

  }
  const adminPanelClickHandler = (event) => {
    event.preventDefault();
    navigate('/adminPanel');
  }

  const sellerPanelClickHandler = (event) => {
    event.preventDefault();
    navigate('/sellerPanel');
  }
  const handleMapClick = (event) => {
    event.preventDefault();
    navigate('/map');
  }

  const logoutClickHandler = (event) => {
    event.preventDefault();
    navigate('/signin');
    dispatch(logout());
    dispatch(clearAll());
    dispatch(clearCart());
  }
  
  useEffect(() => {
    if (!isInitial) {
      return;
    }

    const execute = () => {
      dispatch(getUserInfoAction());
      dispatch(getImageAction());
    };

    execute();
    setIsInitial(false);

  }, [isInitial]);

  if (!user) {
    return <div>Loading...</div>;
  }else

  return (
    <Box
      sx={{
        marginTop: '15%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <CssBaseline />
      <Stack
        direction={{ xs: 'row', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Grid item xs='auto'>
          <Box sx={{ boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.25)', display: 'inline-block' }}>
            <Button style={{ width: '200px', height: '300px' }} onClick={profileClickHandler}>
              <AccountBoxIcon fontSize='large' style={{ width: '200px', height: '300px', color: "royalblue" }} />
            </Button>
          </Box>
        </Grid>
        {user.type !== 0 && user.type !== 2 &&
          <Grid item xs='auto'>
            <Box sx={{ boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.25)', display: 'inline-block' }}>
              <Button style={{ width: '200px', height: '300px' }} onClick={storeClickHandler}>
                <LocalMallIcon fontSize='large' style={{ width: '200px', height: '300px', color: "royalblue" }} />
              </Button>
            </Box>
          </Grid>}
        {((user.type === 0 && user.approved) || user.type === 1 || user.type === 2) && <Grid item xs='auto'>
          <Box sx={{ boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.25)', display: 'inline-block' }}>
            <Button style={{ width: '200px', height: '300px' }} onClick={ordersClickHandler}>
              <Assignment fontSize='large' style={{ width: '200px', height: '300px', color: "royalblue" }} />
            </Button>
          </Box>
        </Grid>}
        {user.type === 2 &&
          <Grid item xs='auto'>
            <Box sx={{ boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.25)', display: 'inline-block' }}>
              <Button style={{ width: '200px', height: '300px' }} onClick={adminPanelClickHandler}>
                <AdminPanelSettingsIcon fontSize='large' style={{ width: '200px', height: '300px', color: "royalblue" }} />
              </Button>
            </Box>
          </Grid>}
        {user.type === 0 && user.approved && (<>
          <Grid item xs='auto'>
            <Box sx={{ boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.25)', display: 'inline-block' }}>
              <Button style={{ width: '200px', height: '300px' }} onClick={sellerPanelClickHandler}>
                <PostAddIcon fontSize='large' style={{ width: '200px', height: '300px', color: "royalblue" }} />
              </Button>
            </Box>
          </Grid>
         {/* <Grid item xs='auto'>
          <Box sx={{ boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.25)', display: 'inline-block' }}>
            <Button style={{ width: '200px', height: '300px' }} onClick={handleMapClick}>
              <MapIcon fontSize='large' style={{ width: '200px', height: '300px', color: "royalblue" }} />
            </Button>
          </Box>
        </Grid>*/}
          </>
        )}
        <Grid item xs='auto'>
          <Box sx={{ boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.25)', display: 'inline-block' }}>
            <Button style={{ width: '200px', height: '300px' }} onClick={logoutClickHandler}>
              <LogoutIcon fontSize='large' style={{ width: '200px', height: '300px', color: "darkred" }} />
            </Button>
          </Box>
        </Grid>
      </Stack>

    </Box>

  );
};

export default Menu;