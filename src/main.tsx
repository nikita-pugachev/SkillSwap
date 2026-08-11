import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app';

/* Подключение стилей */
import './assets/fonts/fonts.scss';
import './assets/styles/variables.scss';
import './assets/styles/global.scss';
import './assets/styles/typography.scss';

const THEME_STORAGE_KEY = 'theme';
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

if (savedTheme === 'dark' || savedTheme === 'light') {
  document.documentElement.dataset.theme = savedTheme;
} else {
  document.documentElement.dataset.theme = 'light';
}

const root = document.getElementById('root')!;
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
