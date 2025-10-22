import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './fontawesome/css/all.min.css';
import './icon-fallback.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');
createRoot(rootEl).render(<App />);
