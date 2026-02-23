import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { mockRestrooms, formatDistance } from '../data/mockData'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Settings,
  User,
  Award,
  ChevronRight,
  Clock,
  Accessibility,
  Trash2,
} from 'lucide-react'

export default function ProfileScreen() {
  const { setScreen, savedRestrooms, toggleSaved, selectRestroom, user } = useApp()
  const [activeTab, setActiveTab] = useState('saved')

  const savedList = mockRestrooms.filter(r => savedRestrooms.includes(r.id))
  // Mock contributions
  const contributions = [
    { id: 1, type: 'added', name: 'IT Park Public Comfort Room', date: '2026-02-12', status: 'verified' },
    { id: 2, type: 'review', name: 'Ayala Center Cebu - Ground Floor', date: '2026-02-15', status: 'published' },
    { id: 3, type: 'report', name: 'Jollibee Colon - Public Restroom', date: '2026-02-10', status: 'under review' },
  ]

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
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">Profile</h1>
      </div>

      {/* User Card */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <User size={28} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {user?.name || 'Guest User'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {user?.email || 'Sign in to sync your data'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4">
          <StatCard value={savedList.length} label="Saved" icon={<Heart size={14} />} />
          <StatCard value={contributions.length} label="Contributions" icon={<Award size={14} />} />
          <StatCard value="2" label="Reviews" icon={<Star size={14} />} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100 dark:border-neutral-800 px-5">
        <TabButton
          label="Saved"
          active={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
        />
        <TabButton
          label="Contributions"
          active={activeTab === 'contributions'}
          onClick={() => setActiveTab('contributions')}
        />
        <TabButton
          label="Settings"
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'saved' && (
          <div className="px-5 py-4">
            {savedList.length > 0 ? (
              <div className="space-y-2">
                {savedList.map(r => (
                  <SavedRestroomCard
                    key={r.id}
                    restroom={r}
                    onSelect={() => { selectRestroom(r); setScreen('home') }}
                    onRemove={() => toggleSaved(r.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Heart size={32} className="text-neutral-300 dark:text-neutral-600" />}
                title="No saved restrooms"
                description="Tap the heart icon on any restroom to save it here for quick access."
              />
            )}
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="px-5 py-4">
            {contributions.length > 0 ? (
              <div className="space-y-2">
                {contributions.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      c.type === 'added' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' :
                      c.type === 'review' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' :
                      'bg-red-100 dark:bg-red-900/30 text-error'
                    }`}>
                      {c.type === 'added' ? <MapPin size={14} /> : c.type === 'review' ? <Star size={14} /> : <Settings size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{c.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-neutral-400">{c.date}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          c.status === 'verified' ? 'bg-green-100 text-success dark:bg-green-900/30' :
                          c.status === 'published' ? 'bg-blue-100 text-info dark:bg-blue-900/30' :
                          'bg-amber-100 text-warning dark:bg-amber-900/30'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-neutral-400" />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Award size={32} className="text-neutral-300 dark:text-neutral-600" />}
                title="No contributions yet"
                description="Add restrooms or write reviews to help the community."
              />
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="px-5 py-4 space-y-2">
            <SettingsItem label="Account" description="Manage your profile" />
            <SettingsItem label="Notifications" description="Push & email preferences" />
            <SettingsItem label="Location Privacy" description="Control location sharing" />
            <SettingsItem label="Cache & Data" description="Manage offline data" />
            <SettingsItem label="About Flush" description="Version 1.0.0" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function StatCard({ value, label, icon }) {
  return (
    <div className="flex-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
      <p className="text-lg font-bold text-neutral-900 dark:text-white">{value}</p>
      <p className="text-xs text-neutral-500 flex items-center justify-center gap-1 mt-0.5">
        {icon} {label}
      </p>
    </div>
  )
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
        active
          ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
          : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
      }`}
    >
      {label}
    </button>
  )
}

function SavedRestroomCard({ restroom, onSelect, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
      <button onClick={onSelect} className="flex-1 flex items-start gap-3 text-left min-w-0">
        <div className="w-12 h-12 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 overflow-hidden">
          {restroom.photos[0] ? (
            <img src={restroom.photos[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin size={16} className="text-neutral-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{restroom.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-xs text-accent-600 dark:text-accent-400">
              <Star size={10} fill="currentColor" /> {restroom.rating}
            </span>
            <span className="text-xs text-neutral-400">{formatDistance(restroom.distance)}</span>
          </div>
        </div>
      </button>
      <button
        onClick={onRemove}
        className="touch-target p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        aria-label="Remove from saved"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
      <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">{description}</p>
    </div>
  )
}

function SettingsItem({ label, description }) {
  return (
    <button className="flex items-center justify-between w-full p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
      <div className="text-left">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">{label}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
      </div>
      <ChevronRight size={16} className="text-neutral-400" />
    </button>
  )
}
