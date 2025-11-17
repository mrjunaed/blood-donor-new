import React from 'react';
import ReactDOM from 'react-dom/client';
import BloodDonationApp from './blood.jsx';
import './storage.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BloodDonationApp />
  </React.StrictMode>
);
