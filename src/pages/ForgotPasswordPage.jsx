import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { Mail, ArrowLeft, Pill, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
      toast.success('Reset email sent!')
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : err.message
      toast.error(msg)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">

          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 pt-8 pb-10 text-center relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-3">
              <Pill className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-purple-100 text-sm mt-1">We'll send a reset link to your email</p>
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 32" className="w-full" fill="white">
                <path d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z"/>
              </svg>
            </div>
          </div>

          <div className="px-8 py-6">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500"/>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">Check your inbox!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="font-semibold text-blue-600 text-sm mb-6">{email}</p>
                <p className="text-gray-400 text-xs mb-6">
                  Click the link in the email to reset your password. Check spam if you don't see it.
                </p>
                <Link to="/login"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                  <ArrowLeft className="w-4 h-4"/> Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4">
                  Enter the email address linked to your MediCare Plus account
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                    <input type="email" value={email}
                      onChange={e => { setEmail(e.target.value); setError('') }}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}/>
                  </div>
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending…</>
                    : '📧 Send Reset Link'}
                </button>

                <Link to="/login"
                  className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors mt-2">
                  <ArrowLeft className="w-3.5 h-3.5"/> Back to Sign In
                </Link>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
