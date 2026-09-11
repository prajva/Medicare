import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, ArrowLeft, Star, Package, Tag, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MedicineDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user } = useAuth()
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
  }, [id])

  function handleAddToCart() {
    if (!user) { toast.error('Please login to add items to cart'); navigate('/login'); return }
    for (let i = 0; i < qty; i++) {
      addItem({ id: medicine.id, name: medicine.name, price: medicine.price, image_url: medicine.image_url, category: medicine.category })
    }
    setAdded(true)
    toast.success(`${qty}× ${medicine.name} added to cart! 🛒`)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="bg-gray-100 rounded-2xl h-96" />
        <div className="space-y-4">
          <div className="bg-gray-100 h-8 rounded-xl w-3/4" />
          <div className="bg-gray-100 h-6 rounded-xl w-1/4" />
          <div className="bg-gray-100 h-32 rounded-xl" />
        </div>
      </div>
    </div>
  )

  if (!medicine) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Medicines
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative">
          <div className="bg-blue-50 rounded-3xl overflow-hidden aspect-square">
            <img src={medicine.image_url || `https://placehold.co/500x500/dbeafe/2563eb?text=Medicine`}
              alt={medicine.name} className="w-full h-full object-cover"
              onError={e => { e.target.src = `https://placehold.co/500x500/dbeafe/2563eb?text=Medicine` }} />
          </div>
          {medicine.is_featured && (
            <span className="absolute top-4 left-4 bg-amber-400 text-amber-900 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4" fill="currentColor" /> Featured
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3">
            <Tag className="w-3.5 h-3.5" /> {medicine.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-extrabold text-blue-600">₹{Number(medicine.price).toFixed(2)}</span>
            <span className="text-gray-400 text-sm">per pack</span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" /> Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{medicine.description}</p>
          </div>
          <div className="flex items-center gap-2 mb-6 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-600 font-medium">In Stock</span>
            <span className="text-gray-400">({medicine.stock} units available)</span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg">−</button>
              <span className="px-5 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(medicine.stock, q + 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg">+</button>
            </div>
            <span className="text-sm text-gray-500">
              Total: <span className="font-bold text-gray-800">₹{(medicine.price * qty).toFixed(2)}</span>
            </span>
          </div>

          <button onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all ${
              added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg shadow-blue-200'
            }`}>
            {added ? <><CheckCircle className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
          </button>
          <button onClick={() => navigate('/cart')}
            className="mt-3 text-sm text-center text-gray-500 hover:text-blue-600 transition-colors">
            View Cart →
          </button>
        </div>
      </div>
    </div>
  )
}
