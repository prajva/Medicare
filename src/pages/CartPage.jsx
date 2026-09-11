import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShoppingCart } from 'lucide-react'
import { getMedicineImage } from '../lib/seed'

export default function CartPage() {
  const { cart, total, updateQty, removeItem, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const DELIVERY_CHARGE = total >= 299 ? 0 : 49
  const grandTotal = total + DELIVERY_CHARGE

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added any medicines yet.</p>
        <Link
          to="/medicines"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <ShoppingBag className="w-5 h-5" /> Browse Medicines
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Shopping Cart
          <span className="text-base font-normal text-gray-400">({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 hover:underline font-medium">
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => {
            const imageSrc = getMedicineImage(item) || item.image_url
            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex gap-4 shadow-sm items-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-gray-100 dark:border-gray-700">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      onError={e => { e.target.src = `https://placehold.co/80x80/dbeafe/2563eb?text=Med` }}
                    />
                  ) : (
                    <span className="text-2xl">💊</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={`/medicines/${item.id}`} className="font-semibold text-gray-800 dark:text-gray-100 text-sm hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-400 mb-2">{item.category}</p>
                  
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">₹{Number(item.price).toFixed(2)}</span>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-gray-800 dark:text-gray-100 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Subtotal: <span className="font-semibold text-gray-700 dark:text-gray-300">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Charges</span>
                {DELIVERY_CHARGE === 0
                  ? <span className="text-emerald-500 font-medium">FREE</span>
                  : <span className="font-medium text-gray-800 dark:text-gray-200">₹{DELIVERY_CHARGE.toFixed(2)}</span>
                }
              </div>

              {DELIVERY_CHARGE > 0 && (
                <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-xl p-2 border border-amber-100 dark:border-amber-900/40">
                  Add ₹{(299 - total).toFixed(2)} more for free delivery!
                </p>
              )}

              <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base">
                <span>Grand Total</span>
                <span className="text-blue-600 dark:text-blue-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => navigate('/checkout')}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">Login to place your order</p>
                <button
                  onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-colors"
                >
                  Login to Checkout
                </button>
              </div>
            )}
            
            <Link to="/medicines" className="block text-center text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mt-3">
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
