import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Plus,
  Flag,
  Shield,
  Smartphone,
  MessageSquare,
  ExternalLink,
  Mail,
  BookOpen,
} from 'lucide-react'

const faqItems = [
  {
    id: 'find',
    icon: MapPin,
    question: 'How do I find a restroom near me?',
    answer: 'Make sure location access is enabled. The map will automatically center on your location and show nearby restrooms as pins. You can also use the search bar at the top to search by name, address, or location type. Tap any pin to see details, or use the filter button to narrow results by distance, rating, or accessibility features.',
  },
  {
    id: 'add',
    icon: Plus,
    question: 'How do I add a new restroom?',
    answer: 'Tap the "+" button at the bottom-right corner of the map. You\'ll be guided through a 3-step form: enter the restroom name and address, select its amenities, and optionally add photos. After submission, our community will verify the listing before it appears on the map.',
  },
  {
    id: 'rate',
    icon: Star,
    question: 'How do ratings and reviews work?',
    answer: 'Tap on any restroom pin, then expand the detail sheet and scroll to the Reviews section. You can write a review with a 1–5 star rating. Ratings are averaged across all reviews. You can also mark existing reviews as "helpful" to surface the most useful information for others.',
  },
  {
    id: 'report',
    icon: Flag,
    question: 'How do I report a problem with a restroom?',
    answer: 'Open the restroom detail by tapping its pin, expand the detail sheet, and tap "Report an issue" at the bottom. Select the type of issue (cleanliness, broken, safety concern, no supplies, etc.), add optional details and a photo, then submit. Our moderation team reviews reports and updates listings accordingly.',
  },
  {
    id: 'accessible',
    icon: Shield,
    question: 'How are accessible restrooms identified?',
    answer: 'Accessible restrooms are marked with distinct colors and icons on the map: blue pins for wheelchair-accessible, purple for gender-neutral, and amber for family rooms. Each restroom detail page lists all available amenities with clear icons and labels. You can also use the Filter feature to show only restrooms with specific accessibility features.',
  },
  {
    id: 'offline',
    icon: Smartphone,
    question: 'Can I use Flush offline?',
    answer: 'Flush caches restroom data you\'ve previously viewed. When you lose internet connectivity, you\'ll see a yellow banner indicating offline mode, and the app will display cached restrooms in your area. Some features like submitting reviews or reports require an internet connection. Clear your cache in Settings > Data & Storage if you want to free up space.',
  },
  {
    id: 'location',
    icon: MapPin,
    question: "Why does Flush need my location?",
    answer: 'Location access allows us to show restrooms near your current position and calculate distances. We only access your location while the app is in the foreground — never in the background. Location permission is optional; you can search manually by entering an address or place name. You can toggle location sharing in Settings at any time.',
  },
  {
    id: 'account',
    icon: Shield,
    question: 'Do I need an account to use Flush?',
    answer: 'No — you can browse the map, search for restrooms, and view details without signing in. An account is only required to save restrooms, write reviews, add new restrooms, and submit reports. Your saved restrooms and search history are stored locally on your device even without an account.',
  },
]

export default function HelpSupportScreen() {
  const { setScreen } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const filteredFaqs = searchQuery.trim()
    ? faqItems.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
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
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">Help & Support</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="px-5 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <HelpCircle size={22} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">How can we help?</h2>
              <p className="text-xs text-neutral-400">Search FAQs or contact us directly</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-shadow"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setScreen('feedback')}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 active:scale-[0.98] transition-transform"
            >
              <MessageSquare size={18} />
              <span className="text-sm font-medium">Send Feedback</span>
            </button>
            <a
              href="mailto:support@flush.app"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 active:scale-[0.98] transition-transform"
            >
              <Mail size={18} />
              <span className="text-sm font-medium">Email Us</span>
            </a>
          </div>
        </div>

        {/* FAQs */}
        <div className="px-5 pb-8">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Frequently Asked Questions
          </h3>

          {filteredFaqs.length > 0 ? (
            <div className="space-y-2">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex items-center gap-3 w-full p-3.5 text-left"
                    aria-expanded={expandedFaq === faq.id}
                  >
                    <faq.icon
                      size={16}
                      className={expandedFaq === faq.id ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'}
                    />
                    <span className={`flex-1 text-sm font-medium ${
                      expandedFaq === faq.id ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-900 dark:text-white'
                    }`}>
                      {faq.question}
                    </span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp size={16} className="text-primary-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-neutral-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="px-3.5 pb-3.5"
                    >
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pl-[28px]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                <Search size={22} className="text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No matching topics</p>
              <p className="text-xs text-neutral-400 mt-1">Try a different search or contact us directly</p>
            </div>
          )}

          {/* Still need help */}
          <div className="mt-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Still need help?</p>
            <p className="text-xs text-primary-600/70 dark:text-primary-400/70 leading-relaxed mb-3">
              Our support team typically responds within 24 hours. You can also send feedback directly from the app.
            </p>
            <button
              onClick={() => setScreen('feedback')}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold active:scale-[0.98] transition-transform"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
