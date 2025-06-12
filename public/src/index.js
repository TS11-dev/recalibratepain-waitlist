import React from 'react';
import ReactDOM from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const paypalOptions = {
  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "test",
  currency: "USD",
  intent: "donation"
};

root.render(
  <React.StrictMode>
    <PayPalScriptProvider options={paypalOptions}>
      <App />
      <Toaster position="top-center" />
    </PayPalScriptProvider>
  </React.StrictMode>
);
