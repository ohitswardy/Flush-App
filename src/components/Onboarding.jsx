import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronRight, Locate, Shield } from 'lucide-react'

const slides = [
  {
    icon: '🚻',
    title: 'Find Restrooms\nAnywhere',
    subtitle: 'Discover clean, accessible restrooms near you — rated and reviewed by the community.',
    color: 'from-primary-500 to-primary-700',
  },
  {
    icon: '⭐',
    title: 'Rate & Share\nYour Experience',
    subtitle: 'Help others by rating restrooms, reporting issues, and adding new locations.',
    color: 'from-accent-500 to-accent-700',
  },
  {
    icon: '📍',
    title: 'Enable Location\nfor Best Results',
    subtitle: 'Allow location access so we can show restrooms nearest to you. Your privacy is our priority.',
    isPermission: true,
    color: 'from-primary-600 to-primary-800',
  },
]

export default function Onboarding() {
  const [current, setCurrent] = useState(0)
  const { completeOnboarding, setLocationPermission, setUserLocation } = useApp()

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const handleLocationPermission = async () => {
    try {
      const permission = await navigator.permissions?.query({ name: 'geolocation' })
      if (permission?.state === 'granted' || permission?.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            setLocationPermission('granted')
            completeOnboarding()
          },
          () => {
            setLocationPermission('denied')
            completeOnboarding()
          },
          { enableHighAccuracy: true, timeout: 10000 }
        )
      } else {
        setLocationPermission('denied')
        completeOnboarding()
      }
    } catch {
      // Fallback for browsers without Permissions API
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          setLocationPermission('granted')
          completeOnboarding()
        },
        () => {
          setLocationPermission('denied')
          completeOnboarding()
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }

  const slide = slides[current]

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-neutral-950 flex flex-col">
      {/* Skip button */}
      {current < slides.length - 1 && (
        <div className="safe-top flex justify-end px-5 pt-4">
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-neutral-500 dark:text-neutral-400 touch-target px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Skip
          </button>
        </div>
      )}
      {current === slides.length - 1 && (
        <div className="safe-top flex justify-end px-5 pt-4">
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-neutral-500 dark:text-neutral-400 touch-target px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Not now
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center w-full max-w-sm"
          >
            {/* Icon / Illustration */}
            <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center mb-8 shadow-lg`}>
              {slide.isPermission ? (
                <Locate size={48} className="text-white" />
              ) : (
                <span className="text-5xl">{slide.icon}</span>
              )}
            </div>

            <h1 className="text-[28px] font-bold leading-tight text-neutral-900 dark:text-white whitespace-pre-line mb-4">
              {slide.title}
            </h1>
            <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[280px]">
              {slide.subtitle}
            </p>

            {slide.isPermission && (
              <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                <Shield size={14} />
                <span>We never share your exact location</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-10 safe-bottom">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-primary-600'
                  : 'w-2 bg-neutral-300 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        {slide.isPermission ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLocationPermission}
              className="w-full py-4 rounded-2xl bg-primary-600 text-white font-semibold text-base shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <Locate size={18} />
              Enable Location
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-primary-600 text-white font-semibold text-base shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
