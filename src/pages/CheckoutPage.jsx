import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { MapPin, Phone, User, FileText, CheckCircle, ShoppingBag, Truck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const DELIVERY_CHARGE = total >= 299 ? 0 : 49
  const grandTotal = total + DELIVERY_CHARGE

  const [form, setForm] = useState({
    name:    profile?.fullName || user?.displayName || '',
    phone:   profile?.phone || '',
    address: '',
    city:    '',
    pincode: '',
    notes:   '',
  })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const handle = field => e => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(err => ({ ...err, [field]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())    errs.name    = 'Name is required'
    if (!form.phone.trim())   errs.phone   = 'Phone is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g,''))) errs.phone = 'Enter a valid 10-digit mobile number'
    if (!form.address.trim()) errs.address = 'Delivery address is required'
    if (!form.city.trim())    errs.city    = 'City is required'
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode'
    return errs
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()
    if (cart.length === 0) { toast.error('Your cart is empty!'); return }
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const fullAddress = `${form.address}, ${form.city} - ${form.pincode}`

      // Save order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId:          user.uid,
        userEmail:       user.email,
        totalAmount:     grandTotal,
        deliveryName:    form.name.trim(),
        deliveryPhone:   form.phone.trim(),
        deliveryAddress: fullAddress,
        notes:           form.notes.trim() || '',
        paymentMethod:   'cod',
        status:          'pending',
        items: cart.map(item => ({
          medicineId:  item.id,
          name:        item.name,
          imageUrl:    item.image_url || '',
          quantity:    item.quantity,
          unitPrice:   item.price,
          subtotal:    item.price * item.quantity,
        })),
        createdAt: serverTimestamp(),
      })

      clearCart()
      setOrderId(orderRef.id)
      setSuccess(true)
      toast.success('Order placed successfully! 🎉')
    } catch (err) {
      console.error(err)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ─────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-4 text-sm">
            Your order has been saved to our database. Check "My Orders" to track it.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono text-xs text-gray-700 break-all">{orderId?.slice(0, 10)}…</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-blue-600">₹{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="text-green-600 font-medium">Cash on Delivery</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/orders')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
              View Orders
            </button>
            <button onClick={() => navigate('/medicines')}
              className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold text-sm transition-colors">
              Shop More
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Checkout Form ──────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6">

        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Delivery Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.name} onChange={handle('name')} placeholder="John Doe"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={handle('phone')} placeholder="9876543210"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea value={form.address} onChange={handle('address')} placeholder="House No, Street, Landmark..." rows={2}
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input type="text" value={form.city} onChange={handle('city')} placeholder="Amaravati"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input type="text" value={form.pincode} onChange={handle('pincode')} placeholder="522001"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pincode ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea value={form.notes} onChange={handle('notes')} placeholder="Special instructions..." rows={2}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">💳 Payment Method</h2>
            <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Cash on Delivery (COD)</p>
                <p className="text-gray-500 text-xs">Pay in cash when your order arrives</p>
              </div>
              <Truck className="w-5 h-5 text-blue-500 ml-auto" />
            </div>
          </div>

          <button type="submit" disabled={loading || cart.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Placing Order…</>
              : <><ShoppingBag className="w-5 h-5" />Place Order — ₹{grandTotal.toFixed(2)}</>}
          </button>
        </form>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                    {item.name} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-800 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                {DELIVERY_CHARGE === 0
                  ? <span className="text-green-500">FREE</span>
                  : <span>₹{DELIVERY_CHARGE}</span>}
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-blue-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
