import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import './index.css'
import { Provider } from 'react-redux';
import { persistor, store } from './features/loginMoodSlice'
import { PersistGate } from 'redux-persist/integration/react';
import { disableReactDevTools } from "@fvilers/disable-react-devtools";


export let baseUrl = "";
if (process.env.NODE_ENV === "production") {
  console.log("prod");
  disableReactDevTools();
  baseUrl = "https://book-app-api.onrender.com";
} else if (process.env.NODE_ENV === "development") {
  console.log("dev");
  baseUrl = "http://127.0.0.1:3000";
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PersistGate persistor={persistor} >
      <Provider store={store}>
        <BrowserRouter>
          <CookiesProvider>
            <App />
          </CookiesProvider>
        </BrowserRouter>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
