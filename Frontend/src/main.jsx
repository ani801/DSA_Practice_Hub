import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { PracticeContextProvider } from './context/PracticeContext.jsx'

createRoot(document.getElementById('root')).render(
 
   <StrictMode>
  <PracticeContextProvider>
   <BrowserRouter>
    <App />
    </BrowserRouter >
  </PracticeContextProvider>
  </StrictMode>,
 
 
)
