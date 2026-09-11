import { ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CATEGORY_STYLES = {
  'Pain Relief':   { bg: 'from-red-400 to-orange-400',   emoji: '💊', light: 'bg-red-50 text-red-600' },
  'Vitamins':      { bg: 'from-green-400 to-teal-400',   emoji: '🌿', light: 'bg-green-50 text-green-600' },
  'Cold & Flu':    { bg: 'from-blue-400 to-cyan-400',    emoji: '🤧', light: 'bg-blue-50 text-blue-600' },
  'Digestive':     { bg: 'from-purple-400 to-pink-400',  emoji: '🫁', light: 'bg-purple-50 text-purple-600' },
  'Skin Care':     { bg: 'from-yellow-400 to-amber-400', emoji: '✨', light: 'bg-yellow-50 text-yellow-700' },
  'Diabetes Care': { bg: 'from-rose-400 to-red-400',     emoji: '🩸', light: 'bg-rose-50 text-rose-600' },
  'Eye Care':      { bg: 'from-sky-400 to-blue-400',     emoji: '👁️', light: 'bg-sky-50 text-sky-600' },
}
const DEFAULT_STYLE = { bg: 'from-blue-400 to-indigo-400', emoji: '💉', light: 'bg-blue-50 text-blue-600' }

export default function MedicineCard({ medicine }) {
  const { addItem }  = useCart()
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const style = CATEGORY_STYLES[medicine.category] || DEFAULT_STYLE

  function handleAddToCart(e) {
    e.preventDefault()
    if (!user) { toast.error('Please login to add items to cart'); navigate('/login'); return }
    addItem({ id: medicine.id, name: medicine.name, price: medicine.price, image_url: medicine.image_url, category: medicine.category })
    toast.success(`${medicine.name} added! 🛒`, {
      style: { borderRadius: '12px', background: '#1e293b', color: '#fff' }
    })
  }

  return (
    <Link to={`/medicines/${medicine.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 h-full flex flex-col hover:-translate-y-1">

        {/* Visual Header — gradient + emoji */}
        <div className={`relative bg-gradient-to-br ${style.bg} h-40 flex items-center justify-center overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"/>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"/>
          {/* Emoji */}
          <span className="text-6xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10">
            {style.emoji}
          </span>
          {/* Featured badge */}
          {medicine.is_featured && (
            <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" fill="currentColor"/> Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category chip */}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-2 ${style.light}`}>
            {medicine.category}
          </span>

          <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
            {medicine.name}
          </h3>
          <p className="text-gray-400 text-xs line-clamp-1 mb-3">
            {medicine.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-xl font-extrabold text-gray-900">₹{Number(medicine.price).toFixed(0)}</span>
              <span className="text-gray-400 text-xs ml-0.5">.{String(medicine.price.toFixed(2)).split('.')[1]}</span>
            </div>
            <button onClick={handleAddToCart}
              className={`flex items-center gap-1.5 bg-gradient-to-r ${style.bg} text-white text-xs px-3 py-2 rounded-xl transition-all font-semibold hover:shadow-md hover:scale-105 active:scale-95`}>
              <ShoppingCart className="w-3.5 h-3.5"/>
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
