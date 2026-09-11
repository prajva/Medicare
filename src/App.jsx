import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { DarkModeProvider } from './context/DarkModeContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import MedicinesPage from './pages/MedicinesPage'
import MedicineDetailPage from './pages/MedicineDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import WishlistPage from './pages/WishlistPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Public Storefront Routes with Layout */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/medicines" element={<Layout><MedicinesPage /></Layout>} />
                <Route path="/medicines/:id" element={<Layout><MedicineDetailPage /></Layout>} />
                <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
                <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
                <Route path="/terms" element={<Layout><TermsPage /></Layout>} />

                {/* Protected Customer Routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Layout><CheckoutPage /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Layout><OrdersPage /></Layout>
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  )
}
