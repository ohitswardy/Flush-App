import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { mockRestrooms, searchSuggestions, formatDistance } from '../data/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Clock,
  MapPin,
  Star,
  Accessibility,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react'

export default function SearchOverlay() {
  const { searchOpen, toggleSearch, searchQuery, setSearchQuery, addRecentSearch, recentSearches, selectRestroom } = useApp()
  const inputRef = useRef(null)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }
    const q = searchQuery.toLowerCase()
    const filtered = mockRestrooms.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      (q.includes('accessible') && r.amenities.wheelchair) ||
      (q.includes('gender') && r.amenities.genderNeutral) ||
      (q.includes('baby') && r.amenities.babyChanging) ||
      (q.includes('family') && r.amenities.familyRoom)
    )
    setResults(filtered)
  }, [searchQuery])

  const handleSelect = (restroom) => {
    addRecentSearch(restroom.name)
    selectRestroom(restroom)
    toggleSearch()
  }

  const handleSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    addRecentSearch(suggestion)
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[80] bg-white dark:bg-neutral-950 flex flex-col"
        >
          {/* Search header */}
          <div className="px-4 pb-2" style={{ paddingTop: 'max(2rem, calc(env(safe-area-inset-top) + 1rem))' }}>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSearch}
                className="touch-target p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close search"
              >
                <ArrowLeft size={22} className="text-neutral-700 dark:text-neutral-300" />
              </button>
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restrooms, places..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-shadow"
                  aria-label="Search restrooms"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 touch-target p-1"
                    aria-label="Clear search"
                  >
                    <X size={16} className="text-neutral-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-8">
            {/* Results */}
            {results.length > 0 ? (
              <div className="mt-2">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
                {results.map(r => (
                  <SearchResultItem key={r.id} restroom={r} onSelect={handleSelect} />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              // No results
              <div className="flex flex-col items-center justify-center pt-20 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <Search size={24} className="text-neutral-400" />
                </div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No results found</p>
                <p className="text-xs text-neutral-400 mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Recent</p>
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(term)}
                        className="flex items-center gap-3 w-full py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg px-2 transition-colors"
                      >
                        <Clock size={16} className="text-neutral-400" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{term}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s)}
                        className="px-3 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick filters */}
                <div className="mt-6">
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Quick Filters</p>
                  <div className="grid grid-cols-2 gap-2">
                    <QuickFilterCard icon={<TrendingUp size={18} />} label="Top Rated" color="text-accent-500 bg-accent-50 dark:bg-accent-900/20" onClick={() => handleSuggestion('Top rated')} />
                    <QuickFilterCard icon={<Accessibility size={18} />} label="Accessible" color="text-info bg-blue-50 dark:bg-blue-900/20" onClick={() => handleSuggestion('Wheelchair accessible')} />
                    <QuickFilterCard icon={<MapPin size={18} />} label="Nearest" color="text-primary-600 bg-primary-50 dark:bg-primary-900/20" onClick={() => handleSuggestion('Near me')} />
                    <QuickFilterCard icon={<Star size={18} />} label="Open Now" color="text-success bg-green-50 dark:bg-green-900/20" onClick={() => handleSuggestion('Open now')} />
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SearchResultItem({ restroom, onSelect }) {
  const amenityBadges = []
  if (restroom.amenities.wheelchair) amenityBadges.push({ label: 'Accessible', color: 'bg-blue-100 text-info dark:bg-blue-900/30 dark:text-blue-400' })
  if (restroom.amenities.genderNeutral) amenityBadges.push({ label: 'Gender Neutral', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' })
  if (restroom.amenities.babyChanging) amenityBadges.push({ label: 'Baby', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' })

  return (
    <button
      onClick={() => onSelect(restroom)}
      className="flex items-start gap-3 w-full py-3 px-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-colors"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 overflow-hidden">
        {restroom.photos[0] ? (
          <img src={restroom.photos[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin size={20} className="text-neutral-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{restroom.name}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{restroom.address}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="flex items-center gap-0.5 text-xs font-medium text-accent-600 dark:text-accent-400">
            <Star size={12} fill="currentColor" />
            {restroom.rating}
          </span>
          <span className="text-xs text-neutral-400">·</span>
          <span className="text-xs text-neutral-500">{formatDistance(restroom.distance)}</span>
          {restroom.isOpen ? (
            <span className="text-xs text-success font-medium">Open</span>
          ) : (
            <span className="text-xs text-error font-medium">Closed</span>
          )}
          {amenityBadges.slice(0, 2).map((b, i) => (
            <span key={i} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${b.color}`}>{b.label}</span>
          ))}
        </div>
      </div>
    </button>
  )
}

function QuickFilterCard({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-3 rounded-xl ${color} transition-all active:scale-95`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
