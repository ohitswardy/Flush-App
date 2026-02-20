import { useEffect, useRef, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useApp } from '../context/AppContext'
import { mockRestrooms, getMarkerType } from '../data/mockData'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue in Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MARKER_COLORS = {
  default: '#0d9488',
  accessible: '#3b82f6',
  'gender-neutral': '#8b5cf6',
  family: '#f59e0b',
}

function createCustomIcon(type = 'default', isSelected = false) {
  const color = MARKER_COLORS[type] || MARKER_COLORS.default
  const size = isSelected ? 48 : 40
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="${size}" height="${size * 1.3}">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
      <path d="M20 0C8.954 0 0 8.954 0 20c0 14.667 20 32 20 32s20-17.333 20-32C40 8.954 31.046 0 20 0z" fill="${color}" filter="url(#shadow)"/>
      <circle cx="20" cy="18" r="10" fill="white" opacity="0.95"/>
      <circle cx="20" cy="18" r="4" fill="${color}"/>
    </svg>
  `
  return L.divIcon({
    className: 'custom-div-icon',
    html: svg,
    iconSize: [size, size * 1.3],
    iconAnchor: [size / 2, size * 1.3],
    popupAnchor: [0, -size],
  })
}

function createUserIcon() {
  const svg = `
    <div style="position:relative;width:24px;height:24px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:#0d9488;opacity:0.2;animation:pulse-ring 1.5s ease-out infinite;"></div>
      <div style="position:absolute;inset:4px;border-radius:50%;background:#0d9488;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>
    </div>
  `
  return L.divIcon({
    className: 'user-location-icon',
    html: svg,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function MapClickHandler() {
  const { closeDetail } = useApp()
  useMapEvents({
    click: () => closeDetail(),
  })
  return null
}

function FlyToUser({ location }) {
  const map = useMap()
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 15, { duration: 0.8 })
    }
  }, [location, map])
  return null
}

function FlyToSelected({ restroom }) {
  const map = useMap()
  useEffect(() => {
    if (restroom) {
      map.flyTo([restroom.lat, restroom.lng], 16, { duration: 0.5 })
    }
  }, [restroom, map])
  return null
}

export default function MapView() {
  const { userLocation, selectedRestroom, selectRestroom, darkMode, activeFilters } = useApp()
  const [mapReady, setMapReady] = useState(false)

  // Default center (Cebu City)
  const defaultCenter = [10.3157, 123.8854]
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter

  // Filter restrooms
  const filteredRestrooms = useMemo(() => {
    return mockRestrooms.filter(r => {
      if (activeFilters.openNow && !r.isOpen) return false
      if (activeFilters.minRating > 0 && r.rating < activeFilters.minRating) return false
      if (activeFilters.wheelchair && !r.amenities.wheelchair) return false
      if (activeFilters.genderNeutral && !r.amenities.genderNeutral) return false
      if (activeFilters.familyRoom && !r.amenities.familyRoom) return false
      if (activeFilters.babyChanging && !r.amenities.babyChanging) return false
      if (activeFilters.radius > 0 && r.distance > activeFilters.radius) return false
      return true
    })
  }, [activeFilters])

  // Tile layer URL - desaturated/minimal style
  const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={center}
        zoom={14}
        zoomControl={false}
        attributionControl={true}
        className="w-full h-full"
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
          maxZoom={19}
        />

        <MapClickHandler />
        {userLocation && <FlyToUser location={userLocation} />}
        {selectedRestroom && <FlyToSelected restroom={selectedRestroom} />}

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
            interactive={false}
          />
        )}

        {/* Restroom markers */}
        {filteredRestrooms.map(restroom => (
          <Marker
            key={restroom.id}
            position={[restroom.lat, restroom.lng]}
            icon={createCustomIcon(
              getMarkerType(restroom),
              selectedRestroom?.id === restroom.id
            )}
            eventHandlers={{
              click: () => selectRestroom(restroom),
            }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
