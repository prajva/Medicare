import { db } from './firebase'
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore'

export const MEDICINES = [
  {
    id: 'clariterm-250',
    name: 'Clariterm 250mg Tablets',
    description: 'Clarithromycin Tablets IP 250mg by Cafoli Lifecare. Powerful macrolide antibiotic for respiratory tract infections, skin infections, and throat infections. WHO-GMP Certified.',
    price: 145.00,
    category: 'Antibiotics',
    image_url: '/medicines/clariterm-250.jpg',
    stock: 85,
    is_featured: true,
  },
  {
    id: 'sinarest-cold',
    name: 'Sinarest New Anti-Cold Tablets',
    description: 'No. 1 doctor prescribed formula: Paracetamol + Phenylephrine Hydrochloride + Chlorpheniramine Maleate. Relieves runny nose, sneezing, headache, fever, and nasal congestion.',
    price: 68.50,
    category: 'Cold & Flu',
    image_url: '/medicines/sinarest-tablets.jpg',
    stock: 150,
    is_featured: true,
  },
  {
    id: 'amoxicillin-500',
    name: 'Amoxicillin 500mg Capsules',
    description: 'High quality broad-spectrum penicillin antibiotic capsules. Treats bacterial infections of the chest, ears, throat, urinary tract, and dental infections. 10 capsules per blister.',
    price: 92.00,
    category: 'Antibiotics',
    image_url: '/medicines/amoxicillin-capsules.jpg',
    stock: 120,
    is_featured: true,
  },
  {
    id: 'clarinova-250',
    name: 'Clarinova-250 Tablets',
    description: 'Clarithromycin Tablets IP 250mg manufactured by Mankind Pharma. Proven efficacy in treating upper and lower respiratory tract infections. Strip of 6 tablets.',
    price: 162.00,
    category: 'Antibiotics',
    image_url: '/medicines/clarinova-250.jpg',
    stock: 95,
    is_featured: true,
  },
  {
    id: 'clarithromycin-250',
    name: 'Clarithromycin 250mg Film Coated',
    description: 'Oral route film-coated clarithromycin tablets 250mg. 2 blisters of 10 film-coated tablets for systemic bacterial therapy and fast recovery.',
    price: 185.00,
    category: 'Antibiotics',
    image_url: '/medicines/clarithromycin-tabs.jpg',
    stock: 70,
    is_featured: false,
  },
  {
    id: 'paracetamol-500',
    name: 'Paracetamol 500mg Fast Relief',
    description: 'Effective pain reliever and fever reducer. Suitable for headaches, muscle ache, toothache, and mild fever. Safe for adults and seniors.',
    price: 18.50,
    category: 'Pain Relief',
    image_url: '/medicines/sinarest-tablets.jpg',
    stock: 200,
    is_featured: true,
  },
  {
    id: 'vitamin-c-1000',
    name: 'Vitamin C 1000mg + Zinc',
    description: 'High-potency immunity booster tablets. Fights seasonal infections, promotes collagen synthesis and antioxidant defense.',
    price: 65.00,
    category: 'Vitamins',
    image_url: '',
    stock: 180,
    is_featured: true,
  },
  {
    id: 'cetirizine-10',
    name: 'Cetirizine 10mg Anti-Allergy',
    description: 'Non-drowsy 24-hour antihistamine. Effective for relief from pollen, dust allergies, hives, and itchy watery eyes.',
    price: 24.00,
    category: 'Cold & Flu',
    image_url: '',
    stock: 160,
    is_featured: false,
  },
  {
    id: 'probiotics-10b',
    name: 'Probiotics 10 Billion CFU',
    description: 'Digestive balance and gut health capsules. Restores healthy gut flora after antibiotic treatment and improves nutrient absorption.',
    price: 120.00,
    category: 'Digestive',
    image_url: '/medicines/amoxicillin-capsules.jpg',
    stock: 75,
    is_featured: false,
  },
  {
    id: 'ors-sachets',
    name: 'ORS Electrolyte Hydration Drink',
    description: 'WHO recommended oral rehydration formula with essential electrolytes. Restores lost body fluids and restores vital energy fast.',
    price: 22.00,
    category: 'Digestive',
    image_url: '',
    stock: 220,
    is_featured: false,
  },
  {
    id: 'antiseptic-cream',
    name: 'Antiseptic Healing Cream 30g',
    description: 'Broad-spectrum antimicrobial first-aid ointment for minor cuts, scrapes, burns, and abrasions.',
    price: 45.00,
    category: 'Skin Care',
    image_url: '',
    stock: 110,
    is_featured: false,
  },
  {
    id: 'glucometer-strips',
    name: 'Glucometer Test Strips (Pack of 50)',
    description: 'High-accuracy self-monitoring blood glucose test strips. Delivers results within 5 seconds with tiny blood sample size.',
    price: 299.00,
    category: 'Diabetes Care',
    image_url: '',
    stock: 50,
    is_featured: false,
  },
  {
    id: 'eye-drops',
    name: 'Lubricating Eye Drops 10ml',
    description: 'Preservative-free sterile ophthalmic solution for dry, tired, strained eyes due to screen exposure or dry air.',
    price: 85.00,
    category: 'Eye Care',
    image_url: '',
    stock: 90,
    is_featured: false,
  }
]

export function getMedicineImage(medicine) {
  if (!medicine) return null
  const name = (medicine.name || '').toLowerCase()
  const id = (medicine.id || '').toLowerCase()
  if (name.includes('clariterm') || id.includes('clariterm')) return '/medicines/clariterm-250.jpg'
  if (name.includes('clarinova') || id.includes('clarinova')) return '/medicines/clarinova-250.jpg'
  if (name.includes('sinarest') || name.includes('cold') || name.includes('paracetamol')) return '/medicines/sinarest-tablets.jpg'
  if (name.includes('amoxicillin') || name.includes('capsule')) return '/medicines/amoxicillin-capsules.jpg'
  if (name.includes('clarithromycin')) return '/medicines/clarithromycin-tabs.jpg'
  if (medicine.image_url && medicine.image_url.startsWith('/medicines/')) return medicine.image_url
  return null
}

export async function seedMedicines() {
  try {
    const col = collection(db, 'medicines')
    const existing = await getDocs(query(col, limit(1)))
    if (existing.empty) {
      for (const med of MEDICINES) {
        await addDoc(col, { ...med, createdAt: new Date() })
      }
    }
  } catch (err) {
    console.warn('Firestore seed optional skip:', err?.message)
  }
}
