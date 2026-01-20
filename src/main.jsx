import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext'
import { CartProvider } from './Context/CartContext'
import { WishlistProvider } from './Context/WishlistContext'
import { ToastProvider } from './Context/ToastContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
