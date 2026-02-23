import { useApp } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw } from 'lucide-react'

const radiusOptions = [500, 1000, 2000, 5000]
const ratingOptions = [0, 3, 3.5, 4, 4.5]

export default function FilterSheet() {
  const { filtersOpen, toggleFilters, activeFilters, setFilters, resetFilters } = useApp()

  const hasActiveFilters = activeFilters.openNow || activeFilters.wheelchair ||
    activeFilters.genderNeutral || activeFilters.familyRoom || activeFilters.babyChanging ||
    activeFilters.minRating > 0 || activeFilters.radius !== 1000

  return (
    <AnimatePresence>
      {filtersOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-sm"
            onClick={toggleFilters}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[56] bg-white dark:bg-neutral-900 rounded-t-3xl max-h-[80vh] flex flex-col"
          >
            <div className="sheet-handle" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-2 pb-3">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Filters</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 px-2 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                )}
                <button
                  onClick={toggleFilters}
                  className="touch-target p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} className="text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="px-5 pb-4 space-y-6">
              {/* Distance */}
              <section>
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Distance</h3>
                <div className="flex flex-wrap gap-2">
                  {radiusOptions.map(r => (
                    <button
                      key={r}
                      onClick={() => setFilters({ radius: r })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeFilters.radius === r
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {r < 1000 ? `${r}m` : `${r / 1000}km`}
                    </button>
                  ))}
                </div>
              </section>

              {/* Rating */}
              <section>
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Minimum Rating</h3>
                <div className="flex flex-wrap gap-2">
                  {ratingOptions.map(r => (
                    <button
                      key={r}
                      onClick={() => setFilters({ minRating: r })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeFilters.minRating === r
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </section>

              {/* Toggles */}
              <section>
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Availability & Access</h3>
                <div className="space-y-2">
                  <FilterToggle
                    label="Open Now"
                    description="Show only currently open restrooms"
                    active={activeFilters.openNow}
                    onChange={() => setFilters({ openNow: !activeFilters.openNow })}
                  />
                  <FilterToggle
                    label="Wheelchair Accessible"
                    description="ADA compliant restrooms"
                    active={activeFilters.wheelchair}
                    onChange={() => setFilters({ wheelchair: !activeFilters.wheelchair })}
                    badgeColor="bg-blue-500"
                  />
                  <FilterToggle
                    label="Gender Neutral"
                    description="All-gender restrooms"
                    active={activeFilters.genderNeutral}
                    onChange={() => setFilters({ genderNeutral: !activeFilters.genderNeutral })}
                    badgeColor="bg-purple-500"
                  />
                  <FilterToggle
                    label="Family Room"
                    description="Family-friendly with extra space"
                    active={activeFilters.familyRoom}
                    onChange={() => setFilters({ familyRoom: !activeFilters.familyRoom })}
                    badgeColor="bg-amber-500"
                  />
                  <FilterToggle
                    label="Baby Changing"
                    description="Includes a baby changing station"
                    active={activeFilters.babyChanging}
                    onChange={() => setFilters({ babyChanging: !activeFilters.babyChanging })}
                    badgeColor="bg-pink-500"
                  />
                </div>
              </section>

            </div>
          </div>

          {/* Sticky Apply button footer */}
          <div className="px-5 py-4 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800" style={{ paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 1rem))' }}>
              <button
                onClick={toggleFilters}
                className="w-full py-3.5 rounded-2xl bg-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-transform"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FilterToggle({ label, description, active, onChange, badgeColor }) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
        active
          ? 'bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-200 dark:ring-primary-800'
          : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800'
      }`}
      role="switch"
      aria-checked={active}
    >
      {badgeColor && (
        <div className={`w-3 h-3 rounded-full ${badgeColor} flex-shrink-0`} />
      )}
      <div className="flex-1 text-left">
        <p className={`text-sm font-medium ${active ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300'}`}>
          {label}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>
      </div>
      <div className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${active ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </button>
  )
}
