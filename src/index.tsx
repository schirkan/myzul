import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import 'the-new-css-reset/css/reset.css'
import { ThemeProvider } from './common/ThemeContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
