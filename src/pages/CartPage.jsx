import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { cart, removeItem, updateQty, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const DELIVERY_CHARGE = total >= 299 ? 0 : 49
  const grandTotal = total + DELIVERY_CHARGE

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some medicines to get started!</p>
        <Link to="/medicines"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          <ShoppingBag className="w-5 h-5" /> Browse Medicines
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" /> Shopping Cart
          <span className="text-base font-normal text-gray-400">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 hover:underline">Clear all</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 shadow-sm">
              <div className="w-20 h-20 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image_url || `https://placehold.co/80x80/dbeafe/2563eb?text=Med`}
                  alt={item.name} className="w-full h-full object-cover"
                  onError={e => { e.target.src = `https://placehold.co/80x80/dbeafe/2563eb?text=Med` }} />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/medicines/${item.id}`} className="font-semibold text-gray-800 text-sm hover:text-blue-600 line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-400 mb-2">{item.category}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600">₹{item.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100 transition-colors">
                        <Minus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <span className="px-3 text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 transition-colors">
                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Subtotal: <span className="font-semibold text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                {DELIVERY_CHARGE === 0
                  ? <span className="text-green-500 font-medium">FREE</span>
                  : <span className="font-medium">₹{DELIVERY_CHARGE.toFixed(2)}</span>
                }
              </div>
              {DELIVERY_CHARGE > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                  Add ₹{(299 - total).toFixed(2)} more for free delivery!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Grand Total</span>
                <span className="text-blue-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <button onClick={() => navigate('/checkout')}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-center text-gray-500">Login to place your order</p>
                <button onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">
                  Login to Checkout
                </button>
              </div>
            )}
            <Link to="/medicines" className="block text-center text-sm text-gray-500 hover:text-blue-600 mt-3">
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
