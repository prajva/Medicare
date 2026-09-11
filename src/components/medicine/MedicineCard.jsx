import { ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function MedicineCard({ medicine }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  function handleAddToCart(e) {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    addItem({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      image_url: medicine.image_url,
      category: medicine.category,
    })
    toast.success(`${medicine.name} added to cart!`, {
      icon: '🛒',
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    })
  }

  return (
    <Link to={`/medicines/${medicine.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-blue-50 h-48">
          <img
            src={medicine.image_url || `https://placehold.co/400x300/dbeafe/2563eb?text=${encodeURIComponent(medicine.name)}`}
            alt={medicine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              e.target.src = `https://placehold.co/400x300/dbeafe/2563eb?text=Medicine`
            }}
          />
          {medicine.is_featured && (
            <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" fill="currentColor" /> Featured
            </span>
          )}
          <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
            {medicine.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {medicine.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 flex-1">
            {medicine.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-blue-600">₹{medicine.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg transition-colors font-medium"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
