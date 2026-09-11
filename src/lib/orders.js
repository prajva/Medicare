import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

const LOCAL_STORAGE_PREFIX = 'medicare_orders_'

export const ORDER_STAGES = [
  { id: 'placed',            label: 'Order Confirmed',       desc: 'Order placed & payment verified (COD)', step: 1 },
  { id: 'verified',          label: 'Pharmacist Verified',   desc: 'Medicines & batch numbers inspected',    step: 2 },
  { id: 'dispatched',        label: 'Packed & Dispatched',   desc: 'Sealed with tamper-evident strip',      step: 3 },
  { id: 'out_for_delivery',  label: 'Out for Delivery',      desc: 'Delivery executive on the way',          step: 4 },
  { id: 'delivered',         label: 'Delivered',             desc: 'Package handed over at doorstep',       step: 5 },
]

export function getLocalOrders(userId) {
  if (!userId) return []
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_PREFIX + userId)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.warn('Failed to read local orders:', e)
    return []
  }
}

export function saveLocalOrder(userId, order) {
  if (!userId || !order) return
  try {
    const list = getLocalOrders(userId)
    const idx = list.findIndex(o => o.id === order.id)
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...order }
    } else {
      list.unshift(order)
    }
    localStorage.setItem(LOCAL_STORAGE_PREFIX + userId, JSON.stringify(list))
  } catch (e) {
    console.warn('Failed to save local order:', e)
  }
}

export async function createOrder(userId, orderData) {
  const localId = 'MED-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Date.now().toString(36).slice(-4).toUpperCase()

  // Calculate estimated delivery: 2-3 hours from now
  const estDate = new Date(Date.now() + 2.5 * 60 * 60 * 1000)
  const estTimeStr = estDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  const orderRecord = {
    id: localId,
    userId,
    ...orderData,
    status: orderData.status || 'placed',
    statusStep: 1,
    createdAt: new Date().toISOString(),
    estimatedDelivery: `Today by ${estTimeStr}`,
    courierPartner: 'MediCare Express Logistics',
    trackingNumber: 'TRK-' + Math.floor(10000000 + Math.random() * 90000000),
  }

  // 1. Guarantee offline and immediate persistence in local database
  saveLocalOrder(userId, orderRecord)

  // 2. Persist to Cloud Firestore database
  try {
    const ref = await addDoc(collection(db, 'orders'), {
      ...orderRecord,
      createdAt: serverTimestamp(),
    })
    if (ref.id) {
      const cloudOrder = { ...orderRecord, id: ref.id }
      saveLocalOrder(userId, cloudOrder)
      return cloudOrder
    }
  } catch (err) {
    console.warn('Cloud Firestore notice (stored in local database):', err?.message)
  }

  return orderRecord
}

export async function fetchUserOrders(userId) {
  if (!userId) return []
  const localList = getLocalOrders(userId)

  try {
    // Simple where query without compound orderBy to guarantee zero composite index errors
    const q = query(collection(db, 'orders'), where('userId', '==', userId))
    const snap = await getDocs(q)
    const remoteList = snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
      }
    })

    const merged = new Map()
    remoteList.forEach(o => merged.set(o.id, o))
    localList.forEach(o => {
      if (!merged.has(o.id)) merged.set(o.id, o)
    })

    const result = Array.from(merged.values())
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    return result
  } catch (err) {
    console.warn('Querying local orders cache:', err?.message)
    return localList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  }
}

export function advanceOrderStatus(userId, orderId) {
  const orders = getLocalOrders(userId)
  const idx = orders.findIndex(o => o.id === orderId)
  if (idx === -1) return null

  const order = orders[idx]
  const currentStep = order.statusStep || (
    order.status === 'placed' ? 1 :
    order.status === 'verified' ? 2 :
    order.status === 'dispatched' ? 3 :
    order.status === 'out_for_delivery' ? 4 :
    order.status === 'delivered' ? 5 : 1
  )

  const nextStep = Math.min(5, currentStep + 1)
  const nextStage = ORDER_STAGES[nextStep - 1]

  order.statusStep = nextStep
  order.status = nextStage.id
  orders[idx] = order
  localStorage.setItem(LOCAL_STORAGE_PREFIX + userId, JSON.stringify(orders))
  return order
}
