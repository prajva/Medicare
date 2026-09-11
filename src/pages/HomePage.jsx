import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { seedMedicines } from '../lib/seed'
import MedicineCard from '../components/medicine/MedicineCard'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, Clock, HeartPulse, Search, Star } from 'lucide-react'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      await seedMedicines()
      const q = query(collection(db, 'medicines'), where('is_featured', '==', true), limit(6))
      const snap = await getDocs(q)
      setFeatured(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  const features = [
    { icon: Truck,      title: 'Free Delivery',    desc: 'On orders above ₹299',      color: 'bg-blue-100 text-blue-600' },
    { icon: ShieldCheck, title: 'Genuine Products', desc: '100% authentic medicines',  color: 'bg-green-100 text-green-600' },
    { icon: Clock,      title: 'Fast Delivery',    desc: 'Delivered in 2–4 hours',    color: 'bg-amber-100 text-amber-600' },
    { icon: HeartPulse, title: 'Expert Care',      desc: 'Pharmacist-verified',       color: 'bg-rose-100 text-rose-600' },
  ]

  const categories = [
    { name: 'Pain Relief',   emoji: '💊', bg: 'from-red-100 to-orange-100' },
    { name: 'Vitamins',      emoji: '🌿', bg: 'from-green-100 to-teal-100' },
    { name: 'Cold & Flu',    emoji: '🤧', bg: 'from-blue-100 to-cyan-100' },
    { name: 'Digestive',     emoji: '🫁', bg: 'from-purple-100 to-pink-100' },
    { name: 'Skin Care',     emoji: '✨', bg: 'from-yellow-100 to-amber-100' },
    { name: 'Diabetes Care', emoji: '🩸', bg: 'from-rose-100 to-red-100' },
    { name: 'Eye Care',      emoji: '👁️', bg: 'from-sky-100 to-blue-100' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block bg-blue-500/30 text-blue-100 text-sm px-4 py-1.5 rounded-full mb-4 border border-blue-400/30">
            🎉 Trusted by 10,000+ customers across India
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Your Health,<br />
            <span className="text-green-300">Our Priority</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Order genuine medicines online and get them delivered to your doorstep. Fast, safe, and affordable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/medicines"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors text-base shadow-lg">
              Browse Medicines <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold transition-colors text-base shadow-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="max-w-2xl mx-auto px-4 -mt-6">
        <Link to="/medicines"
          className="flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow">
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm">Search medicines, vitamins, supplements...</span>
          <span className="ml-auto bg-blue-600 text-white text-xs px-3 py-1 rounded-lg">Search</span>
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-3`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">{f.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/medicines" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {categories.map(cat => (
            <Link key={cat.name} to={`/medicines?category=${encodeURIComponent(cat.name)}`}
              className={`bg-gradient-to-br ${cat.bg} rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="text-xs font-semibold text-gray-700">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Medicines</h2>
          </div>
          <Link to="/medicines" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(m => <MedicineCard key={m.id} medicine={m} />)}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/medicines"
            className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-colors">
            Browse All Medicines <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
