import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Цей файл просто бере файл App.jsx і "вмонтовує" його
// у тег <div id="root"></div>, який лежить у index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);