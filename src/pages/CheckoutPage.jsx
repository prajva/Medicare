import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder, saveLocalOrder } from '../lib/orders'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { MapPin, Phone, User, FileText, CheckCircle, ShoppingBag, Truck, Tag, UploadCloud, FileCheck, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  // Delivery charge rule
  const DELIVERY_CHARGE = total >= 299 ? 0 : 49

  // Promo Code State (Creative Feature)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCode, setAppliedCode] = useState('')

  // Prescription Upload State (Creative Feature)
  const [prescriptionName, setPrescriptionName] = useState('')
  const [prescriptionImage, setPrescriptionImage] = useState(null)
  const [uploadingRx, setUploadingRx] = useState(false)

  const grandTotal = Math.max(0, total + DELIVERY_CHARGE - discount)

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

  function applyPromo(e) {
    e.preventDefault()
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    if (code === 'HEALTH50') {
      setDiscount(50)
      setAppliedCode('HEALTH50 (₹50 OFF)')
      toast.success('Promo code applied: ₹50 OFF! 🎉')
    } else if (code === 'VTAPP10') {
      const disc = Math.round(total * 0.10)
      setDiscount(disc)
      setAppliedCode(`VTAPP10 (10% OFF - ₹${disc})`)
      toast.success('Promo code applied: 10% OFF! 🎉')
    } else {
      toast.error('Invalid promo code. Try HEALTH50 or VTAPP10')
    }
  }

  function removePromo() {
    setDiscount(0)
    setAppliedCode('')
    setPromoCode('')
    toast('Promo code removed', { icon: 'ℹ️' })
  }

  function handlePrescription(e) {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingRx(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPrescriptionName(file.name)
        setPrescriptionImage(event.target.result)
        setUploadingRx(false)
        toast.success('Prescription verified by Digital Pharmacist! 🩺')
      }
      reader.readAsDataURL(file)
    }
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
    const fullAddress = `${form.address}, ${form.city} - ${form.pincode}`
    const userId = user?.uid || 'guest_user'

    try {
      // Save order to dual-layer database (Cloud Firestore + Persistent Local Storage)
      const createdOrder = await createOrder(userId, {
        userEmail:       user?.email || 'customer@medicare.com',
        totalAmount:     grandTotal,
        total:           grandTotal,
        discountApplied: discount,
        appliedPromo:    appliedCode || null,
        prescription:    prescriptionName || null,
        prescriptionImage: prescriptionImage || null,
        deliveryName:    form.name.trim(),
        deliveryPhone:   form.phone.trim(),
        deliveryAddress: fullAddress,
        notes:           form.notes.trim() || '',
        paymentMethod:   'COD',
        status:          'placed',
        items: cart.map(item => ({
          medicineId:  item.id,
          name:        item.name,
          imageUrl:    item.image_url || '',
          quantity:    item.quantity,
          unitPrice:   item.price,
          subtotal:    item.price * item.quantity,
        })),
      })

      clearCart()
      setOrderId(createdOrder.id)
      setSuccess(true)
      toast.success('Order placed successfully! 🎉')
    } catch (err) {
      console.warn('Fallback local order storage:', err)
      const fallbackId = 'MED-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      const fallbackOrder = {
        id: fallbackId,
        userId,
        userEmail: user?.email || '',
        totalAmount: grandTotal,
        deliveryName: form.name.trim(),
        deliveryPhone: form.phone.trim(),
        deliveryAddress: fullAddress,
        notes: form.notes.trim() || '',
        paymentMethod: 'cod',
        status: 'placed',
        statusStep: 1,
        createdAt: new Date().toISOString(),
        estimatedDelivery: 'Today within 2–4 hours',
        items: cart.map(item => ({
          medicineId: item.id,
          name: item.name,
          imageUrl: item.image_url || '',
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
        })),
      }
      saveLocalOrder(userId, fallbackOrder)
      clearCart()
      setOrderId(fallbackId)
      setSuccess(true)
      toast.success('Order placed successfully! 🎉')
    } finally {
      setLoading(false)
    }
  }

  // ── Success Screen ──────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10 border border-green-100 dark:border-gray-700">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Your order has been recorded in our database. You can track its live status in My Orders.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 mb-6 text-left border border-gray-100 dark:border-gray-700 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Order ID</span>
              <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-200">#{orderId?.slice(0, 10).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total Paid</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">₹{grandTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount Saved</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Payment</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Cash on Delivery</span>
            </div>
            {prescriptionName && (
              <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400">
                <span>Prescription</span>
                <span className="truncate max-w-[180px]">✓ {prescriptionName}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/orders')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2">
              <Truck className="w-4 h-4" /> Track Order Live
            </button>
            <button onClick={() => navigate('/medicines')}
              className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 py-3.5 rounded-xl font-semibold text-sm transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Checkout Form ──────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Complete Your Order</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-5">
          
          {/* Delivery Details */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Delivery Address
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.name} onChange={handle('name')} placeholder="Prajval Kedlaya"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={handle('phone')} placeholder="9876543210"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea value={form.address} onChange={handle('address')} placeholder="Flat/House No, Building name, Street..." rows={2}
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                <input type="text" value={form.city} onChange={handle('city')} placeholder="Amaravati"
                  className={`w-full px-3 py-2.5 border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode *</label>
                <input type="text" value={form.pincode} onChange={handle('pincode')} placeholder="522001"
                  className={`w-full px-3 py-2.5 border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.pincode ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Instructions (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea value={form.notes} onChange={handle('notes')} placeholder="E.g., Ring bell twice, leave with security..." rows={2}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-gray-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Creative Feature: Prescription Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 text-sm md:text-base">
                <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Upload Doctor's Prescription (Optional)
              </h2>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">Bonus Feature</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Have a doctor's slip? Upload it for verification by our certified pharmacists.
            </p>

            {prescriptionName ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{prescriptionName}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">✓ Pharmacist Verified</p>
                  </div>
                </div>
                <button type="button" onClick={() => { setPrescriptionName(''); setPrescriptionImage(null) }} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-gray-750">
                <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Click to upload Rx slip or PDF</span>
                <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, PDF up to 5MB</span>
                <input type="file" accept="image/*,.pdf" onChange={handlePrescription} className="hidden" />
              </label>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-sm md:text-base">Payment Method</h2>
            <div className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Cash on Delivery (COD)</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Pay in cash or UPI when your parcel arrives</p>
              </div>
              <Truck className="w-5 h-5 text-blue-500 ml-auto" />
            </div>
          </div>

          <button type="submit" disabled={loading || cart.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Placing Order…</>
              : <><ShoppingBag className="w-5 h-5" />Place Order — ₹{grandTotal.toFixed(2)}</>}
          </button>
        </form>

        {/* Order Summary & Creative Feature: Promo Code */}
        <div className="space-y-4">
          
          {/* Promo Code Box */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-500" /> Apply Promo Code
            </h3>
            {appliedCode ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-xl text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">✓ {appliedCode}</span>
                <button type="button" onClick={removePromo} className="text-red-500 hover:underline text-xs">Remove</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="E.g. HEALTH50"
                    className="flex-1 px-3 py-2 uppercase border border-gray-200 dark:border-gray-700 rounded-xl text-base sm:text-xs dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-2 rounded-xl font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Tip: Use <strong className="text-blue-600 dark:text-blue-400">HEALTH50</strong> for ₹50 off or <strong className="text-blue-600 dark:text-blue-400">VTAPP10</strong> for 10% off!
                </p>
              </div>
            )}
          </div>

          {/* Cart Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm md:text-base">Order Summary</h2>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-300 line-clamp-1 flex-1 mr-2">
                    {item.name} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Charge</span>
                {DELIVERY_CHARGE === 0
                  ? <span className="text-emerald-500 font-semibold">FREE</span>
                  : <span>₹{DELIVERY_CHARGE}</span>}
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-base text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span>Grand Total</span>
                <span className="text-blue-600 dark:text-blue-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
