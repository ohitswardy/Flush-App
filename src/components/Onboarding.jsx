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

/* ── Framer Motion variants (neo-brutalist: snappy) ──── */
const imageVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 20 : -20 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -20 : 20 }),
}

const textVariants = {
  enter: (dir) => ({ opacity: 0, y: dir > 0 ? 10 : -10 }),
  center: { opacity: 1, y: 0 },
  exit: (dir) => ({ opacity: 0, y: dir > 0 ? -10 : 10 }),
}

const transition = { duration: 0.25, ease: [0.2, 0, 0.2, 1] }

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
    localStorage.setItem('flush_user', JSON.stringify(userData))
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
      className="fixed inset-0 z[100] flex flex-col overflow-hidden bg-[#FFFDF0] dark:bg-neutral-950"
    >
      {/* ═══ Top: illustration area ═══ */}
      <div
        className="relative flex flex-col items-center justify-center border-b-4 border-black dark:border-white"
        style={{ flex: '1.2' }}
      >
        {/* Skip — top-right, orange text */}
        {!isLast && (
          <motion.button
            onClick={completeOnboarding}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ x: 1, y: 1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-5 safe-top z-10 px-4 py-1.5 text-[13px] font-black uppercase tracking-[0.15em] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 text-neutral-900 dark:text-white bg-[#FFFDF0] border-2 border-black dark:border-white/20 shadow-md"
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
                className="w-36 h-36 object-contain border-2 border-black dark:border-white shadow-md bg-white dark:bg-neutral-900 p-3"
                draggable={false}
              />
            ) : (
              <img
                src={slide.image}
                alt=""
                className={current === 2
                  ? 'w-full h-full object-cover'
                  : 'w-full h-full object-contain border-2 border-black dark:border-white shadow-md'
                }
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Divider provided by border-b-4 on parent */}
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
              className="outline-none text-neutral-900 dark:text-white"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1.6rem, 5.5vw, 2rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
              }}
            >
              {isSignInSlide && signInMode === 'form'
                ? (isSignUp ? 'Create Account' : 'Welcome Back')
                : slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="whitespace-pre-line text-neutral-600 dark:text-neutral-400"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 400,
                fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
                lineHeight: 1.6,
                maxWidth: '340px',
              }}
            >
              {isSignInSlide && signInMode === 'form'
                ? (isSignUp ? 'Fill in your details to get started.' : 'Sign in with your email and password.')
                : slide.description}
            </motion.p>

            {/* Sign-in form — only on sign-in slide in form mode */}
            {isSignInSlide && signInMode === 'form' && (
              <div className="flex flex-col gap-3 mt-3">
                {isSignUp && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-md">
                    <User size={18} className="text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={e => { setName(e.target.value); setAuthError('') }}
                      className="flex-1 bg-transparent text-sm font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-md">
                  <Mail size={18} class Name="text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setAuthError('') }}
                    className="flex-1 bg-transparent text-sm font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-md">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-600 dark:text-neutral-400 flex-shrink-0"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setAuthError('') }}
                    className="flex-1 bg-transparent text-sm font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  />
                </div>
                {authError && (
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{authError}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom bar: dots + CTA ── */}
        {isSignInSlide ? (
          <div className="flex flex-col gap-4 mt-4 mb-6">
            {signInMode === 'choice' ? (
              <>
                {/* Sign in with email */}
                <motion.button
                  onClick={() => { setSignInMode('form'); setIsSignUp(false) }}
                  whileHover={{ x: 2, y: 2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 font-black text-sm text-white flex items-center justify-center gap-2 uppercase tracking-[0.08em] bg-primary-600 border-2 border-black dark:border-white shadow-md"
                >
                  <Mail size={18} />
                  Sign in with Email
                </motion.button>

                {/* Create account */}
                <motion.button
                  onClick={() => { setSignInMode('form'); setIsSignUp(true) }}
                  whileHover={{ x: 2, y: 2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 font-black text-sm flex items-center justify-center gap-2 uppercase tracking-[0.08em] bg-[#FFFDF0] dark:bg-neutral-900 border-2 border-black dark:border-white text-primary-600 dark:text-primary-400 shadow-md"
                >
                  <User size={18} />
                  Create Account
                </motion.button>

                {/* Continue as guest */}
                <button
                  onClick={handleGuestContinue}
                  className="w-full py-2 text-sm font-bold text-center uppercase tracking-[0.1em] text-neutral-900 dark:text-white underline decoration-2 underline-offset-4"
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
                  whileHover={{ x: 2, y: 2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 font-black text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60 uppercase tracking-[0.08em] bg-primary-600 border-2 border-black dark:border-white shadow-md"
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
                  className="text-sm font-bold text-center text-primary-600 dark:text-primary-400 underline decoration-2 underline-offset-4"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>

                {/* Back to choices */}
                <button
                  onClick={() => { setSignInMode('choice'); setAuthError('') }}
                  className="text-sm font-bold text-center uppercase tracking-[0.08em] text-neutral-900 dark:text-white border-2 border-black dark:border-white px-4 py-2 shadow-md"
                >
                  ← Back
                </button>
              </>
            )}
          </div>
        ) : (
        <div className="flex items-center justify-between mt-4 mb-16">
          {/* Step indicators */}
          <nav className="flex items-center gap-2" aria-label="Onboarding steps">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Step ${i + 1}`}
                aria-current={i === current ? 'step' : undefined}
                className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
              >
                <motion.div
                  className="border-2 border-black dark:border-white"
                  animate={{
                    width: i === current ? 28 : 12,
                    height: 12,
                    backgroundColor: i === current ? '#0d9488' : 'transparent',
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
              whileHover={{ x: 2, y: 2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="px-6 py-3 font-black text-sm uppercase tracking-[0.12em] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 border-2 border-black dark:border-white text-primary-600 dark:text-primary-400 bg-[#FFFDF0] dark:bg-neutral-900 shadow-md"
            >
              Enable Location
            </motion.button>
          ) : (
            <motion.button
              onClick={handleNext}
              whileHover={{ x: 2, y: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 w-14 h-14 bg-primary-600 border-2 border-black dark:border-white shadow-md"
            >
              <ChevronRight size={22} strokeWidth={3} color="#fff" />
            </motion.button>
          )}
        </div>
        )}
      </div>
    </motion.div>
  )
}
