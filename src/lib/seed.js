// Seed script — paste in browser console or run via Node after setup
// This adds all medicines to Firestore once.
// Usage: import and call seedMedicines() once from your app, or run manually.

import { db } from './firebase'
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore'

const MEDICINES = [
  { name: 'Paracetamol 500mg', description: 'Effective pain reliever and fever reducer. Suitable for headaches, muscle pain, and mild fever. Safe for adults and children.', price: 12.50, category: 'Pain Relief', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', stock: 200, is_featured: true },
  { name: 'Ibuprofen 400mg', description: 'Anti-inflammatory and analgesic tablet. Provides fast relief from headaches, toothaches, backaches, and menstrual pain.', price: 18.00, category: 'Pain Relief', image_url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80', stock: 150, is_featured: false },
  { name: 'Aspirin 325mg', description: 'Relieves minor aches and pains, reduces fever. Also used as a blood thinner for cardiovascular health. 30 tablets per pack.', price: 9.99, category: 'Pain Relief', image_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80', stock: 180, is_featured: false },
  { name: 'Vitamin C 1000mg', description: 'High-strength Vitamin C supplement to boost immunity and fight oxidative stress. With zinc for enhanced absorption.', price: 35.00, category: 'Vitamins', image_url: 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&q=80', stock: 300, is_featured: true },
  { name: 'Multivitamin Daily', description: 'Complete daily multivitamin with 23 essential vitamins and minerals. Supports energy, immunity, and overall well-being.', price: 55.00, category: 'Vitamins', image_url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80', stock: 250, is_featured: true },
  { name: 'Omega-3 Fish Oil', description: 'High-quality omega-3 fatty acids from deep-sea fish. Supports heart, brain, and joint health. 60 softgels per pack.', price: 75.00, category: 'Vitamins', image_url: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80', stock: 120, is_featured: false },
  { name: 'Cetirizine 10mg', description: 'Non-drowsy antihistamine for allergy relief. Effective against hay fever, dust allergies, and skin reactions.', price: 22.00, category: 'Cold & Flu', image_url: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&q=80', stock: 200, is_featured: false },
  { name: 'Cough Syrup 100ml', description: 'Soothing cough syrup with honey and tulsi extract. Relieves dry and wet cough, soothes throat irritation.', price: 48.00, category: 'Cold & Flu', image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80', stock: 90, is_featured: true },
  { name: 'Cold & Flu Tablets', description: 'Combined formula with paracetamol, pseudoephedrine, and chlorphenamine. Relieves blocked nose, fever, and headache.', price: 28.50, category: 'Cold & Flu', image_url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', stock: 160, is_featured: false },
  { name: 'Antacid Tablets', description: 'Fast-acting antacid providing instant relief from heartburn, acidity, and indigestion. Mint flavour. Pack of 20.', price: 15.00, category: 'Digestive', image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80', stock: 250, is_featured: false },
  { name: 'Probiotics Capsules', description: 'Multi-strain probiotic with 10 billion CFU. Supports gut health, digestion, and boosts immune function.', price: 95.00, category: 'Digestive', image_url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80', stock: 80, is_featured: true },
  { name: 'ORS Sachets (Pack of 10)', description: 'Oral rehydration salts with electrolytes. Rapidly restores fluids lost due to diarrhoea, vomiting, or dehydration.', price: 20.00, category: 'Digestive', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', stock: 400, is_featured: false },
  { name: 'Antiseptic Cream 30g', description: 'Broad-spectrum antiseptic cream for minor cuts, burns, and skin infections. Promotes healing and prevents infection.', price: 32.00, category: 'Skin Care', image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80', stock: 140, is_featured: false },
  { name: 'Moisturising Lotion 200ml', description: 'Deeply hydrating lotion with aloe vera and vitamin E. Suitable for dry and sensitive skin. Dermatologist tested.', price: 85.00, category: 'Skin Care', image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80', stock: 100, is_featured: false },
  { name: 'Glucometer Test Strips (50)', description: 'High-accuracy blood glucose test strips. For diabetic self-monitoring.', price: 220.00, category: 'Diabetes Care', image_url: 'https://images.unsplash.com/photo-1631815588090-d1bcbe9a2f3d?w=400&q=80', stock: 60, is_featured: false },
  { name: 'Eye Drops (Lubricating)', description: 'Preservative-free lubricating eye drops for dry, tired, or irritated eyes. Suitable for contact lens wearers.', price: 65.00, category: 'Eye Care', image_url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80', stock: 110, is_featured: false },
]

export async function seedMedicines() {
  const col = collection(db, 'medicines')
  const existing = await getDocs(query(col, limit(1)))
  if (!existing.empty) {
    console.log('Medicines already seeded.')
    return
  }
  for (const med of MEDICINES) {
    await addDoc(col, { ...med, createdAt: new Date() })
  }
  console.log('✅ Medicines seeded successfully!')
}
