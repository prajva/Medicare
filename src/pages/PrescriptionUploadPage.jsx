import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  UploadCloud, FileImage, CheckCircle2, ShieldCheck, Clock, 
  MessageSquare, AlertCircle, ArrowLeft, Pill, X, Sparkles, Phone, MapPin, User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../lib/orders'
import toast from 'react-hot-toast'

export default function PrescriptionUploadPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [imagePreview, setImagePreview] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [medicineNotes, setMedicineNotes] = useState('')
  const [name, setName] = useState(profile?.fullName || user?.displayName || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [address, setAddress] = useState(profile?.address || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Please upload an image file (JPG, PNG, WebP) or PDF')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB')
      return
    }

    setFileName(file.name)
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB')

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target.result)
      toast.success('Prescription image attached successfully!')
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setImagePreview(null)
    setFileName('')
    setFileSize('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!imagePreview && !medicineNotes.trim()) {
      toast.error('Please attach a prescription image OR type your medicine list.')
      return
    }

    if (!name.trim()) {
      toast.error('Please enter patient or recipient name.')
      return
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit phone number.')
      return
    }

    if (!address.trim()) {
      toast.error('Please enter your delivery address.')
      return
    }

    setIsSubmitting(true)

    try {
      const orderPayload = {
        type: 'prescription_upload',
        prescription: fileName || 'Uploaded Prescription / List',
        prescriptionImage: imagePreview || null,
        medicineNotes: medicineNotes.trim(),
        items: [
          {
            name: fileName ? `Prescription Order (${fileName})` : 'Handwritten Medicine List Order',
            quantity: 1,
            unitPrice: 0,
            subtotal: 0,
            description: medicineNotes.trim() || 'Pharmacist review required'
          }
        ],
        total: 0,
        totalAmount: 0,
        deliveryName: name.trim(),
        deliveryPhone: phone.trim(),
        deliveryAddress: address.trim(),
        paymentMethod: 'Cash on Delivery (Pay after Pharmacist Confirmation)',
        status: 'placed',
        statusStep: 1,
        userEmail: user?.email || profile?.email || 'guest@medicare.com',
        notes: medicineNotes.trim()
      }

      const created = await createOrder(user?.uid || 'guest_' + Date.now(), orderPayload)
      setOrderSuccess(created)
      toast.success('Prescription & medicine list submitted! Our pharmacist will verify shortly.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit prescription order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function triggerChatbot() {
    const chatWidget = document.querySelector('#chatnest-widget-button, [class*="chatnest"], iframe[src*="chatnest"]')
    if (chatWidget) {
      chatWidget.scrollIntoView({ behavior: 'smooth' })
      chatWidget.click()
    } else {
      toast('Chatbot is active in the bottom right corner of your screen!', { icon: '💬' })
    }
  }

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">
              Order Received Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3">
              Prescription Order #{orderSuccess.id}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-md mx-auto">
              Our registered pharmacist has received your prescription & medicine list. We will verify the batch availability and call you at <strong className="text-gray-900 dark:text-gray-100">{phone}</strong> if needed.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-2 text-xs">
            <p className="text-blue-900 dark:text-blue-300 font-semibold text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Next Steps:
            </p>
            <p className="text-gray-600 dark:text-gray-300">1. Licensed Pharmacist verifies dosages & brand equivalents.</p>
            <p className="text-gray-600 dark:text-gray-300">2. Tamper-evident packaging prepared with genuine batch codes.</p>
            <p className="text-gray-600 dark:text-gray-300">3. Estimated Doorstep Delivery: <strong>{orderSuccess.estimatedDelivery || 'Within 2-3 Hours'}</strong>.</p>
          </div>

          {imagePreview && (
            <div className="max-w-xs mx-auto text-left">
              <p className="text-xs font-semibold text-gray-500 mb-1">Attached Document Preview:</p>
              <img src={imagePreview} alt="Prescription" className="w-full h-36 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {user ? (
              <Link
                to="/orders"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
              >
                Track Live Delivery Status
              </Link>
            ) : (
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20"
              >
                Return to Storefront
              </Link>
            )}

            <button
              onClick={triggerChatbot}
              className="inline-flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-emerald-100 transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Ask AI Pharmacist
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <button
          onClick={triggerChatbot}
          className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-blue-100 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Need help? Chat with AI</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Pill className="w-3.5 h-3.5" /> 100% Genuine Pharmacy Service
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Upload Prescription & Medicine List
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2">
            Don’t have time to search each medicine? Snap a clear photo of your doctor’s prescription or handwritten medicine list. Our licensed pharmacists will prepare your order for doorstep delivery.
          </p>
        </div>
      </div>

      {/* Form & Upload Container */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Image Upload & Notes */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Card 1: Prescription & Medicine List Image Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Prescription / Medicine List Image
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Upload doctor's prescription slip, clinic note, or handwritten medicine list
                </p>
              </div>
            </div>

            {/* Dropzone / Upload Area */}
            {!imagePreview ? (
              <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50/50 dark:bg-gray-900/40 transition-all hover:bg-blue-50/20 group">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Click to Browse or Drag & Drop Photo
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Supports JPG, PNG, WebP or PDF (Max 10MB)
                </p>
                <span className="mt-4 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl group-hover:bg-blue-700 shadow-sm">
                  Choose Image File
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 max-h-80 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Prescription preview"
                    className="max-h-80 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shadow-lg transition-transform active:scale-95"
                    title="Remove and choose different image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="font-semibold truncate max-w-[200px] text-gray-800 dark:text-gray-200">
                    📎 {fileName}
                  </span>
                  <span>{fileSize}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Prescription images are encrypted and viewed strictly by licensed pharmacists.</span>
            </div>
          </div>

          {/* Card 2: Medicine List / Additional Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Medicine Names & Quantities (Optional)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Type the names, strengths (e.g., 500mg), and strip counts if not clearly visible in the image:
            </p>
            <textarea
              rows={4}
              value={medicineNotes}
              onChange={(e) => setMedicineNotes(e.target.value)}
              placeholder="e.g.&#10;1. Paracetamol 650mg - 2 strips&#10;2. Sinarest Tablets - 1 strip&#10;3. Vicks Inhaler - 1 pc"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

        </div>

        {/* Right 1 Column: Delivery Details & Submit */}
        <div className="space-y-6">
          
          {/* Card 3: Contact & Delivery Info */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Delivery Details
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" /> Patient / Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Mobile Number (for Verification)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> Delivery Address
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat / House No, Street, City, PIN Code"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 p-3 rounded-xl text-xs space-y-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cash on Delivery (COD)
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                  Pharmacist will calculate accurate pricing and bill after verification. Pay upon doorstep delivery.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Prescription...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Submit Prescription Order
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 4: Chatbot Callout */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-3xl p-5 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>MediCare AI Chatbot</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Need instant answers regarding dosage, drug interactions, or stock availability? Ask our AI assistant right in the floating widget!
            </p>
            <button
              type="button"
              onClick={triggerChatbot}
              className="w-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors shadow-sm"
            >
              Open AI Chat Assistant
            </button>
          </div>

        </div>

      </form>
    </div>
  )
}