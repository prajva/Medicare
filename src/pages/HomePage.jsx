import { MEDICINES } from '../lib/seed'
import MedicineCard from '../components/medicine/MedicineCard'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, Clock, HeartPulse, Search, Star, UploadCloud, FileImage } from 'lucide-react'

export default function HomePage() {
  const features = [
    { icon: Truck,       title: 'Free Delivery',     desc: 'On orders above ₹299',       color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' },
    { icon: ShieldCheck, title: 'Genuine Products',  desc: '100% authentic pharmaceuticals', color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
    { icon: Clock,       title: 'Fast Dispatch',     desc: 'Delivered in 2–4 hours',     color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' },
    { icon: HeartPulse,  title: 'Expert Verified',   desc: 'Pharmacist-approved formulas', color: 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' },
  ]



  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block bg-blue-500/30 text-blue-100 text-xs sm:text-sm px-4 py-1.5 rounded-full mb-4 border border-blue-400/30 backdrop-blur-sm">
            ✨ Verified Online Pharmacy • Authentic Medicines Only
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            Genuine Medicines,<br />
            <span className="text-emerald-300">Delivered Direct To You</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-normal">
            Order authentic antibiotics, cold tablets, and capsules with guaranteed batch verification and fast doorstep delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/medicines"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-50 transition-all text-sm sm:text-base shadow-xl hover:scale-105"
            >
              Browse Medicines <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/upload-prescription"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all text-sm sm:text-base shadow-xl hover:scale-105"
            >
              <UploadCloud className="w-5 h-5" /> Upload Prescription & List
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Search Shortcut */}
      <section className="max-w-2xl mx-auto px-4 -mt-6 relative z-20">
        <Link
          to="/medicines"
          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-2xl transition-all group"
        >
          <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          <span className="text-gray-400 text-xs sm:text-sm">Search Clariterm, Sinarest, Amoxicillin, Clarinova...</span>
          <span className="ml-auto bg-blue-600 text-white text-xs px-3.5 py-1.5 rounded-xl font-semibold">
            Search
          </span>
        </Link>
      </section>

      {/* Value Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center transition-all hover:shadow-md"
            >
              <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-3`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Prescription & Medicine List Upload Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-blue-800/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
                <FileImage className="w-4 h-4" /> Quick Prescription & Medicine List Upload
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Order Directly with Doctor’s Prescription or Medicine List
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                No need to search for every single medicine manually. Simply snap a photo of your doctor's prescription or handwritten medicine list and upload it. Our registered pharmacist will review the batch numbers, verify availability, and dispatch your order.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Genuine Pharmacy
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <Clock className="w-4 h-4 text-amber-400" /> Pharmacist Review in 15 mins
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <Truck className="w-4 h-4 text-blue-400" /> Fast 2–4 Hour Delivery
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <Link
                to="/upload-prescription"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-5 rounded-2xl shadow-xl shadow-emerald-500/20 text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-3 text-base group"
              >
                <UploadCloud className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Upload Prescription / List Now</span>
              </Link>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">💬</span>
                  <span>Have questions? Chat live with our <strong>AI Pharmacist Assistant</strong> in the widget!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products - Strictly the 5 uploaded medicines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Available Products</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">100% genuine medicines with packaging photos</p>
            </div>
          </div>
          <Link to="/medicines" className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline flex items-center gap-1">
            Browse All ({MEDICINES.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEDICINES.map(m => (
            <MedicineCard key={m.id} medicine={m} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md shadow-blue-500/20 hover:scale-105 text-sm"
          >
            Go to Medicines Page <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
