import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./Store/store";
import { ToastContainer } from 'react-toastify';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

const defaultTheme = createTheme();

let client = new ApolloClient({
  uri: 'http://localhost:5150/graphql',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={defaultTheme}>
    <Router>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
      <Provider store={store}>
        <ApolloProvider client={client}>
        <App/>
        </ApolloProvider>
      </Provider>
      </GoogleOAuthProvider>
      <ToastContainer/>
    </Router>
    </ThemeProvider>
  
);

