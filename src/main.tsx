import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling for root rendering
const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    console.log('Attempting to render App component...');
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('App component rendered successfully');
  } catch (error) {
    console.error('Error rendering App:', error);
    
    // Fallback rendering if App fails
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1>Error Rendering Application</h1>
        <p>There was an error rendering the application. Please check the console for details.</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${JSON.stringify(error, null, 2)}</pre>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Root element not found</div>';
}
