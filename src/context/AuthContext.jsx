import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { seedMedicines } from '../lib/seed'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        await fetchProfile(firebaseUser.uid)
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

  // ── Email/Password Signup ─────────────────────────────────
  async function signUp({ email, password, fullName, phone }) {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(newUser, { displayName: fullName })
      await setDoc(doc(db, 'profiles', newUser.uid), {
        uid: newUser.uid, fullName, phone, email, createdAt: new Date(),
      })
      setProfile({ fullName, phone, email })
      return { error: null }
    } catch (err) { return { error: err } }
  }

  // ── Email/Password Login ──────────────────────────────────
  async function signIn({ email, password }) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { error: null }
    } catch (err) { return { error: err } }
  }

  // ── Google Login ──────────────────────────────────────────
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const { user: googleUser } = await signInWithPopup(auth, provider)
      // Create profile if first time
      const profileRef = doc(db, 'profiles', googleUser.uid)
      const profileSnap = await getDoc(profileRef)
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          uid:       googleUser.uid,
          fullName:  googleUser.displayName || '',
          phone:     googleUser.phoneNumber || '',
          email:     googleUser.email,
          createdAt: new Date(),
        })
      }
      return { error: null }
    } catch (err) { return { error: err } }
  }

  // ── Logout ────────────────────────────────────────────────
  async function signOut() {
    await firebaseSignOut(auth)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
