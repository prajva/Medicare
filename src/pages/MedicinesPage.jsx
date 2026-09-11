import { useEffect, useState, useMemo } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { seedMedicines } from '../lib/seed'
import MedicineCard from '../components/medicine/MedicineCard'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const CATEGORIES = ['All', 'Pain Relief', 'Vitamins', 'Cold & Flu', 'Digestive', 'Skin Care', 'Diabetes Care', 'Eye Care']

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading]     = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch]               = useState(searchParams.get('search') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')

  useEffect(() => {
    async function load() {
      await seedMedicines()
      const snap = await getDocs(query(collection(db, 'medicines'), orderBy('name')))
      setMedicines(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
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
        <h1 className="text-3xl font-bold text-gray-900 mb-1">All Medicines</h1>
        <p className="text-gray-500">Browse our complete catalogue of {medicines.length} medicines</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={e => handleSearch(e.target.value)}
          placeholder="Search by name or description..."
          className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" />
        {search && (
          <button onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or browse a different category</p>
          <button onClick={() => { handleSearch(''); handleCategoryChange('All') }}
            className="mt-4 text-blue-600 font-medium hover:underline flex items-center gap-1 mx-auto">
            <X className="w-4 h-4" /> Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> results
            {activeCategory !== 'All' && <> in <span className="font-semibold text-blue-600">{activeCategory}</span></>}
            {search && <> matching "<span className="font-semibold text-gray-700">{search}</span>"</>}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(m => <MedicineCard key={m.id} medicine={m} />)}
          </div>
        </>
      )}
    </div>
  )
}
