import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Store/Store';
import { UserProvider } from './Context/UserContext';
import { AuthProvider } from './Context/AuthContext';
import ScrollToTop from './Components/Client/ScrollToTop';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <UserProvider>
        <Router>
          <ScrollToTop />
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </Router>
      </UserProvider>
    </AuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
