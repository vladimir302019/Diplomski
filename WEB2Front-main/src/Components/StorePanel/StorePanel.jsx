import React, {  useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Products from './Products';
import Navbar from '../Navbar/Navbar';
import Cart from './Cart';
import  CssBaseline  from '@mui/material/CssBaseline';

export default function StorePanel() {
    const [adding, setAdding] = useState(false); 


    return (
        <React.Fragment>
            <CssBaseline/>
            <Navbar></Navbar>
            <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={8}>
                <Paper
                    sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    }}
                >
                    <Products />
                </Paper>
                </Grid>
              {!adding  && <Cart/>}
            </Grid>
            </Container>
        </React.Fragment>
    )
}