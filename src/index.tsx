import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Certifique-se de que o caminho está correto
import './index.css';     // Importando o CSS

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
