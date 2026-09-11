import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { seedMedicines } from '../lib/seed'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        await fetchProfile(firebaseUser.uid)
        // Seed medicines on first load (safe — skips if already seeded)
        seedMedicines().catch(console.error)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function fetchProfile(uid) {
    const snap = await getDoc(doc(db, 'profiles', uid))
    if (snap.exists()) setProfile(snap.data())
  }

  async function signUp({ email, password, fullName, phone }) {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      // Update display name
      await updateProfile(newUser, { displayName: fullName })
      // Store profile in Firestore
      await setDoc(doc(db, 'profiles', newUser.uid), {
        uid: newUser.uid,
        fullName,
        phone,
        email,
        createdAt: new Date(),
      })
      setProfile({ fullName, phone, email })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  async function signIn({ email, password }) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  async function signOut() {
    await firebaseSignOut(auth)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
