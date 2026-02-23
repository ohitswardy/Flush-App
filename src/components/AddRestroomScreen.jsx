import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Camera,
  MapPin,
  Star,
  Accessibility,
  Users,
  Baby,
  Droplets,
  Wind,
  Upload,
  CheckCircle2,
  Loader2,
  X,
  Image,
} from 'lucide-react'

export default function AddRestroomScreen() {
  const { setScreen } = useApp()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
    wheelchair: false,
    genderNeutral: false,
    babyChanging: false,
    familyRoom: false,
    bidet: false,
    soap: true,
    dryer: false,
    notes: '',
    photos: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const types = [
    { value: 'mall', label: 'Mall / Shopping Center' },
    { value: 'restaurant', label: 'Restaurant / Café' },
    { value: 'public', label: 'Public Facility' },
    { value: 'government', label: 'Government Building' },
    { value: 'gas_station', label: 'Gas Station' },
    { value: 'hotel', label: 'Hotel / Resort' },
    { value: 'other', label: 'Other' },
  ]

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[90] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center px-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={40} className="text-success" />
        </motion.div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Thank You!</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-8">
          Your submission is being reviewed. It'll appear on the map once verified by our community.
        </p>
        <button
          onClick={() => setScreen('home')}
          className="w-full max-w-xs py-3.5 rounded-2xl bg-primary-600 text-white font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Back to Map
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 z-[90] bg-white dark:bg-neutral-950 flex flex-col"
    >
      {/* Header */}
      <div className="safe-top flex items-center gap-3 px-4 pt-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : setScreen('home')}
          className="touch-target p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-neutral-700 dark:text-neutral-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-neutral-900 dark:text-white">Add a Restroom</h1>
          <p className="text-xs text-neutral-400">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 pt-3">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                Restroom Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., SM City Cebu - 2F Restroom"
                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address or landmark"
                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30"
              />
              <button className="flex items-center gap-1 mt-2 text-xs text-primary-600 dark:text-primary-400">
                <MapPin size={12} />
                Use current location
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                Type of Location *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {types.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setFormData({ ...formData, type: t.value })}
                    className={`px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                      formData.type === t.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 ring-1 ring-primary-200 dark:ring-primary-800'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Amenities & Accessibility</h3>
            <div className="space-y-2">
              <AmenityToggle
                icon={<Accessibility size={18} />}
                label="Wheelchair Accessible"
                active={formData.wheelchair}
                onChange={() => setFormData({ ...formData, wheelchair: !formData.wheelchair })}
              />
              <AmenityToggle
                icon={<Users size={18} />}
                label="Gender Neutral"
                active={formData.genderNeutral}
                onChange={() => setFormData({ ...formData, genderNeutral: !formData.genderNeutral })}
              />
              <AmenityToggle
                icon={<Baby size={18} />}
                label="Baby Changing Station"
                active={formData.babyChanging}
                onChange={() => setFormData({ ...formData, babyChanging: !formData.babyChanging })}
              />
              <AmenityToggle
                icon={<Users size={18} />}
                label="Family Room"
                active={formData.familyRoom}
                onChange={() => setFormData({ ...formData, familyRoom: !formData.familyRoom })}
              />
              <AmenityToggle
                icon={<Droplets size={18} />}
                label="Bidet / Water Spray"
                active={formData.bidet}
                onChange={() => setFormData({ ...formData, bidet: !formData.bidet })}
              />
              <AmenityToggle
                icon={<Wind size={18} />}
                label="Hand Dryer"
                active={formData.dryer}
                onChange={() => setFormData({ ...formData, dryer: !formData.dryer })}
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any helpful info (floor number, near which store, etc.)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Add Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                <button className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                  <Camera size={24} />
                  <span className="text-[10px]">Camera</span>
                </button>
                <button className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                  <Image size={24} />
                  <span className="text-[10px]">Gallery</span>
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-2">Photos help others find and verify this restroom</p>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Your Rating</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} className="touch-target">
                    <Star
                      size={28}
                      className={`${n <= 4 ? 'text-accent-400' : 'text-neutral-300 dark:text-neutral-600'} transition-colors`}
                      fill={n <= 4 ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 space-y-2">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Summary</h3>
              <p className="text-xs text-neutral-500"><span className="font-medium text-neutral-700 dark:text-neutral-300">Name:</span> {formData.name || '—'}</p>
              <p className="text-xs text-neutral-500"><span className="font-medium text-neutral-700 dark:text-neutral-300">Address:</span> {formData.address || '—'}</p>
              <p className="text-xs text-neutral-500"><span className="font-medium text-neutral-700 dark:text-neutral-300">Type:</span> {formData.type || '—'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-5 py-4 border-t border-neutral-100 dark:border-neutral-800" style={{ paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 1rem))' }}>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && (!formData.name || !formData.address || !formData.type)}
            className="w-full py-3.5 rounded-2xl bg-primary-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-primary-600 text-white font-semibold text-sm disabled:opacity-70 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload size={16} />
                Submit for Review
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}

function AmenityToggle({ icon, label, active, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-3 w-full p-3.5 rounded-xl transition-all ${
        active
          ? 'bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-200 dark:ring-primary-800'
          : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800'
      }`}
      role="switch"
      aria-checked={active}
    >
      <span className={active ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'}>{icon}</span>
      <span className={`flex-1 text-sm font-medium text-left ${active ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
        {label}
      </span>
      <div className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${active ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </button>
  )
}
