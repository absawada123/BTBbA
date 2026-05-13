// client/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />       {/* AuthProvider lives inside App, wrapping Routes */}
    </BrowserRouter>
  </React.StrictMode>
);