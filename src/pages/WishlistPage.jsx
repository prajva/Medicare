import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORY_STYLES = {
  'Pain Relief':   { bg: 'from-red-400 to-orange-400',   emoji: '💊' },
  'Vitamins':      { bg: 'from-green-400 to-teal-400',   emoji: '🌿' },
  'Cold & Flu':    { bg: 'from-blue-400 to-cyan-400',    emoji: '🤧' },
  'Digestive':     { bg: 'from-purple-400 to-pink-400',  emoji: '🫁' },
  'Skin Care':     { bg: 'from-yellow-400 to-amber-400', emoji: '✨' },
  'Diabetes Care': { bg: 'from-rose-400 to-red-400',     emoji: '🩸' },
  'Eye Care':      { bg: 'from-sky-400 to-blue-400',     emoji: '👁️' },
}
const DEFAULT_STYLE = { bg: 'from-blue-400 to-indigo-400', emoji: '💉' }

export default function WishlistPage() {
  const { wishlist, remove, clear } = useWishlist()
  const { addItem } = useCart()
  const { user }    = useAuth()
  const navigate    = useNavigate()

  function handleAddToCart(item) {
    if (!user) { navigate('/login'); return }
    addItem(item)
    toast.success(`${item.name} added to cart! 🛒`)
  }

  if (wishlist.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-4">🤍</div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your wishlist is empty</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Save medicines you love by tapping the ♡ heart button</p>
      <Link to="/medicines"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
        <ShoppingBag className="w-5 h-5"/> Browse Medicines
      </Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500"/>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Wishlist</h1>
          <span className="text-gray-400 font-normal">({wishlist.length})</span>
        </div>
        <button onClick={clear}
          className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors">
          <Trash2 className="w-4 h-4"/> Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map(item => {
          const style = CATEGORY_STYLES[item.category] || DEFAULT_STYLE
          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
              <Link to={`/medicines/${item.id}`}>
                <div className={`bg-gradient-to-br ${style.bg} h-32 flex items-center justify-center relative`}>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"/>
                  <span className="text-5xl">{style.emoji}</span>
                </div>
              </Link>
              <div className="p-3">
                <Link to={`/medicines/${item.id}`}>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-blue-600 font-bold text-base mb-3">₹{Number(item.price).toFixed(2)}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleAddToCart(item)}
                    className={`flex-1 flex items-center justify-center gap-1 bg-gradient-to-r ${style.bg} text-white text-xs py-2 rounded-lg font-semibold hover:shadow-md transition-all`}>
                    <ShoppingCart className="w-3.5 h-3.5"/> Add
                  </button>
                  <button onClick={() => remove(item.id)}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
