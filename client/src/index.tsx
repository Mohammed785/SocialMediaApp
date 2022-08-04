import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css"
import "@popperjs/core"
import "bootstrap/dist/js/bootstrap.min.js"
import App from './App';
import { AuthProvider } from './context/authContext';
import { SocketProvider } from './context/socketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
