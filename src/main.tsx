import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app';

/* Подключение стилей */
import './assets/fonts/fonts.scss';
import './assets/styles/variables.scss';
import './assets/styles/global.scss';
import './assets/styles/typography.scss';

const root = document.getElementById('root')!;
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
