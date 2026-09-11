import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Menu, X, LogOut, User, Pill, Package, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useDarkMode } from '../../context/DarkModeContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const { itemCount } = useCart()
  const { wishlist } = useWishlist()
  const { dark, toggle: toggleDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const displayName = profile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'User'

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
              <Pill className="w-5 h-5" />
            </div>
            <span>MediCare <span className="text-emerald-500">Plus</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">
              Home
            </Link>
            <Link to="/medicines" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">
              Medicines
            </Link>
            {user && (
              <Link to="/orders" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm flex items-center gap-1.5 transition-colors">
                <Package className="w-4 h-4 text-gray-400" />
                <span>Orders</span>
              </Link>
            )}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User status */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate max-w-[110px]">{displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300"
              aria-label="Toggle Dark Mode"
            >
              {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/wishlist" className="relative p-2 text-gray-600 dark:text-gray-300">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 ml-1"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 dark:text-gray-200 font-medium py-1.5"
          >
            Home
          </Link>
          <Link
            to="/medicines"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 dark:text-gray-200 font-medium py-1.5"
          >
            Medicines
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 dark:text-gray-200 font-medium py-1.5"
          >
            Wishlist ({wishlist.length})
          </Link>
          {user && (
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 dark:text-gray-200 font-medium py-1.5"
            >
              My Orders
            </Link>
          )}

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Signed in as <strong className="text-gray-900 dark:text-gray-100">{displayName}</strong>
                </span>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout() }}
                  className="text-sm text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 bg-blue-600 rounded-xl text-sm font-medium text-white shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
