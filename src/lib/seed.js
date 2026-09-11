export const MEDICINES = [
  {
    id: 'clariterm-250',
    name: 'Clariterm 250mg Tablets',
    description: 'Clarithromycin Tablets IP 250mg by Cafoli Lifecare. Powerful macrolide antibiotic for respiratory tract infections, skin infections, and throat infections. WHO-GMP Certified. 10 x 1 x 10 tablets pack.',
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
    name: 'Clarithromycin 250mg Film Coated Tablets',
    description: 'Oral route film-coated clarithromycin tablets 250mg. 2 blisters of 10 film-coated tablets for systemic bacterial therapy and fast recovery.',
    price: 185.00,
    category: 'Antibiotics',
    image_url: '/medicines/clarithromycin-tabs.jpg',
    stock: 70,
    is_featured: true,
  }
]

export function getMedicineImage(medicine) {
  if (!medicine) return null
  const name = (medicine.name || '').toLowerCase()
  const id = (medicine.id || '').toLowerCase()
  if (name.includes('clariterm') || id.includes('clariterm')) return '/medicines/clariterm-250.jpg'
  if (name.includes('clarinova') || id.includes('clarinova')) return '/medicines/clarinova-250.jpg'
  if (name.includes('sinarest') || id.includes('sinarest') || name.includes('cold')) return '/medicines/sinarest-tablets.jpg'
  if (name.includes('amoxicillin') || id.includes('amoxicillin') || name.includes('capsule')) return '/medicines/amoxicillin-capsules.jpg'
  if (name.includes('clarithromycin') || id.includes('clarithromycin')) return '/medicines/clarithromycin-tabs.jpg'
  if (medicine.image_url && medicine.image_url.startsWith('/medicines/')) return medicine.image_url
  return '/medicines/clariterm-250.jpg'
}

export async function seedMedicines() {
  // Medicines are locked to the 5 uploaded products
  return
}
