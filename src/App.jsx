import { useEffect } from 'react'
import { useApp } from './context/AppContext'
import { AnimatePresence } from 'framer-motion'
import Onboarding from './components/Onboarding'
import TopNav from './components/TopNav'
import MapView from './components/MapView'
import MapControls from './components/MapControls'
import SearchOverlay from './components/SearchOverlay'
import FilterSheet from './components/FilterSheet'
import DetailSheet from './components/DetailSheet'
import AddRestroomScreen from './components/AddRestroomScreen'
import ReportScreen from './components/ReportScreen'
import ProfileScreen from './components/ProfileScreen'
import SettingsScreen from './components/SettingsScreen'
import PrivacyScreen from './components/PrivacyScreen'
import HelpSupportScreen from './components/HelpSupportScreen'
import FeedbackScreen from './components/FeedbackScreen'
import TermsScreen from './components/TermsScreen'
import { OfflineState, LocationDeniedState } from './components/StateScreens'

export default function App() {
  const {
    onboardingComplete,
    currentScreen,
    locationPermission,
    isOffline,
    setOffline,
    setUserLocation,
    setLocationPermission,
  } = useApp()

  // Listen for online/offline
  useEffect(() => {
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOffline])

  // Try to get location on mount (after onboarding)
  useEffect(() => {
    if (!onboardingComplete) return
    if (locationPermission === 'granted') return

    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationPermission('granted')
      },
      () => {
        // Location denied or unavailable - use default center
        setLocationPermission('denied')
      },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [onboardingComplete, locationPermission, setUserLocation, setLocationPermission])

  // Onboarding
  if (!onboardingComplete) {
    return <Onboarding />
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      {/* Base map layer */}
      <MapView />

      {/* Map overlay controls */}
      {currentScreen === 'home' && (
        <>
          <TopNav />
          <MapControls />
          <DetailSheet />
          <FilterSheet />
          <SearchOverlay />
        </>
      )}

      {/* Full-screen screens */}
      <AnimatePresence>
        {currentScreen === 'add' && <AddRestroomScreen key="add" />}
        {currentScreen === 'report' && <ReportScreen key="report" />}
        {currentScreen === 'profile' && <ProfileScreen key="profile" />}
        {currentScreen === 'settings' && <SettingsScreen key="settings" />}
        {currentScreen === 'privacy' && <PrivacyScreen key="privacy" />}
        {currentScreen === 'help' && <HelpSupportScreen key="help" />}
        {currentScreen === 'feedback' && <FeedbackScreen key="feedback" />}
        {currentScreen === 'terms' && <TermsScreen key="terms" />}
      </AnimatePresence>
    </div>
  )
}
