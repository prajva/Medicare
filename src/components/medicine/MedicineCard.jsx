import { ShoppingCart, Star, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { getMedicineImage } from '../../lib/seed'
import toast from 'react-hot-toast'

const CATEGORY_STYLES = {
  'Antibiotics':   { bg: 'from-blue-500 to-indigo-600',  emoji: '💊', light: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  'Pain Relief':   { bg: 'from-red-400 to-orange-400',   emoji: '💊', light: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' },
  'Vitamins':      { bg: 'from-green-400 to-teal-400',   emoji: '🌿', light: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400' },
  'Cold & Flu':    { bg: 'from-sky-400 to-cyan-500',     emoji: '🤧', light: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400' },
  'Digestive':     { bg: 'from-purple-400 to-pink-400',  emoji: '🫁', light: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' },
  'Skin Care':     { bg: 'from-yellow-400 to-amber-400', emoji: '✨', light: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' },
  'Diabetes Care': { bg: 'from-rose-400 to-red-400',     emoji: '🩸', light: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' },
  'Eye Care':      { bg: 'from-sky-400 to-blue-400',     emoji: '👁️', light: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400' },
}
const DEFAULT_STYLE = { bg: 'from-blue-400 to-indigo-400', emoji: '💉', light: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' }

export default function MedicineCard({ medicine }) {
  const { addItem }              = useCart()
  const { user }                 = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const navigate                 = useNavigate()

  const style = CATEGORY_STYLES[medicine.category] || DEFAULT_STYLE
  const wishlisted = isWishlisted(medicine.id)
  const imageSrc = getMedicineImage(medicine)

  function handleAddToCart(e) {
    e.preventDefault()
    if (!user) { toast.error('Please login to add items to cart'); navigate('/login'); return }
    addItem({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      image_url: imageSrc || medicine.image_url,
      category: medicine.category
    })
    toast.success(`${medicine.name} added! 🛒`, {
      style: { borderRadius: '12px', background: '#1e293b', color: '#fff' }
    })
  }

  function handleWishlist(e) {
    e.preventDefault()
    toggle({ ...medicine, image_url: imageSrc || medicine.image_url })
    if (!wishlisted) {
      toast.success(`Saved to wishlist! ❤️`, { icon: '❤️' })
    } else {
      toast('Removed from wishlist', { icon: '🤍' })
    }
  }

  return (
    <Link to={`/medicines/${medicine.id}`} className="group block h-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 h-full flex flex-col hover:-translate-y-1">

        {/* Visual Showcase: Real Image or Category Art */}
        <div className="relative h-44 bg-gray-50 dark:bg-gray-700/40 flex items-center justify-center p-3 overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={medicine.name}
              className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${style.bg} rounded-xl flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
              <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                {style.emoji}
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {medicine.is_featured && (
            <span className="absolute top-2 left-2 bg-amber-400 text-amber-950 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3" fill="currentColor"/> Featured
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlist}
            aria-label="Save to Wishlist"
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${
              wishlisted
                ? 'bg-white text-rose-500 shadow-md scale-110'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-rose-500 shadow-sm'
            }`}
          >
            <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.light}`}>
              {medicine.category}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              In Stock
            </span>
          </div>

          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
            {medicine.name}
          </h3>
          
          <p className="text-gray-400 dark:text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed">
            {medicine.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-gray-100 dark:border-gray-700/60">
            <div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white">₹{Number(medicine.price).toFixed(0)}</span>
              <span className="text-gray-400 text-xs ml-0.5">.{String(Number(medicine.price).toFixed(2)).split('.')[1]}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs px-3.5 py-2 rounded-xl transition-all font-semibold shadow-sm hover:shadow"
            >
              <ShoppingCart className="w-3.5 h-3.5"/>
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
