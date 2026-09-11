import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, LogOut, User, Pill, Package } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Pill className="w-6 h-6" />
            <span>MediCare <span className="text-green-500">Plus</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>
            <Link to="/medicines" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Medicines</Link>
            {user && (
              <Link to="/orders" className="text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center gap-1">
                <Package className="w-4 h-4" />Orders
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user.user_metadata?.full_name?.split(' ')[0] || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-blue-600 font-medium text-sm hover:underline">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium py-1">Home</Link>
          <Link to="/medicines" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium py-1">Medicines</Link>
          {user && (
            <Link to="/orders" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium py-1">My Orders</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="w-full text-left text-red-600 font-medium py-1">Logout</button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-blue-600 font-medium">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
