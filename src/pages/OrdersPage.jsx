import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { Package, ChevronDown, ChevronUp, Clock, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

const STATUS_COLORS = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}
const STATUS_LABELS = {
  pending:    '⏳ Pending',
  processing: '⚙️ Processing',
  shipped:    '🚚 Shipped',
  delivered:  '✅ Delivered',
  cancelled:  '❌ Cancelled',
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    getDocs(q).then(snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [user])

  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />)}
    </div>
  )

  if (orders.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-8xl mb-4">📦</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
      <p className="text-gray-500 mb-6">Start shopping and your orders will appear here</p>
      <Link to="/medicines"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
        <ShoppingBag className="w-5 h-5" /> Browse Medicines
      </Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <span className="text-gray-400 font-normal text-base">({orders.length})</span>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-gray-400 mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    {' · '}
                    <span className="text-blue-600">₹{Number(order.totalAmount).toFixed(2)}</span>
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                      : 'Just now'}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">💵 COD</span>
                </div>
              </div>

              <div className="mt-3 bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500">
                📍 <span className="font-medium text-gray-700">{order.deliveryName}</span> — {order.deliveryAddress}
              </div>

              <button onClick={() => toggle(order.id)}
                className="mt-3 text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                {expanded[order.id]
                  ? <><ChevronUp className="w-3.5 h-3.5" /> Hide items</>
                  : <><ChevronDown className="w-3.5 h-3.5" /> View items</>}
              </button>
            </div>

            {expanded[order.id] && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl || `https://placehold.co/40x40/dbeafe/2563eb?text=M`}
                        alt={item.name} className="w-full h-full object-cover"
                        onError={e => { e.target.src = `https://placehold.co/40x40/dbeafe/2563eb?text=M` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{Number(item.unitPrice).toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">₹{Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
