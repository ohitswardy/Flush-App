import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getReviewsForRestroom, formatDistance } from '../data/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronUp,
  Star,
  Clock,
  MapPin,
  Navigation,
  Flag,
  Heart,
  Share2,
  Accessibility,
  Baby,
  Users,
  Droplets,
  Wind,
  CheckCircle2,
  ChevronRight,
  ThumbsUp,
  Camera,
  ExternalLink,
} from 'lucide-react'

export default function DetailSheet() {
  const { selectedRestroom, detailOpen, detailFull, toggleDetailFull, closeDetail, savedRestrooms, toggleSaved, setScreen } = useApp()

  if (!selectedRestroom) return null

  const reviews = getReviewsForRestroom(selectedRestroom.id)
  const isSaved = savedRestrooms.includes(selectedRestroom.id)

  return (
    <AnimatePresence>
      {detailOpen && (
        <>
          {/* Backdrop for full mode */}
          {detailFull && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[39] bg-black/20"
              onClick={closeDetail}
            />
          )}

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 z-[40] bg-white dark:bg-neutral-900 rounded-t-3xl shadow-sheet transition-all duration-300 ${
              detailFull ? 'top-[148px]' : 'max-h-[45vh]'
            } flex flex-col`}
          >
            {/* Drag handle */}
            <button
              onClick={toggleDetailFull}
              className="w-full pt-2 pb-1 flex flex-col items-center touch-target"
              aria-label={detailFull ? 'Collapse details' : 'Expand details'}
            >
              <div className="sheet-handle" />
              <ChevronUp
                size={16}
                className={`text-neutral-400 mt-1 transition-transform duration-200 ${detailFull ? 'rotate-180' : ''}`}
              />
            </button>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {/* Summary section (always visible) */}
              <div className="px-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-white truncate">
                        {selectedRestroom.name}
                      </h2>
                      {selectedRestroom.verified && (
                        <CheckCircle2 size={16} className="text-primary-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                      {selectedRestroom.address}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-sm font-semibold text-accent-600 dark:text-accent-400">
                        <Star size={14} fill="currentColor" />
                        {selectedRestroom.rating}
                        <span className="text-xs font-normal text-neutral-400">({selectedRestroom.reviewCount})</span>
                      </span>
                      <span className="text-sm text-neutral-500">{formatDistance(selectedRestroom.distance)}</span>
                      {selectedRestroom.isOpen ? (
                        <span className="text-sm font-medium text-success">Open</span>
                      ) : (
                        <span className="text-sm font-medium text-error">Closed</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={closeDetail}
                    className="touch-target p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-2"
                    aria-label="Close details"
                  >
                    <X size={20} className="text-neutral-500" />
                  </button>
                </div>

                {/* Amenity pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedRestroom.amenities.wheelchair && (
                    <AmenityPill icon={<Accessibility size={12} />} label="Wheelchair" color="bg-blue-50 text-info dark:bg-blue-900/30 dark:text-blue-400" />
                  )}
                  {selectedRestroom.amenities.genderNeutral && (
                    <AmenityPill icon={<Users size={12} />} label="Gender Neutral" color="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
                  )}
                  {selectedRestroom.amenities.babyChanging && (
                    <AmenityPill icon={<Baby size={12} />} label="Baby Changing" color="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
                  )}
                  {selectedRestroom.amenities.familyRoom && (
                    <AmenityPill icon={<Users size={12} />} label="Family Room" color="bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" />
                  )}
                  {selectedRestroom.amenities.bidet && (
                    <AmenityPill icon={<Droplets size={12} />} label="Bidet" color="bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" />
                  )}
                  {selectedRestroom.amenities.dryer && (
                    <AmenityPill icon={<Wind size={12} />} label="Hand Dryer" color="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" />
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm shadow-md shadow-primary-600/20 active:scale-[0.98] transition-transform">
                    <Navigation size={16} />
                    Directions
                  </button>
                  <button
                    onClick={() => toggleSaved(selectedRestroom.id)}
                    className={`touch-target p-3 rounded-xl transition-all active:scale-95 ${
                      isSaved
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}
                    aria-label={isSaved ? 'Remove from saved' : 'Save restroom'}
                  >
                    <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                  <button className="touch-target p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 active:scale-95 transition-transform" aria-label="Share">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {detailFull && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Photos */}
                  {selectedRestroom.photos.length > 0 && (
                    <div className="px-5 mb-4">
                      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                        {selectedRestroom.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`${selectedRestroom.name} photo ${i + 1}`}
                            className="w-48 h-32 rounded-xl object-cover flex-shrink-0"
                            loading="lazy"
                          />
                        ))}
                        <button className="w-24 h-32 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center gap-1 flex-shrink-0 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                          <Camera size={20} />
                          <span className="text-xs">Add</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-neutral-400" />
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">Hours</span>
                      <span className="text-neutral-500 dark:text-neutral-400">{selectedRestroom.openHours}</span>
                    </div>
                  </div>

                  {/* Last verified */}
                  <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-primary-500" />
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">Last verified</span>
                      <span className="text-neutral-500 dark:text-neutral-400">{selectedRestroom.lastVerified}</span>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="px-5 py-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Reviews ({selectedRestroom.reviewCount})
                      </h3>
                      <button className="text-xs text-primary-600 dark:text-primary-400 font-medium flex items-center gap-0.5">
                        See all <ChevronRight size={12} />
                      </button>
                    </div>

                    {reviews.length > 0 ? (
                      <div className="space-y-3">
                        {reviews.slice(0, 3).map(review => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-400 text-center py-4">No reviews yet. Be the first!</p>
                    )}

                    <button className="w-full mt-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      Write a Review
                    </button>
                  </div>

                  {/* Report / Actions */}
                  <div className="px-5 py-4 border-t border-neutral-100 dark:border-neutral-800 safe-bottom">
                    <button
                      onClick={() => setScreen('report')}
                      className="flex items-center gap-2 w-full py-2.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-error transition-colors"
                    >
                      <Flag size={16} />
                      Report an issue with this restroom
                    </button>
                  </div>
                </motion.div>
              )}

              {/* "More" prompt when collapsed */}
              {!detailFull && (
                <div className="px-5 pb-4 safe-bottom">
                  <button
                    onClick={toggleDetailFull}
                    className="w-full flex items-center justify-center gap-1 py-2 text-sm text-primary-600 dark:text-primary-400 font-medium"
                  >
                    More details
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function AmenityPill({ icon, label, color }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${color}`}>
      {icon}
      {label}
    </span>
  )
}

function ReviewCard({ review }) {
  return (
    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
            {review.user[0]}
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">{review.user}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={i < review.rating ? 'text-accent-400' : 'text-neutral-300 dark:text-neutral-600'} fill={i < review.rating ? 'currentColor' : 'none'} />
              ))}
            </div>
          </div>
        </div>
        <span className="text-[10px] text-neutral-400">{review.date}</span>
      </div>
      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">{review.text}</p>
      <button className="flex items-center gap-1 mt-2 text-[10px] text-neutral-400 hover:text-primary-500 transition-colors">
        <ThumbsUp size={10} />
        Helpful ({review.helpful})
      </button>
    </div>
  )
}
