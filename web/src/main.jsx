import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/noto-sans-tc/400.css';
import '@fontsource/noto-sans-tc/500.css';
import '@fontsource/noto-sans-tc/600.css';

createRoot(document.getElementById('root')).render(<App />);
