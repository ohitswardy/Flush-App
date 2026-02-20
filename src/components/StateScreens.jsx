import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  WifiOff,
  MapPinOff,
  SearchX,
  AlertTriangle,
  RefreshCw,
  Settings,
  MapPin,
} from 'lucide-react'

export function OfflineState() {
  return (
    <StateContainer>
      <StateIcon color="bg-amber-50 dark:bg-amber-900/20">
        <WifiOff size={32} className="text-warning" />
      </StateIcon>
      <h2 className="text-lg font-bold text-neutral-900 dark:text-white">No Internet Connection</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-[280px]">
        You're currently offline. Some features may be limited, but you can still view cached restrooms.
      </p>
      <button className="mt-4 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold active:scale-95 transition-transform flex items-center gap-2">
        <RefreshCw size={16} />
        Try Again
      </button>
    </StateContainer>
  )
}

export function LocationDeniedState() {
  const { setScreen } = useApp()

  return (
    <StateContainer>
      <StateIcon color="bg-red-50 dark:bg-red-900/20">
        <MapPinOff size={32} className="text-error" />
      </StateIcon>
      <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Location Access Denied</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-[280px]">
        We need location access to show restrooms near you. You can still search manually or enable location in settings.
      </p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setScreen('home')}
          className="px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 active:scale-95 transition-transform"
        >
          Search Manually
        </button>
        <button className="px-5 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold active:scale-95 transition-transform flex items-center gap-2">
          <Settings size={16} />
          Open Settings
        </button>
      </div>
    </StateContainer>
  )
}

export function EmptyMapState() {
  const { resetFilters } = useApp()

  return (
    <div className="absolute inset-0 z-[35] pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg rounded-2xl p-6 shadow-lg mx-8 pointer-events-auto text-center"
      >
        <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 mx-auto flex items-center justify-center mb-3">
          <SearchX size={24} className="text-neutral-400" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">No Restrooms Found</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Try adjusting your filters or searching in a different area.
        </p>
        <button
          onClick={resetFilters}
          className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold active:scale-95 transition-transform"
        >
          Clear Filters
        </button>
      </motion.div>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <StateContainer>
      <StateIcon color="bg-red-50 dark:bg-red-900/20">
        <AlertTriangle size={32} className="text-error" />
      </StateIcon>
      <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Something Went Wrong</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-[280px]">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold active:scale-95 transition-transform flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </StateContainer>
  )
}

export function LoadingState() {
  return (
    <div className="absolute inset-0 z-[35] flex items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg mb-3">
          <MapPin size={24} className="text-white animate-bounce" />
        </div>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Finding restrooms...</p>
      </motion.div>
    </div>
  )
}

function StateContainer({ children }) {
  return (
    <div className="fixed inset-0 z-[90] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center px-8 gap-3">
      {children}
    </div>
  )
}

function StateIcon({ children, color }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      className={`w-20 h-20 rounded-full ${color} flex items-center justify-center mb-2`}
    >
      {children}
    </motion.div>
  )
}
