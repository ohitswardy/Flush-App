import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Mail, User, Eye, EyeOff } from 'lucide-react'

/* ── Slide data ──────────────────────────────────────── */
const slides = [
  {
    image: '/onboarding1.jpg',
    title: 'Find Restrooms Nearby',
    description:
      'Discover clean and accessible restrooms around you with ease.\nOur app helps you locate the nearest facilities in seconds.',
  },
  {
    image: '/onboarding2.png',
    title: 'Rate & Share your Experience',
    description:
      'Share your restroom experiences with others.\nHelp improve the community by rating and reviewing facilities.',
  },
  {
    image: '/onboarding3.png',
    title: 'Enable Location Access',
    description:
      'Allow location access to find nearby restrooms.\nWe respect your privacy and only use location data for restroom discovery.',
    isPermission: true,
  },
  {
    image: null,
    title: 'Sign In to Save Your Data',
    description:
      'Create an account to sync your saved restrooms, reviews, and contributions across all your devices.',
    isSignIn: true,
  },
]

/* ── Framer Motion variants ──────────────────────────── */
const imageVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 48 : -48, scale: 0.94 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -48 : 48, scale: 0.94 }),
}

const textVariants = {
  enter: (dir) => ({ opacity: 0, y: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, y: 0 },
  exit: (dir) => ({ opacity: 0, y: dir > 0 ? -24 : 24 }),
}

const transition = { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }

/* ── SVG wave/dome separator ─────────────────────────── */
const wavePaths = {
  // Slide 0 — concave sweep: low-left rising to upper-right
  0: 'M-5,100 L-5,82 C80,78 240,4 405,0 L405,100 Z',
  // Slide 1 — dome / arch centered
  1: 'M-10,100 L-10,90 C60,-28 340,-28 410,90 L410,100 Z',
  // Slide 2 — concave sweep mirrored: high-left falling to lower-right
  2: 'M-5,100 L-5,0 C140,4 320,78 405,82 L405,100 Z',
  // Slide 3 — gentle dome for sign-in
  3: 'M-10,100 L-10,85 C100,20 300,20 410,85 L410,100 Z',
}

function WaveSeparator({ slideIndex }) {
  const isDome = slideIndex === 1
  const gradientId = `waveGrad-${slideIndex}`

  return (
    <svg
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      style={{ height: isDome ? '28%' : '22%' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <path d={wavePaths[slideIndex] ?? wavePaths[0]} fill={`url(#${gradientId})`} />
    </svg>
  )
}

/* ── Main component ──────────────────────────────────── */
export default function Onboarding() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const headingRef = useRef(null)
  const { completeOnboarding, setLocationPermission, setUserLocation, setUser } = useApp()
  const [signInMode, setSignInMode] = useState('choice') // 'choice' | 'form'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const slide = slides[current]
  const isLast = current === slides.length - 1
  const isLocationSlide = slide.isPermission
  const isSignInSlide = slide.isSignIn

  /* Navigation helpers */
  const goTo = (i) => {
    if (i < 0 || i >= slides.length) return
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }

  const handleNext = () => {
    if (!isLast) goTo(current + 1)
    else completeOnboarding()
  }

  const handleSignIn = async () => {
    if (!email.trim()) { setAuthError('Please enter your email'); return }
    if (!password.trim()) { setAuthError('Please enter your password'); return }
    if (isSignUp && !name.trim()) { setAuthError('Please enter your name'); return }
    setAuthError('')
    setAuthLoading(true)
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 1200))
    const userData = {
      name: isSignUp ? name.trim() : email.split('@')[0],
      email: email.trim().toLowerCase(),
    }
    localStorage.setItem('banyo_user', JSON.stringify(userData))
    setUser(userData)
    setAuthLoading(false)
    completeOnboarding()
  }

  const handleGuestContinue = () => {
    completeOnboarding()
  }

  const handleLocationPermission = async () => {
    const onSuccess = (pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      setLocationPermission('granted')
      goTo(current + 1) // advance to sign-in slide
    }
    const onError = () => {
      setLocationPermission('denied')
      goTo(current + 1) // advance to sign-in slide
    }
    const opts = { enableHighAccuracy: true, timeout: 10000 }

    try {
      const perm = await navigator.permissions?.query({ name: 'geolocation' })
      if (perm?.state === 'granted' || perm?.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(onSuccess, onError, opts)
      } else {
        onError()
      }
    } catch {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, opts)
    }
  }

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(current + 1)
      else if (e.key === 'ArrowLeft') goTo(current - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /* Auto-focus heading for a11y */
  useEffect(() => {
    const t = setTimeout(() => headingRef.current?.focus(), 120)
    return () => clearTimeout(t)
  }, [current])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ background: '#F5F3F0' }}
    >
      {/* ═══ Top: illustration area ═══ */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{ flex: '1.2' }}
      >
        {/* Skip — top-right, orange text */}
        {!isLast && (
          <motion.button
            onClick={completeOnboarding}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-5 safe-top z-10 px-3 py-1.5 text-[13px] font-semibold tracking-wide rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            style={{ color: '#0d9488' }}
          >
            Skip
          </motion.button>
        )}

        {/* Illustration */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className={current === 2
              ? 'w-full absolute inset-0 bottom-[18%] flex items-center justify-center overflow-hidden'
              : isSignInSlide
                ? 'flex flex-col items-center justify-center gap-3'
                : 'w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center'
            }
          >
            {isSignInSlide ? (
              <img
                src="/FlushIcon.png"
                alt="Flush icon"
                className="w-36 h-36 object-contain"
                draggable={false}
              />
            ) : (
              <img
                src={slide.image}
                alt=""
                className={current === 2
                  ? 'w-full h-full object-cover'
                  : 'w-full h-full object-contain'
                }
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wave separator */}
        <WaveSeparator slideIndex={current} />
      </div>

      {/* ═══ Bottom: text + controls ═══ */}
      <div
        className="relative flex flex-col px-7 pt-5 pb-20 safe-bottom"
        style={{ flex: '1.0' }}
      >
        {/* Screen reader live region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Step {current + 1} of {slides.length}: {slide.title}
        </div>

        {/* Text block */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${current}-${signInMode}`}
            custom={direction}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="flex-1 flex flex-col justify-center gap-3"
          >
            {/* Title */}
            <motion.h1
              ref={headingRef}
              tabIndex={-1}
              className="outline-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#1A1A1A',
              }}
            >
              {isSignInSlide && signInMode === 'form'
                ? (isSignUp ? 'Create Account' : 'Welcome Back')
                : slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="whitespace-pre-line"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 'clamp(0.8125rem, 3.2vw, 0.9375rem)',
                lineHeight: 1.6,
                color: '#8A8A8A',
                maxWidth: '320px',
              }}
            >
              {isSignInSlide && signInMode === 'form'
                ? (isSignUp ? 'Fill in your details to get started.' : 'Sign in with your email and password.')
                : slide.description}
            </motion.p>

            {/* Sign-in form — only on sign-in slide in form mode */}
            {isSignInSlide && signInMode === 'form' && (
              <div className="flex flex-col gap-3 mt-2">
                {isSignUp && (
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-neutral-200">
                    <User size={18} className="text-neutral-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={e => { setName(e.target.value); setAuthError('') }}
                      className="flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-neutral-200">
                  <Mail size={18} className="text-neutral-400 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setAuthError('') }}
                    className="flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-neutral-200">
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
                    onChange={e => { setPassword(e.target.value); setAuthError('') }}
                    className="flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                {authError && (
                  <p className="text-xs text-red-500 font-medium">{authError}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom bar: dots + CTA ── */}
        {isSignInSlide ? (
          <div className="flex flex-col gap-3 mt-4 mb-10">
            {signInMode === 'choice' ? (
              <>
                {/* Sign in with email */}
                <motion.button
                  onClick={() => { setSignInMode('form'); setIsSignUp(false) }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)',
                    boxShadow: '0 4px 16px rgba(13, 148, 136, 0.3)',
                  }}
                >
                  <Mail size={18} />
                  Sign in with Email
                </motion.button>

                {/* Create account */}
                <motion.button
                  onClick={() => { setSignInMode('form'); setIsSignUp(true) }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm border-2 flex items-center justify-center gap-2"
                  style={{ borderColor: '#0d9488', color: '#0d9488' }}
                >
                  <User size={18} />
                  Create Account
                </motion.button>

                {/* Continue as guest */}
                <button
                  onClick={handleGuestContinue}
                  className="w-full py-2 text-sm font-medium text-center"
                  style={{ color: '#8A8A8A' }}
                >
                  Continue as Guest
                </button>
              </>
            ) : (
              <>
                {/* Submit sign in / sign up */}
                <motion.button
                  onClick={handleSignIn}
                  disabled={authLoading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)',
                    boxShadow: '0 4px 16px rgba(13, 148, 136, 0.3)',
                  }}
                >
                  {authLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>{isSignUp ? 'Create Account' : 'Sign In'}</>
                  )}
                </motion.button>

                {/* Toggle sign-in / sign-up */}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setAuthError('') }}
                  className="text-sm font-medium text-center"
                  style={{ color: '#0d9488' }}
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>

                {/* Back to choices */}
                <button
                  onClick={() => { setSignInMode('choice'); setAuthError('') }}
                  className="text-sm font-medium text-center"
                  style={{ color: '#8A8A8A' }}
                >
                  Back
                </button>
              </>
            )}
          </div>
        ) : (
        <div className="flex items-center justify-between mt-4 mb-16">
          {/* Dot indicators */}
          <nav className="flex items-center gap-2" aria-label="Onboarding steps">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Step ${i + 1}`}
                aria-current={i === current ? 'step' : undefined}
                className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 rounded-full"
              >
                <motion.div
                  className="rounded-full"
                  animate={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    backgroundColor: i === current ? '#0d9488' : '#C4C4C4',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              </button>
            ))}
          </nav>

          {/* Action button */}
          {isLocationSlide ? (
            <motion.button
              onClick={handleLocationPermission}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="px-6 py-3 rounded-xl border-2 font-bold text-sm uppercase tracking-[0.12em] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
              style={{
                borderColor: '#0d9488',
                color: '#0d9488',
                background: 'transparent',
              }}
            >
              Enable Location
            </motion.button>
          ) : (
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center justify-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
              style={{
                width: 52,
                height: 52,
                background: 'linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)',
                boxShadow: '0 4px 16px rgba(13, 148, 136, 0.35)',
              }}
            >
              <ChevronRight size={20} strokeWidth={2.5} color="#fff" />
            </motion.button>
          )}
        </div>
        )}
      </div>
    </motion.div>
  )
}
