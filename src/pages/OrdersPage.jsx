import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMedicineImage } from '../lib/seed'
import { fetchUserOrders, ORDER_STAGES } from '../lib/orders'
import OrderTrackerModal from '../components/orders/OrderTrackerModal'
import {
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  ShoppingBag,
  Truck,
  CheckCircle,
  MapPin,
  RefreshCw,
  Search
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const STATUS_BADGES = {
  placed:           { label: 'Order Confirmed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  sent_to_store:    { label: 'Sent to Medical Store', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300' },
  verified:         { label: 'Pharmacist Verified', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' },
  dispatched:       { label: 'Dispatched', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  delivered:        { label: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expanded, setExpanded] = useState({})
  const [trackingOrder, setTrackingOrder] = useState(null)

  async function loadOrders() {
    if (!user) return
    try {
      const data = await fetchUserOrders(user.uid)
      setOrders(data)
    } catch (err) {
      console.warn('Load orders warning:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [user])

  function handleRefresh() {
    setRefreshing(true)
    loadOrders()
    toast.success('Orders refreshed from database! 🔄', { duration: 2000 })
  }

  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  function handleOrderUpdated(updatedOrder) {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o))
    if (trackingOrder && trackingOrder.id === updatedOrder.id) {
      setTrackingOrder(updatedOrder)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 animate-pulse mb-6" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 h-36 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Please sign in</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">You need to be logged in to view and track your orders.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 rounded-3xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No orders recorded yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Once you complete an order at checkout, your parcel tracking details will be stored in our database and shown here.
        </p>
        <Link
          to="/medicines"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Browse Medicines
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">My Orders & Tracking</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {orders.length} order{orders.length !== 1 ? 's' : ''} stored in database • Live tracking enabled
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all shadow-sm w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
          Sync Orders
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {orders.map(order => {
          const step = order.statusStep || (
            order.status === 'placed' ? 1 :
            order.status === 'verified' ? 2 :
            order.status === 'dispatched' ? 3 :
            order.status === 'out_for_delivery' ? 4 :
            order.status === 'delivered' ? 5 : 1
          )
          const badge = STATUS_BADGES[order.status] || { label: order.status || 'Confirmed', color: 'bg-blue-100 text-blue-700' }

          let dateStr = 'Just now'
          if (order.createdAt) {
            try {
              dateStr = new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })
            } catch (e) {}
          }

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-5 sm:p-6">
                
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-700/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">
                        #{order.id.slice(0, 10).toUpperCase()}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-400 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Placed on {dateStr}</span>
                      <span>•</span>
                      <span>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTrackingOrder(order)}
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" /> Track Parcel
                    </button>
                  </div>
                </div>

                {/* Inline Mini Tracking Bar */}
                <div className="py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Estimated: <strong className="text-gray-800 dark:text-gray-100">{order.estimatedDelivery || 'Today within 2–4 hours'}</strong>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                      Step {step} of 5
                    </span>
                  </div>

                  {/* 5-Step Visual Bar */}
                  <div className="grid grid-cols-5 gap-1.5 h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {[1, 2, 3, 4, 5].map(st => (
                      <div
                        key={st}
                        className={`h-full transition-colors ${
                          step >= st
                            ? 'bg-emerald-500'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                    <span>Confirmed</span>
                    <span>Verified</span>
                    <span>Dispatched</span>
                    <span>Out for Delivery</span>
                    <span>Delivered</span>
                  </div>
                </div>

                {/* Delivery & Total Details */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-700 dark:text-gray-200">{order.deliveryName}</strong> — {order.deliveryAddress}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                    <span className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
                      Total: ₹{Number(order.totalAmount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => toggle(order.id)}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      {expanded[order.id] ? (
                        <>Hide items <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>View items <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Ordered Items */}
                {expanded[order.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
                    {order.items?.map((item, idx) => {
                      const img = getMedicineImage(item) || item.imageUrl
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-750 p-2.5 rounded-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center p-1">
                              {img ? (
                                <img src={img} alt={item.name} className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-base">💊</span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{item.name}</p>
                              <p className="text-[11px] text-gray-400">Qty: {item.quantity} × ₹{Number(item.unitPrice).toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">₹{Number(item.subtotal).toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Popup for Live Order Tracking */}
      {trackingOrder && (
        <OrderTrackerModal
          order={trackingOrder}
          currentUserId={user?.uid}
          onClose={() => setTrackingOrder(null)}
          onOrderUpdated={handleOrderUpdated}
        />
      )}

    </div>
  )
}
