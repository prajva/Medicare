import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Firebase configuration for MediCare Plus
const firebaseConfig = {
  apiKey: "AIzaSyAJODOFtKFk5rcYaeiQ69fy6K-wmoNYC30",
  authDomain: "medicare-92206.firebaseapp.com",
  projectId: "medicare-92206",
  storageBucket: "medicare-92206.firebasestorage.app",
  messagingSenderId: "164881617007",
  appId: "1:164881617007:web:c38811d533d885662cbd9a",
  measurementId: "G-SYZS0D0H7W"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)

// Initialize Firebase Analytics if supported in the browser environment
export let analytics = null
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  }).catch(() => {})
}
