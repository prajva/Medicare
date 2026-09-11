import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, Pill } from 'lucide-react'
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

// InputField declared OUTSIDE SignupPage so it never remounts or loses focus on keystroke!
function InputField({ icon: Icon, name, label, type = 'text', placeholder, value, onChange, error, right, autoComplete }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full pl-10 ${right ? 'pr-10' : 'pr-3.5'} py-2.5 border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition-all ${
            error ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-gray-200'
          }`}
        />
        {right}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [googleLoading, setGL]    = useState(false)
  const [errors, setErrors]       = useState({})

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim())    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.phone.trim())    e.phone    = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g,''))) e.phone = 'Enter a valid 10-digit mobile number'
    if (!form.password)        e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Must be at least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const { error } = await signUp({ email: form.email, password: form.password, fullName: form.fullName, phone: form.phone })
    setLoading(false)
    if (error) toast.error(error.message)
    else { toast.success('Account created! Welcome to MediCare Plus 🎉'); navigate('/') }
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
      navigate('/')
    }
  }

  const handle = field => e => {
    const val = e.target.value
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) {
      setErrors(err => ({ ...err, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 sm:px-8 pt-8 pb-10 text-center relative">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur rounded-2xl mb-3">
              <Pill className="w-7 h-7 sm:w-8 sm:h-8 text-white"/>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Create Account</h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">Join MediCare Plus for fast medicine delivery</p>
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 32" className="w-full fill-white dark:fill-gray-800 transition-colors">
                <path d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z"/>
              </svg>
            </div>
          </div>

          <div className="px-5 sm:px-8 py-6">
            {/* Google Quick Button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-gray-700/60 rounded-xl py-3 font-semibold text-gray-700 dark:text-gray-200 transition-all text-sm mb-5 disabled:opacity-60 active:scale-[0.99]"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"/>
              ) : (
                <GoogleIcon/>
              )}
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"/>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or register with email</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"/>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                icon={User}
                name="fullName"
                label="Full Name *"
                placeholder="Prajval Kedlaya"
                value={form.fullName}
                onChange={handle('fullName')}
                error={errors.fullName}
                autoComplete="name"
              />

              <InputField
                icon={Mail}
                name="email"
                label="Email Address *"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle('email')}
                error={errors.email}
                autoComplete="email"
              />

              <InputField
                icon={Phone}
                name="phone"
                label="Phone Number *"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={handle('phone')}
                error={errors.phone}
                autoComplete="tel"
              />

              <InputField
                icon={Lock}
                name="password"
                label="Password *"
                type={showPass ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handle('password')}
                error={errors.password}
                autoComplete="new-password"
                right={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                }
              />

              <InputField
                icon={Lock}
                name="confirmPassword"
                label="Confirm Password *"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handle('confirmPassword')}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    Creating account…
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
