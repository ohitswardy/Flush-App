import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, User, Eye, EyeOff } from 'lucide-react'

export default function SignInModal({ open, onClose }) {
  const { setUser } = useApp()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!password.trim()) { setError('Please enter your password'); return }
    if (isSignUp && !name.trim()) { setError('Please enter your name'); return }
    setError('')
    setLoading(true)
    // Simulate auth
    await new Promise(r => setTimeout(r, 1200))
    const userData = {
      name: isSignUp ? name.trim() : email.split('@')[0],
      email: email.trim().toLowerCase(),
    }
    localStorage.setItem('flush_user', JSON.stringify(userData))
    setUser(userData)
    setLoading(false)
    onClose()
  }

  const reset = () => {
    setEmail('')
    setPassword('')
    setName('')
    setError('')
    setShowPassword(false)
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
            onClick={() => { reset(); onClose() }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-4 top-[15%] z-[85] bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden max-w-[400px] mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2
                className="text-xl font-bold text-neutral-900 dark:text-white"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                onClick={() => { reset(); onClose() }}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X size={20} className="text-neutral-500" />
              </button>
            </div>

            <p className="px-6 text-sm text-neutral-500 dark:text-neutral-400 mb-5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {isSignUp
                ? 'Create an account to sync your data across devices.'
                : 'Sign in to access your saved restrooms and reviews.'}
            </p>

            {/* Form */}
            <div className="px-6 flex flex-col gap-3">
              {isSignUp && (
                <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-700">
                  <User size={18} className="text-neutral-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={e => { setName(e.target.value); setError('') }}
                    className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              )}
              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-700">
                <Mail size={18} className="text-neutral-400 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 flex-shrink-0"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 pt-5 pb-6 flex flex-col gap-3">
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)',
                  boxShadow: '0 4px 16px rgba(13, 148, 136, 0.3)',
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </motion.button>

              <button
                onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                className="text-sm font-medium text-center"
                style={{ color: '#0d9488' }}
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
