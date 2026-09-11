import { MEDICINES } from '../lib/seed'
import MedicineCard from '../components/medicine/MedicineCard'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, Clock, HeartPulse, Search, Star } from 'lucide-react'

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
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all text-sm sm:text-base shadow-xl hover:scale-105"
            >
              Create Free Account
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
