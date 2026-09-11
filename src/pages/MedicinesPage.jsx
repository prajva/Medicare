import { useEffect, useState, useMemo } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { MEDICINES, seedMedicines } from '../lib/seed'
import MedicineCard from '../components/medicine/MedicineCard'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const CATEGORIES = ['All', 'Antibiotics', 'Pain Relief', 'Cold & Flu', 'Vitamins', 'Digestive', 'Skin Care', 'Diabetes Care', 'Eye Care']

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState(MEDICINES)
  const [loading, setLoading]     = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch]               = useState(searchParams.get('search') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')

  useEffect(() => {
    async function load() {
      try {
        await seedMedicines()
        const snap = await getDocs(collection(db, 'medicines'))
        if (!snap.empty) {
          const remote = snap.docs.map(d => ({ id: d.id, ...d.data() }))
          // Merge remote with local MEDICINES so real images & products are always present
          const remoteNames = new Set(remote.map(r => r.name.toLowerCase()))
          const combined = [...remote, ...MEDICINES.filter(m => !remoteNames.has(m.name.toLowerCase()))]
          setMedicines(combined)
        }
      } catch (err) {
        console.warn('Using local catalogue:', err?.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => medicines.filter(m => {
    const matchesSearch = (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory
    return matchesSearch && matchesCategory
  }), [medicines, search, activeCategory])

  function handleCategoryChange(cat) {
    setActiveCategory(cat)
    const p = new URLSearchParams()
    if (cat !== 'All') p.set('category', cat)
    if (search) p.set('search', search)
    setSearchParams(p)
  }

  function handleSearch(val) {
    setSearch(val)
    const p = new URLSearchParams()
    if (activeCategory !== 'All') p.set('category', activeCategory)
    if (val) p.set('search', val)
    setSearchParams(p)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">Browse Medicines</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Verified pharmaceuticals and healthcare products ({filtered.length} available)
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search by medicine name, brand, symptom, or salt..."
          className="w-full pl-12 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-sm"
        />
        {search && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-80 animate-pulse border border-gray-100 dark:border-gray-700" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No medicines found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Try adjusting your search terms or browse a different category</p>
          <button
            onClick={() => { handleSearch(''); handleCategoryChange('All') }}
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm"
          >
            <X className="w-4 h-4" /> Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
            <p>
              Showing <span className="font-bold text-gray-700 dark:text-gray-200">{filtered.length}</span> medicines
              {activeCategory !== 'All' && <> in <span className="font-semibold text-blue-600 dark:text-blue-400">{activeCategory}</span></>}
              {search && <> matching "<span className="font-semibold text-gray-700 dark:text-gray-200">{search}</span>"</>}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(m => (
              <MedicineCard key={m.id || m.name} medicine={m} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
