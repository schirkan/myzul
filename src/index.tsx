import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import 'the-new-css-reset/css/reset.css'
import { ThemeProvider } from './common/ThemeContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);