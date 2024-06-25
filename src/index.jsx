import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// 🥚
console.info('%c🚨 ️Never Copy/Paste anything here', 'color:#8b0000;font-size:1rem;font-weight:bold')
console.info('%c</💻> with ❤ by @vinces. Have Fun 🍻', 'color:#8fc471;font-size:1.1rem;font-weight:bold')
