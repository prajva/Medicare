import { useState } from 'react'
import { ORDER_STAGES, advanceOrderStatus } from '../../lib/orders'
import { getMedicineImage } from '../../lib/seed'
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Mail,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrderTrackerModal({ order, onClose, onOrderUpdated, currentUserId }) {
  if (!order) return null

  const [currentOrder, setCurrentOrder] = useState(order)
  const currentStep = currentOrder.statusStep || (
    currentOrder.status === 'placed' ? 1 :
    currentOrder.status === 'sent_to_store' ? 2 :
    currentOrder.status === 'verified' ? 3 :
    currentOrder.status === 'dispatched' ? 4 :
    currentOrder.status === 'out_for_delivery' ? 5 :
    currentOrder.status === 'delivered' ? 6 : 1
  )

  function handleSimulateNext() {
    if (currentStep >= 6) {
      toast.success('This order has already been successfully delivered! 📦')
      return
    }
    const updated = advanceOrderStatus(currentUserId, currentOrder.id)
    if (updated) {
      setCurrentOrder({ ...updated })
      if (onOrderUpdated) onOrderUpdated(updated)
      toast.success(`Order status updated to: ${ORDER_STAGES[updated.statusStep - 1].label} 🚀`)
    }
  }

  const currentStage = ORDER_STAGES[currentStep - 1] || ORDER_STAGES[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex items-center justify-between relative flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Tracking
              </span>
              <span className="font-mono text-xs opacity-90">#{currentOrder.id.slice(0, 10).toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-bold mt-1">Track Your Parcel</h2>
            <p className="text-xs text-blue-100 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Estimated Delivery: <strong className="text-white">{currentOrder.estimatedDelivery || 'Today within 2–4 hours'}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Live Status Highlight Card */}
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Current Live Status</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{currentStage.label}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{currentStage.desc}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-mono bg-white dark:bg-gray-700 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold">
                {currentOrder.trackingNumber || 'TRK-MED77291'}
              </span>
              <p className="text-[11px] text-gray-400 mt-1">{currentOrder.courierPartner || 'Express Pharmacy Delivery'}</p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Delivery Journey</h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
              {ORDER_STAGES.map((stage) => {
                const isCompleted = currentStep >= stage.step
                const isCurrent = currentStep === stage.step

                return (
                  <div key={stage.id} className="relative flex items-start gap-3.5">
                    {/* Step Icon Indicator */}
                    <div
                      className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-100 dark:ring-emerald-950/60 scale-110' : ''}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.step}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                          {stage.label}
                        </p>
                        {isCurrent && (
                          <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Test / Demo Simulation Button */}
          <div className="p-3.5 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Simulation Mode
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Advance order stages in real time to verify tracking on this device.</p>
            </div>
            <button
              onClick={handleSimulateNext}
              disabled={currentStep >= 5}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {currentStep >= 5 ? 'Order Completed' : 'Simulate Next Step'}
            </button>
          </div>

          {/* Delivery & Recipient Details */}
          <div className="bg-gray-50 dark:bg-gray-750 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 space-y-2.5 text-xs">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-2">Delivery Summary</h4>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span><strong>Recipient:</strong> {currentOrder.deliveryName}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span><strong>Contact Phone:</strong> {currentOrder.deliveryPhone}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span><strong>Address:</strong> {currentOrder.deliveryAddress}</span>
            </div>
            {currentOrder.prescription && (
              <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <FileCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Prescription Verified:</strong> {currentOrder.prescription}</span>
              </div>
            )}
          </div>

          {/* Ordered Medicines */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Parcel Contents ({currentOrder.items?.length || 0} items)</h4>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {currentOrder.items?.map((item, idx) => {
                const img = getMedicineImage(item) || item.imageUrl
                return (
                  <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-700/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 flex items-center justify-center p-1">
                        {img ? (
                          <img src={img} alt={item.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-lg">💊</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity} × ₹{Number(item.unitPrice).toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">₹{Number(item.subtotal).toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Need Help Footer */}
          <div className="pt-2 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Need assistance? Reach our 24/7 support at{' '}
              <a href="mailto:medicaresupport1@gmail.com" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                medicaresupport1@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl text-xs transition-colors"
          >
            Close Tracking
          </button>
        </div>

      </div>
    </div>
  )
}
