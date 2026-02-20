import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  FileText,
  Scale,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Ban,
  ScrollText,
  Handshake,
  Globe,
} from 'lucide-react'

const sections = [
  {
    icon: UserCheck,
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By downloading, installing, or using Banyo ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.',
      'We may update these Terms from time to time. Continued use of the App after changes constitute acceptance of the updated Terms. We will notify you of significant changes through the App or email.',
    ],
  },
  {
    icon: Globe,
    title: '2. Description of Service',
    paragraphs: [
      'Banyo is a community-driven platform that helps users find, rate, and review public restrooms. The App provides location-based search, user reviews, accessibility information, and community reporting features.',
      'The service is provided "as is" and relies on user-submitted data. While we strive for accuracy, we cannot guarantee that all restroom information (availability, hours, amenities, cleanliness) is current or correct at any given time.',
    ],
  },
  {
    icon: ShieldCheck,
    title: '3. User Accounts',
    paragraphs: [
      'You may browse Banyo without an account. To contribute content (reviews, restroom submissions, reports), you must create an account with a valid email address.',
      'You are responsible for maintaining the security of your account credentials. You agree to provide accurate information and to update it as necessary. One person may not maintain multiple accounts.',
      'We reserve the right to suspend or terminate accounts that violate these Terms.',
    ],
  },
  {
    icon: ScrollText,
    title: '4. User-Generated Content',
    paragraphs: [
      'By submitting content (reviews, photos, restroom listings, reports), you grant Banyo a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute that content within the App and related marketing materials.',
      'You retain ownership of your content and may request its removal at any time. Upon deletion, we will remove the content within 30 days, though cached or archived versions may persist briefly.',
      'You represent that you have the right to submit any content you provide, and that it does not infringe on any third party\'s intellectual property or privacy rights.',
    ],
  },
  {
    icon: Ban,
    title: '5. Prohibited Conduct',
    paragraphs: [
      'You agree not to:',
    ],
    list: [
      'Submit false, misleading, or spam content',
      'Post offensive, discriminatory, or harassing reviews or comments',
      'Upload inappropriate, explicit, or illegal photos',
      'Attempt to manipulate ratings or reviews',
      'Use the App for any illegal purpose',
      'Scrape, crawl, or collect data from the App without permission',
      'Interfere with the App\'s operation or other users\' experience',
      'Impersonate another person or entity',
      'Create restroom listings for non-existent locations',
    ],
  },
  {
    icon: Scale,
    title: '6. Content Moderation',
    paragraphs: [
      'Banyo employs community moderation and automated systems to review user-submitted content. We reserve the right to remove, edit, or refuse any content that violates these Terms or our Community Guidelines.',
      'New restroom submissions go through a verification process before appearing on the map. This may involve community verification or staff review.',
      'If your content is removed or your account is actioned, you may appeal through the Help & Support section.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '7. Disclaimers & Limitations',
    paragraphs: [
      'RESTROOM INFORMATION: Banyo aggregates community-provided data. We do not independently verify every listing. Restroom availability, hours, cleanliness, and amenities may change without notice. Always verify critical accessibility features in person.',
      'NAVIGATION: Directions provided through the App are for convenience only. Banyo is not responsible for inaccurate directions or routing. Always exercise caution when navigating.',
      'LIABILITY: To the maximum extent permitted by law, Banyo and its team shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App.',
    ],
  },
  {
    icon: Handshake,
    title: '8. Community Guidelines',
    paragraphs: [
      'Banyo thrives on community trust. We expect all users to:',
    ],
    list: [
      'Be honest and constructive in reviews',
      'Submit accurate restroom information',
      'Respect other users and restroom facilities',
      'Report genuine issues to help maintain quality',
      'Respond respectfully to feedback on your submissions',
    ],
  },
]

export default function TermsScreen() {
  const { setScreen } = useApp()

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
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">Terms of Service</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <FileText size={22} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Terms of Service</h2>
              <p className="text-xs text-neutral-400">Effective: February 20, 2026</p>
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Please read these terms carefully before using Banyo. They outline your rights, responsibilities, and the rules that govern your use of our restroom-finder platform.
          </p>
        </div>

        {/* Sections */}
        <div className="px-5 pb-8 space-y-5">
          {sections.map((section, i) => (
            <div key={i} className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <section.icon size={18} className="text-primary-600 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{section.title}</h3>
              </div>
              <div className="space-y-2.5 pl-[26px]">
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{p}</p>
                ))}
                {section.list && (
                  <ul className="space-y-1.5 mt-1">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Questions about these Terms?</p>
            <p className="text-xs text-primary-600/70 dark:text-primary-400/70 leading-relaxed">
              If you have questions about these Terms of Service, contact us through the Send Feedback option or email legal@banyo.app. We're happy to clarify anything.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
