import React from 'react';
import ReactDOM from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const paypalOptions = {
  "client-id": "AXelGwuFcPNmrOaqtvMgsrstOqJL6aNoNEH1m-Uh_0hn_BlSdRw2QFiQ2TV2-Qd8fsPLpTzer1DgGHb2",
  currency: "USD",
  intent: "capture",
  "disable-funding": "credit,card"
};

root.render(
  <React.StrictMode>
    <PayPalScriptProvider options={paypalOptions}>
      <App />
      <Toaster position="top-center" />
    </PayPalScriptProvider>
  </React.StrictMode>
);