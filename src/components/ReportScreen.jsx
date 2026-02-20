import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  AlertTriangle,
  Droplets,
  Wrench,
  ShieldAlert,
  Lock,
  Trash2,
  Camera,
  Loader2,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react'

const issueTypes = [
  { value: 'cleanliness', label: 'Cleanliness Issue', icon: Droplets, color: 'text-amber-500' },
  { value: 'broken', label: 'Broken / Out of Order', icon: Wrench, color: 'text-error' },
  { value: 'safety', label: 'Safety Concern', icon: ShieldAlert, color: 'text-red-600' },
  { value: 'locked', label: 'Permanently Locked', icon: Lock, color: 'text-neutral-500' },
  { value: 'no_soap', label: 'No Soap / Supplies', icon: Trash2, color: 'text-orange-500' },
  { value: 'other', label: 'Other Issue', icon: AlertTriangle, color: 'text-neutral-500' },
]

export default function ReportScreen() {
  const { setScreen, selectedRestroom } = useApp()
  const [selectedIssue, setSelectedIssue] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selectedIssue) return
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
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Report Submitted</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-8">
          Thank you for helping keep our community informed. We'll review your report shortly.
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
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">Report an Issue</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Restroom info */}
        {selectedRestroom && (
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 mb-5">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{selectedRestroom.name}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{selectedRestroom.address}</p>
          </div>
        )}

        {/* Issue types */}
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">What's the issue?</h3>
        <div className="space-y-2 mb-5">
          {issueTypes.map(issue => (
            <button
              key={issue.value}
              onClick={() => setSelectedIssue(issue.value)}
              className={`flex items-center gap-3 w-full p-3.5 rounded-xl transition-all ${
                selectedIssue === issue.value
                  ? 'bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-200 dark:ring-primary-800'
                  : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <issue.icon size={20} className={selectedIssue === issue.value ? 'text-primary-600 dark:text-primary-400' : issue.color} />
              <span className={`text-sm font-medium ${
                selectedIssue === issue.value ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400'
              }`}>
                {issue.label}
              </span>
            </button>
          ))}
        </div>

        {/* Details */}
        <div className="mb-5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Additional Details (optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe the issue in more detail..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
          />
        </div>

        {/* Photo */}
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors w-full">
          <Camera size={18} />
          Attach a photo (optional)
        </button>
      </div>

      {/* Submit */}
      <div className="px-5 pb-6 pt-3 safe-bottom border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={handleSubmit}
          disabled={!selectedIssue || submitting}
          className="w-full py-3.5 rounded-2xl bg-error text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <AlertTriangle size={16} />
              Submit Report
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
