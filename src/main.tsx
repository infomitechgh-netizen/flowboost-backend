import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById("root")!);

try {
  root.render(<App />);
} catch (err) {
  console.error("React render error:", err);
}
