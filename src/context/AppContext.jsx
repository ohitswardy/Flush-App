import { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

const initialState = {
  darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches || false,
  onboardingComplete: localStorage.getItem('banyo_onboarded') === 'true',
  locationPermission: null, // 'granted' | 'denied' | 'prompt' | null
  userLocation: null,
  selectedRestroom: null,
  searchQuery: '',
  searchOpen: false,
  filtersOpen: false,
  menuOpen: false,
  detailOpen: false,
  detailFull: false,
  activeFilters: {
    radius: 1000,
    minRating: 0,
    openNow: false,
    wheelchair: false,
    genderNeutral: false,
    familyRoom: false,
    babyChanging: false,
  },
  recentSearches: JSON.parse(localStorage.getItem('banyo_recent') || '[]'),
  savedRestrooms: JSON.parse(localStorage.getItem('banyo_saved') || '[]'),
  isOffline: !navigator.onLine,
  currentScreen: 'home', // 'home' | 'search' | 'profile' | 'add' | 'report' | 'settings' | 'privacy' | 'help' | 'feedback' | 'terms'
  user: JSON.parse(localStorage.getItem('banyo_user') || 'null'),
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE': {
      const next = !state.darkMode
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('banyo_dark', next)
      return { ...state, darkMode: next }
    }
    case 'COMPLETE_ONBOARDING':
      localStorage.setItem('banyo_onboarded', 'true')
      return { ...state, onboardingComplete: true }
    case 'SET_LOCATION_PERMISSION':
      return { ...state, locationPermission: action.payload }
    case 'SET_USER_LOCATION':
      return { ...state, userLocation: action.payload }
    case 'SELECT_RESTROOM':
      return { ...state, selectedRestroom: action.payload, detailOpen: !!action.payload, detailFull: false }
    case 'TOGGLE_DETAIL_FULL':
      return { ...state, detailFull: !state.detailFull }
    case 'CLOSE_DETAIL':
      return { ...state, detailOpen: false, detailFull: false, selectedRestroom: null }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'TOGGLE_SEARCH':
      return { ...state, searchOpen: !state.searchOpen, searchQuery: '' }
    case 'TOGGLE_FILTERS':
      return { ...state, filtersOpen: !state.filtersOpen }
    case 'TOGGLE_MENU':
      return { ...state, menuOpen: !state.menuOpen }
    case 'CLOSE_MENU':
      return { ...state, menuOpen: false }
    case 'SET_FILTERS':
      return { ...state, activeFilters: { ...state.activeFilters, ...action.payload } }
    case 'RESET_FILTERS':
      return { ...state, activeFilters: initialState.activeFilters }
    case 'ADD_RECENT_SEARCH': {
      const recent = [action.payload, ...state.recentSearches.filter(s => s !== action.payload)].slice(0, 8)
      localStorage.setItem('banyo_recent', JSON.stringify(recent))
      return { ...state, recentSearches: recent }
    }
    case 'TOGGLE_SAVED': {
      const id = action.payload
      const saved = state.savedRestrooms.includes(id)
        ? state.savedRestrooms.filter(s => s !== id)
        : [...state.savedRestrooms, id]
      localStorage.setItem('banyo_saved', JSON.stringify(saved))
      return { ...state, savedRestrooms: saved }
    }
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload }
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload, searchOpen: false, filtersOpen: false, menuOpen: false }
    case 'SET_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Initialize dark mode on mount
  if (state.darkMode) {
    document.documentElement.classList.add('dark')
  }

  const actions = {
    toggleDarkMode: useCallback(() => dispatch({ type: 'TOGGLE_DARK_MODE' }), []),
    completeOnboarding: useCallback(() => dispatch({ type: 'COMPLETE_ONBOARDING' }), []),
    setLocationPermission: useCallback((p) => dispatch({ type: 'SET_LOCATION_PERMISSION', payload: p }), []),
    setUserLocation: useCallback((loc) => dispatch({ type: 'SET_USER_LOCATION', payload: loc }), []),
    selectRestroom: useCallback((r) => dispatch({ type: 'SELECT_RESTROOM', payload: r }), []),
    toggleDetailFull: useCallback(() => dispatch({ type: 'TOGGLE_DETAIL_FULL' }), []),
    closeDetail: useCallback(() => dispatch({ type: 'CLOSE_DETAIL' }), []),
    setSearchQuery: useCallback((q) => dispatch({ type: 'SET_SEARCH_QUERY', payload: q }), []),
    toggleSearch: useCallback(() => dispatch({ type: 'TOGGLE_SEARCH' }), []),
    toggleFilters: useCallback(() => dispatch({ type: 'TOGGLE_FILTERS' }), []),
    toggleMenu: useCallback(() => dispatch({ type: 'TOGGLE_MENU' }), []),
    closeMenu: useCallback(() => dispatch({ type: 'CLOSE_MENU' }), []),
    setFilters: useCallback((f) => dispatch({ type: 'SET_FILTERS', payload: f }), []),
    resetFilters: useCallback(() => dispatch({ type: 'RESET_FILTERS' }), []),
    addRecentSearch: useCallback((s) => dispatch({ type: 'ADD_RECENT_SEARCH', payload: s }), []),
    toggleSaved: useCallback((id) => dispatch({ type: 'TOGGLE_SAVED', payload: id }), []),
    setOffline: useCallback((v) => dispatch({ type: 'SET_OFFLINE', payload: v }), []),
    setScreen: useCallback((s) => dispatch({ type: 'SET_SCREEN', payload: s }), []),
    setUser: useCallback((u) => dispatch({ type: 'SET_USER', payload: u }), []),
  }

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
