import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registro de Service Worker para PWA Offline con auto-actualización inmediata
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        // Forzar chequeo de actualización contra el servidor cada vez que abre la página
        registration.update();

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] Nueva versión detectada; refrescando automáticamente.');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((err) => {
        console.error('ServiceWorker registration failed: ', err);
      });
  });
}
