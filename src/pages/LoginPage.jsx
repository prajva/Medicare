import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, Pill } from 'lucide-react'
import toast from 'react-hot-toast'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'
  const [form, setForm]           = useState({ email: '', password: '' })
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [googleLoading, setGL]    = useState(false)
  const [errors, setErrors]       = useState({})

  function validate() {
    const e = {}
    if (!form.email.trim())    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password)        e.password = 'Password is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const { error } = await signIn({ email: form.email, password: form.password })
    setLoading(false)
    if (error) {
      toast.error(error.message.includes('invalid-credential') ? 'Incorrect email or password' : error.message)
    } else {
      toast.success('Welcome back! 👋')
      navigate(from, { replace: true })
    }
  }

  async function handleGoogle() {
    setGL(true)
    const { error } = await signInWithGoogle()
    setGL(false)
    if (error) {
      if (error.code === 'auth/unauthorized-domain') {
        toast.error('Domain not authorized in Firebase. Check Firebase Console settings.', { duration: 6000 })
      } else {
        toast.error(error.message)
      }
    } else {
      toast.success('Signed in with Google! 🎉')
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 pt-8 pb-10 text-center relative">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur rounded-2xl mb-3">
              <Pill className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">Sign in to your MediCare Plus account</p>
            {/* Wave */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 32" className="w-full fill-white dark:fill-gray-800 transition-colors">
                <path d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z"/>
              </svg>
            </div>
          </div>

          <div className="px-5 sm:px-8 py-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-gray-700/60 rounded-xl py-3 font-semibold text-gray-700 dark:text-gray-200 transition-all text-sm mb-5 disabled:opacity-60 active:scale-[0.99]"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"/>
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"/>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"/>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={e => {
                      setForm(f => ({ ...f, email: e.target.value }))
                      setErrors(r => ({ ...r, email: undefined }))
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-3.5 py-2.5 border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition-all ${
                      errors.email ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    id="password"
                    value={form.password}
                    onChange={e => {
                      setForm(f => ({ ...f, password: e.target.value }))
                      setErrors(r => ({ ...r, password: undefined }))
                    }}
                    placeholder="Your password"
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition-all ${
                      errors.password ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
