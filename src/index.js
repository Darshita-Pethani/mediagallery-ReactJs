import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SnackBar from './components/snackbar';
import { MainProvider } from "./context/mainContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MainProvider>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="417621810105-1uppibbjctphcjc3p65hgbklauebe1kd.apps.googleusercontent.com">
        <App />
        <SnackBar />
      </GoogleOAuthProvider>
    </Provider>
  </MainProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
