import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './estilos/global.css'
import App from './App.jsx'

const CLIENT_ID_GOOGLE = import.meta.env.VITE_GOOGLE_CLIENT_ID || '://googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID_GOOGLE}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
