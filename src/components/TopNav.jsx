import { useApp } from '../context/AppContext'
import {
  Menu,
  X,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  FileText,
  MessageSquare,
  LogIn,
  LogOut,
  Heart,
  MapPin,
  Plus,
  User,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TopNav() {
  const { menuOpen, toggleMenu, darkMode, setScreen } = useApp()

  return (
    <>
      <header className="safe-top fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between px-4 pt-3 pb-2 pointer-events-auto">
          {/* Logo */}
          <button
            onClick={() => setScreen('home')}
            className="touch-target flex items-center gap-2 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
            aria-label="Go to home"
          >
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <MapPin size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Banyo
            </span>
          </button>

          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="touch-target rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg p-2.5 shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={22} className="text-neutral-700 dark:text-neutral-300" />
            ) : (
              <Menu size={22} className="text-neutral-700 dark:text-neutral-300" />
            )}
          </button>
        </div>
      </header>

      {/* Side Menu Overlay + Sheet */}
      <AnimatePresence>
        {menuOpen && <SideMenu />}
      </AnimatePresence>
    </>
  )
}

function SideMenu() {
  const { closeMenu, darkMode, toggleDarkMode, user, setScreen } = useApp()

  const menuItems = [
    { icon: Heart, label: 'Saved Restrooms', action: () => { setScreen('profile'); closeMenu() } },
    { icon: Plus, label: 'Add a Restroom', action: () => { setScreen('add'); closeMenu() } },
    { icon: User, label: 'My Contributions', action: () => { setScreen('profile'); closeMenu() } },
    { divider: true },
    { icon: Settings, label: 'Settings', action: () => { setScreen('settings'); closeMenu() } },
    { icon: Shield, label: 'Privacy', action: () => { setScreen('privacy'); closeMenu() } },
    { icon: HelpCircle, label: 'Help & Support', action: () => { setScreen('help'); closeMenu() } },
    { icon: MessageSquare, label: 'Send Feedback', action: () => { setScreen('feedback'); closeMenu() } },
    { icon: FileText, label: 'Terms of Service', action: () => { setScreen('terms'); closeMenu() } },
  ]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Sheet */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 z-[70] w-[300px] max-w-[85vw] bg-white dark:bg-neutral-900 shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close */}
        <div className="safe-top flex items-center justify-between px-5 pt-4 pb-3">
          <span className="text-lg font-semibold text-neutral-900 dark:text-white">Menu</span>
          <button onClick={closeMenu} className="touch-target rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" aria-label="Close menu">
            <X size={20} className="text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* User section */}
        <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <User size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={closeMenu}
              className="flex items-center gap-3 w-full py-2 text-primary-600 dark:text-primary-400 font-medium text-sm"
            >
              <LogIn size={18} />
              Sign in to save your data
            </button>
          )}
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-2 mx-5 border-t border-neutral-100 dark:border-neutral-800" />
            ) : (
              <button
                key={i}
                onClick={item.action}
                className="flex items-center gap-3 w-full px-5 py-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <item.icon size={18} className="text-neutral-500 dark:text-neutral-400" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight size={14} className="text-neutral-400" />
              </button>
            )
          )}
        </nav>

        {/* Dark mode toggle + sign out */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 px-5 py-3 safe-bottom">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full py-2.5 text-sm text-neutral-700 dark:text-neutral-300"
          >
            {darkMode ? <Sun size={18} className="text-accent-500" /> : <Moon size={18} className="text-neutral-500" />}
            <span className="flex-1">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            <div className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${darkMode ? 'bg-primary-600' : 'bg-neutral-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          {user && (
            <button className="flex items-center gap-3 w-full py-2.5 text-sm text-error">
              <LogOut size={18} />
              Sign Out
            </button>
          )}
        </div>
      </motion.div>
    </>
  )
}
