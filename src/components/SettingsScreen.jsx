import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Bell,
  MapPin,
  Database,
  Trash2,
  Globe,
  ChevronRight,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Smartphone,
  Info,
  Shield,
  LogOut,
} from 'lucide-react'

export default function SettingsScreen() {
  const { setScreen, darkMode, toggleDarkMode, user, locationPermission } = useApp()
  const [notifications, setNotifications] = useState(true)
  const [locationSharing, setLocationSharing] = useState(locationPermission === 'granted')
  const [cacheDialogOpen, setCacheDialogOpen] = useState(false)

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
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Account section */}
        <section className="px-5 pt-5 pb-2">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Account</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <User size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {user?.email || 'Sign in to sync your data across devices'}
                </p>
              </div>
              <ChevronRight size={16} className="text-neutral-400" />
            </div>
          </div>
        </section>

        {/* Preferences section */}
        <section className="px-5 pt-5 pb-2">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Preferences</h2>
          <div className="space-y-2">
            <SettingsToggle
              icon={darkMode ? <Sun size={18} /> : <Moon size={18} />}
              label="Dark Mode"
              description="Switch between light and dark themes"
              active={darkMode}
              onChange={toggleDarkMode}
            />
            <SettingsToggle
              icon={<Bell size={18} />}
              label="Notifications"
              description="Get alerts for new restrooms and reviews nearby"
              active={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <SettingsNavItem
              icon={<Globe size={18} />}
              label="Language"
              value="English"
            />
            <SettingsNavItem
              icon={<Smartphone size={18} />}
              label="Map Provider"
              value="OpenStreetMap"
            />
          </div>
        </section>

        {/* Privacy & Location section */}
        <section className="px-5 pt-5 pb-2">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Privacy & Location</h2>
          <div className="space-y-2">
            <SettingsToggle
              icon={<MapPin size={18} />}
              label="Location Sharing"
              description="Allow Banyo to access your location for nearby results"
              active={locationSharing}
              onChange={() => setLocationSharing(!locationSharing)}
            />
            <SettingsNavItem
              icon={<Eye size={18} />}
              label="Profile Visibility"
              value="Public"
            />
            <button
              onClick={() => setScreen('privacy')}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="text-neutral-500 dark:text-neutral-400"><Shield size={18} /></span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Privacy Policy</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Read our full privacy policy</p>
              </div>
              <ChevronRight size={16} className="text-neutral-400" />
            </button>
          </div>
        </section>

        {/* Data section */}
        <section className="px-5 pt-5 pb-2">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Data & Storage</h2>
          <div className="space-y-2">
            <SettingsNavItem
              icon={<Database size={18} />}
              label="Cache & Offline Data"
              value="12.4 MB"
            />
            <button
              onClick={() => setCacheDialogOpen(true)}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
            >
              <span className="text-neutral-500 group-hover:text-error transition-colors"><Trash2 size={18} /></span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-error transition-colors">Clear Cache</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Remove locally stored data and saved maps</p>
              </div>
            </button>
          </div>
        </section>

        {/* About section */}
        <section className="px-5 pt-5 pb-8">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">About</h2>
          <div className="space-y-2">
            <SettingsNavItem
              icon={<Info size={18} />}
              label="About Banyo"
              value="v1.0.0"
            />
            <button
              onClick={() => setScreen('terms')}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="text-neutral-500 dark:text-neutral-400"><Globe size={18} /></span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Terms of Service</p>
              </div>
              <ChevronRight size={16} className="text-neutral-400" />
            </button>
            <button
              onClick={() => setScreen('help')}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="text-neutral-500 dark:text-neutral-400"><Info size={18} /></span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Help & Support</p>
              </div>
              <ChevronRight size={16} className="text-neutral-400" />
            </button>
          </div>

          {user && (
            <button className="flex items-center justify-center gap-2 w-full mt-6 py-3.5 rounded-xl border border-red-200 dark:border-red-800/40 text-error text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <LogOut size={16} />
              Sign Out
            </button>
          )}
        </section>
      </div>

      {/* Clear cache confirmation dialog */}
      {cacheDialogOpen && (
        <ClearCacheDialog onClose={() => setCacheDialogOpen(false)} />
      )}
    </motion.div>
  )
}

function SettingsToggle({ icon, label, description, active, onChange }) {
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
      <span className={active ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400'}>{icon}</span>
      <div className="flex-1 text-left">
        <p className={`text-sm font-medium ${active ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-900 dark:text-white'}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${active ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </button>
  )
}

function SettingsNavItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
      <span className="text-neutral-500 dark:text-neutral-400">{icon}</span>
      <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-white">{label}</span>
      <span className="text-xs text-neutral-400">{value}</span>
      <ChevronRight size={14} className="text-neutral-400" />
    </div>
  )
}

function ClearCacheDialog({ onClose }) {
  const [clearing, setClearing] = useState(false)
  const [cleared, setCleared] = useState(false)

  const handleClear = () => {
    setClearing(true)
    setTimeout(() => {
      setClearing(false)
      setCleared(true)
      setTimeout(onClose, 1200)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {cleared ? (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-3">
              <Trash2 size={20} className="text-success" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">Cache cleared successfully</p>
          </div>
        ) : (
          <>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">Clear Cache?</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
              This will remove all locally cached restroom data and offline maps. Your saved restrooms and account data will not be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="flex-1 py-2.5 rounded-xl bg-error text-white text-sm font-semibold active:scale-[0.98] transition-transform disabled:opacity-70"
              >
                {clearing ? 'Clearing...' : 'Clear Cache'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
