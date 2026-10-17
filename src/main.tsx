import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'boxicons/css/boxicons.min.css';
import './index.css';

// Prevent native browser dragging of links, images, and elements
if (typeof window !== 'undefined') {
  window.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
