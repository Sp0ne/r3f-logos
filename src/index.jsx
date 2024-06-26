import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './reset.css'
import './styles.css'
import Application from './Application'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <Application />
  </StrictMode>
)

// 🥚
console.info('%c🚨 ️Never Copy/Paste anything here', 'color:#8b0000;font-size:1rem;font-weight:bold')
console.info('%c</💻> with ❤ by @vinces. Have Fun 🍻', 'color:#8fc471;font-size:1.1rem;font-weight:bold')
