import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';

// Deliberately not wrapped in <StrictMode>: React double-invokes effects in dev,
// which means Aurora would build, tear down (releasing the WebGL context) and
// rebuild on the same canvas element. Once a context is lost the canvas cannot
// acquire another, so the aurora would silently fail in development.
createRoot(document.getElementById('root')).render(<App />);
