import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { ShoppingCart, ArrowLeft, Star, Package, Tag, CheckCircle, Heart, ShieldCheck, Truck } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORY_STYLES = {
  'Pain Relief':   { bg: 'from-red-400 to-orange-400',   emoji: '💊', light: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' },
  'Vitamins':      { bg: 'from-green-400 to-teal-400',   emoji: '🌿', light: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400' },
  'Cold & Flu':    { bg: 'from-blue-400 to-cyan-400',    emoji: '🤧', light: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' },
  'Digestive':     { bg: 'from-purple-400 to-pink-400',  emoji: '🫁', light: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' },
  'Skin Care':     { bg: 'from-yellow-400 to-amber-400', emoji: '✨', light: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' },
  'Diabetes Care': { bg: 'from-rose-400 to-red-400',     emoji: '🩸', light: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' },
  'Eye Care':      { bg: 'from-sky-400 to-blue-400',     emoji: '👁️', light: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400' },
}
const DEFAULT_STYLE = { bg: 'from-blue-400 to-indigo-400', emoji: '💉', light: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' }

export default function MedicineDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const [medicine, setMedicine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'medicines', id)).then(snap => {
      if (!snap.exists()) { navigate('/medicines'); return }
      setMedicine({ id: snap.id, ...snap.data() })
      setLoading(false)
    })
  }, [id, navigate])

  function handleAddToCart() {
    if (!user) { toast.error('Please login to add items to cart'); navigate('/login'); return }
    for (let i = 0; i < qty; i++) {
      addItem({ id: medicine.id, name: medicine.name, price: medicine.price, image_url: medicine.image_url, category: medicine.category })
    }
    setAdded(true)
    toast.success(`${qty}× ${medicine.name} added to cart! 🛒`)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleWishlist() {
    toggle(medicine)
    if (!isWishlisted(medicine.id)) {
      toast.success(`Saved to wishlist! ❤️`, { icon: '❤️' })
    } else {
      toast('Removed from wishlist', { icon: '🤍' })
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl h-96" />
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 h-8 rounded-xl w-3/4" />
          <div className="bg-gray-100 dark:bg-gray-800 h-6 rounded-xl w-1/4" />
          <div className="bg-gray-100 dark:bg-gray-800 h-32 rounded-xl" />
        </div>
      </div>
    </div>
  )

  if (!medicine) return null

  const style = CATEGORY_STYLES[medicine.category] || DEFAULT_STYLE
  const wishlisted = isWishlisted(medicine.id)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Medicines
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Visual Showcase */}
        <div className="relative">
          <div className={`bg-gradient-to-br ${style.bg} rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative shadow-lg`}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
            <span className="text-9xl drop-shadow-md select-none transform hover:scale-105 transition-transform duration-300">
              {style.emoji}
            </span>
            {medicine.is_featured && (
              <span className="absolute top-4 left-4 bg-amber-400 text-amber-900 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-4 h-4" fill="currentColor" /> Featured
              </span>
            )}
            <button
              onClick={handleWishlist}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                wishlisted
                  ? 'bg-white text-rose-500 shadow-md scale-110'
                  : 'bg-black/20 text-white hover:bg-white hover:text-rose-500'
              }`}
              title="Save to Wishlist"
            >
              <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>100% Genuine & Verified</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
              <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>Express Delivery Available</span>
            </div>
          </div>
        </div>

        {/* Medicine Info */}
        <div className="flex flex-col">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3 ${style.light}`}>
            <Tag className="w-3.5 h-3.5" /> {medicine.category}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">{medicine.name}</h1>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">₹{Number(medicine.price).toFixed(2)}</span>
            <span className="text-gray-400 text-sm">inclusive of all taxes</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Description & Usage
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{medicine.description}</p>
          </div>

          <div className="flex items-center gap-2 mb-6 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">In Stock & Ready to Dispatch</span>
            <span className="text-gray-400 text-xs">({medicine.stock} units available)</span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold text-lg">−</button>
              <span className="px-5 py-2 font-semibold text-gray-800 dark:text-gray-100 min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(medicine.stock, q + 1))}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold text-lg">+</button>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total: <span className="font-bold text-gray-800 dark:text-gray-100">₹{(medicine.price * qty).toFixed(2)}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
                added
                  ? 'bg-emerald-500 text-white scale-98 shadow-md'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01] shadow-lg shadow-blue-500/20'
              }`}>
              {added ? <><CheckCircle className="w-5 h-5" /> Added to Cart!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
            <button onClick={() => navigate('/cart')}
              className="w-full py-2.5 text-sm text-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Go to Cart →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
