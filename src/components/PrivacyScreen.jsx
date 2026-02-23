import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Shield,
  MapPin,
  Eye,
  Database,
  Share2,
  Lock,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'

const sections = [
  {
    id: 'collection',
    icon: Database,
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Location Data',
        text: 'When you grant location permission, Flush accesses your device\'s GPS to show nearby restrooms. We only use your location while the app is active — we never track your location in the background. Your precise location is never stored on our servers; we only process approximate area data to return relevant results.',
      },
      {
        subtitle: 'Account Information',
        text: 'If you create an account, we collect your email address and display name. This is used solely for authentication and to display your contributions (reviews, added restrooms, reports).',
      },
      {
        subtitle: 'Usage Data',
        text: 'We collect anonymized usage analytics such as search queries (without personal identifiers), feature usage frequency, and app performance metrics. This helps us improve the app experience.',
      },
      {
        subtitle: 'User-Generated Content',
        text: 'Reviews, restroom submissions, photos, and reports you submit are stored to provide the community service. Your display name is shown alongside your contributions.',
      },
    ],
  },
  {
    id: 'usage',
    icon: Eye,
    title: 'How We Use Your Data',
    content: [
      {
        subtitle: 'Core Functionality',
        text: 'Your location is used exclusively to find and display nearby restrooms. Search queries are used to return relevant results. Saved restrooms are stored locally on your device and optionally synced to your account.',
      },
      {
        subtitle: 'Improving the Service',
        text: 'Anonymized and aggregated data helps us understand which features are most useful, identify areas needing more restroom coverage, and improve search relevance.',
      },
      {
        subtitle: 'Communication',
        text: 'If you opt in to notifications, we may send updates about restrooms you\'ve saved, responses to your reports, or important service announcements. You can disable notifications at any time in Settings.',
      },
    ],
  },
  {
    id: 'sharing',
    icon: Share2,
    title: 'Data Sharing',
    content: [
      {
        subtitle: 'We Do Not Sell Your Data',
        text: 'Flush does not sell, trade, or rent your personal information to third parties. Period.',
      },
      {
        subtitle: 'Public Contributions',
        text: 'Reviews, ratings, and restroom submissions are visible to all users as part of the community service. Your display name (not email) is shown with your contributions.',
      },
      {
        subtitle: 'Service Providers',
        text: 'We use third-party services for map tiles (OpenStreetMap/CARTO), hosting, and analytics. These providers receive only the minimum data necessary to provide their services and are bound by their own privacy policies.',
      },
    ],
  },
  {
    id: 'location',
    icon: MapPin,
    title: 'Location Privacy',
    content: [
      {
        subtitle: 'Your Control',
        text: 'Location access is entirely optional. You can use Flush by searching manually without granting location permission. You can revoke location access at any time through your device settings or within the app.',
      },
      {
        subtitle: 'What We Access',
        text: 'We only access your location when the app is in the foreground and you have granted permission. We never access your location in the background. Your exact GPS coordinates are not stored on our servers.',
      },
      {
        subtitle: 'Precision',
        text: 'For nearby restroom searches, we round your coordinates to an approximate area (~100m radius) before processing. This ensures we can find nearby results without storing your exact position.',
      },
    ],
  },
  {
    id: 'security',
    icon: Lock,
    title: 'Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data transmitted between your device and our servers is encrypted using TLS 1.3. Account passwords are hashed using bcrypt and never stored in plain text.',
      },
      {
        subtitle: 'Local Storage',
        text: 'Saved restrooms, recent searches, and preferences are stored locally on your device. This data is not accessible to other apps and is removed when you clear the app data or uninstall.',
      },
      {
        subtitle: 'Access Controls',
        text: 'Our team follows the principle of least privilege. Only authorized personnel have access to production systems, and all access is logged and audited.',
      },
    ],
  },
  {
    id: 'rights',
    icon: Shield,
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Export',
        text: 'You can request a copy of all personal data we hold about you. Contact us through the app\'s feedback feature or email us directly.',
      },
      {
        subtitle: 'Deletion',
        text: 'You can delete your account and all associated data at any time. This removes your reviews, submissions, and any personal information from our systems within 30 days.',
      },
      {
        subtitle: 'Correction',
        text: 'You can update your account information at any time through the Settings screen. If you notice inaccurate data, contact us and we\'ll correct it promptly.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You can opt out of analytics collection, notifications, and location sharing independently through the Settings screen.',
      },
    ],
  },
  {
    id: 'deletion',
    icon: Trash2,
    title: 'Data Deletion',
    content: [
      {
        subtitle: 'Deleting Your Account',
        text: 'Navigate to Settings > Account > Delete Account. This permanently removes your profile, reviews, and all personal data. Restroom submissions you\'ve added will remain but be anonymized.',
      },
      {
        subtitle: 'Clearing Local Data',
        text: 'You can clear locally cached data (offline maps, search history, preferences) from Settings > Data & Storage > Clear Cache. This does not affect your account or server-side data.',
      },
    ],
  },
]

export default function PrivacyScreen() {
  const { setScreen } = useApp()
  const [expandedSection, setExpandedSection] = useState('collection')

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id)
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
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">Privacy Policy</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Shield size={22} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Your Privacy Matters</h2>
              <p className="text-xs text-neutral-400">Last updated: February 20, 2026</p>
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Flush is committed to protecting your privacy. We collect only the minimum data needed to help you find restrooms. Here's exactly what we collect, how we use it, and how you stay in control.
          </p>
        </div>

        {/* Accordion sections */}
        <div className="px-5 pb-8 space-y-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center gap-3 w-full p-4 text-left"
                aria-expanded={expandedSection === section.id}
              >
                <section.icon
                  size={18}
                  className={expandedSection === section.id ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400'}
                />
                <span className={`flex-1 text-sm font-semibold ${
                  expandedSection === section.id ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-900 dark:text-white'
                }`}>
                  {section.title}
                </span>
                {expandedSection === section.id ? (
                  <ChevronUp size={16} className="text-primary-500" />
                ) : (
                  <ChevronDown size={16} className="text-neutral-400" />
                )}
              </button>

              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4"
                >
                  <div className="space-y-4 pl-[30px]">
                    {section.content.map((item, i) => (
                      <div key={i}>
                        <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">{item.subtitle}</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {/* Contact */}
          <div className="mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Questions about your privacy?</p>
            <p className="text-xs text-primary-600/70 dark:text-primary-400/70 leading-relaxed">
              If you have questions, concerns, or requests regarding your data, please reach out through the Send Feedback option in the menu or email privacy@flush.app.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
