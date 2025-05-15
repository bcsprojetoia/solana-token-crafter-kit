
// Import polyfills first - this must be the first import
import './polyfills';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add console log to debug initialization
console.log('Aplicação iniciando...');

// Wrap in error boundary
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Elemento root não encontrado");
  }
  
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('App renderizado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar a aplicação:', error);
  
  // Try to render an error message on page
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; background: #340e0e; border-radius: 5px; margin: 20px;">
        <h2>Erro ao carregar a aplicação</h2>
        <p>Ocorreu um erro ao inicializar. Por favor recarregue a página ou verifique o console para mais detalhes.</p>
      </div>
    `;
  }
}
