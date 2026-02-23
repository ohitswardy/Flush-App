import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MessageSquare,
  Star,
  Bug,
  Lightbulb,
  Heart,
  Camera,
  Loader2,
  CheckCircle2,
  Send,
} from 'lucide-react'

const feedbackTypes = [
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-error bg-red-50 dark:bg-red-900/20' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-accent-500 bg-accent-50 dark:bg-accent-900/20' },
  { value: 'improvement', label: 'Improvement', icon: Star, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
  { value: 'appreciation', label: 'Appreciation', icon: Heart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
]

export default function FeedbackScreen() {
  const { setScreen } = useApp()
  const [selectedType, setSelectedType] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selectedType || !message.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1500)
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
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-[280px] mb-8">
          Your feedback helps us make Flush better for everyone. We'll review it shortly and get back to you if needed.
        </p>
        <button
          onClick={() => setScreen('home')}
          className="w-full max-w-[320px] py-3.5 rounded-2xl bg-primary-600 text-white font-semibold text-sm active:scale-[0.98] transition-transform"
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
          onClick={() => setScreen('home')}
          className="touch-target p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-neutral-700 dark:text-neutral-300" />
        </button>
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">Send Feedback</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Intro */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <MessageSquare size={22} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">We'd love to hear from you</h2>
            <p className="text-xs text-neutral-400">Your input shapes how Flush evolves</p>
          </div>
        </div>

        {/* Feedback type */}
        <div className="mb-5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2.5 block">
            What type of feedback is this? *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {feedbackTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium transition-all ${
                  selectedType === type.value
                    ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : `${type.color} active:scale-[0.98]`
                }`}
              >
                <type.icon size={18} />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overall rating */}
        <div className="mb-5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2.5 block">
            How would you rate Flush overall?
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className="touch-target p-1"
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
              >
                <Star
                  size={28}
                  className={`transition-colors ${n <= rating ? 'text-accent-400' : 'text-neutral-300 dark:text-neutral-600'}`}
                  fill={n <= rating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-xs text-neutral-400 self-center ml-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Great'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="mb-5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Your Message *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              selectedType === 'bug'
                ? 'Describe what happened, what you expected, and steps to reproduce...'
                : selectedType === 'feature'
                ? 'Describe the feature you would like to see and how it would help...'
                : 'Share your thoughts with us...'
            }
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30 resize-none transition-shadow"
          />
          <p className="text-[11px] text-neutral-400 mt-1 text-right">{message.length}/500</p>
        </div>

        {/* Screenshot */}
        <div className="mb-5">
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors w-full">
            <Camera size={18} />
            Attach a screenshot (optional)
          </button>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com — so we can follow up"
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-shadow"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 pb-6 pt-3 safe-bottom border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={handleSubmit}
          disabled={!selectedType || !message.trim() || submitting}
          className="w-full py-3.5 rounded-2xl bg-primary-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Feedback
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
