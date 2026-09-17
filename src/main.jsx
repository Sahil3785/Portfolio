import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouterProvider } from './lib/router';
import './styles/global.css';
import './styles/sections.css';
import './styles/pages.css';
import './styles/motion.css';
import './styles/productive.css';

// Reveal styles only hide content once we know JavaScript is running.
document.documentElement.classList.replace('no-js', 'js');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider>
        <App />
      </RouterProvider>
    </ErrorBoundary>
  </StrictMode>
);
