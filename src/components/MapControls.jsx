import { useApp } from '../context/AppContext'
import { Search, SlidersHorizontal, Locate, Plus, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MapControls() {
  const {
    toggleSearch,
    toggleFilters,
    setScreen,
    activeFilters,
    userLocation,
    setUserLocation,
    setLocationPermission,
    isOffline,
    detailOpen,
  } = useApp()

  const hasActiveFilters = activeFilters.openNow || activeFilters.wheelchair ||
    activeFilters.genderNeutral || activeFilters.familyRoom || activeFilters.babyChanging ||
    activeFilters.minRating > 0 || activeFilters.radius !== 1000

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationPermission('granted')
      },
      (err) => {
        setLocationPermission('denied')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <>
      {/* Search bar - floating below top nav */}
      <div className="fixed top-[68px] left-4 right-4 z-[45] safe-top">
        <button
          onClick={toggleSearch}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg shadow-lg text-left transition-shadow hover:shadow-xl active:scale-[0.99]"
          aria-label="Open search"
        >
          <Search size={18} className="text-neutral-400" />
          <span className="flex-1 text-sm text-neutral-400">Search restrooms...</span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFilters() }}
              className={`touch-target p-2 rounded-xl transition-colors ${
                hasActiveFilters
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'
              }`}
              aria-label="Open filters"
            >
              <SlidersHorizontal size={18} />
              {hasActiveFilters && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-500" />
              )}
            </button>
          </div>
        </button>
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div className="fixed top-[128px] left-4 right-4 z-[44] safe-top">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warning/10 border border-warning/20 text-warning">
            <AlertTriangle size={16} />
            <span className="text-xs font-medium">You're offline — showing cached results</span>
          </div>
        </div>
      )}

      {/* FAB cluster - bottom right */}
      <AnimatePresence>
        {!detailOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed bottom-6 right-4 z-[42] safe-bottom flex flex-col gap-3"
          >
            {/* My Location FAB */}
            <button
              onClick={handleLocate}
              className="touch-target w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-lg flex items-center justify-center text-primary-600 dark:text-primary-400 active:scale-95 transition-all hover:shadow-xl"
              aria-label="Center on my location"
            >
              <Locate size={20} />
            </button>

            {/* Add Restroom FAB */}
            <button
              onClick={() => setScreen('add')}
              className="touch-target w-14 h-14 rounded-full bg-primary-600 shadow-lg shadow-primary-600/30 flex items-center justify-center text-white active:scale-95 transition-all hover:shadow-xl hover:bg-primary-700"
              aria-label="Add a new restroom"
            >
              <Plus size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
