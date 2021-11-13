import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} timeout={3000}>
      <App />
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
