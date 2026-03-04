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
  const size = isSelected ? 44 : 36
  const borderW = 3
  const shadowOffset = isSelected ? 5 : 3
  const pointerH = isSelected ? 10 : 8
  const sq = Math.round(size * 0.4)

  const html = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size + pointerH}px;
      filter: drop-shadow(${shadowOffset}px ${shadowOffset}px 0 rgba(0,0,0,0.9));
      transition: transform 0.12s ease, filter 0.12s ease;
    " class="neo-marker">
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: ${borderW}px solid #000;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width:${sq}px;height:${sq}px;background:#fff;"></div>
      </div>
      <div style="
        width: 0; height: 0;
        border-left: ${size / 2}px solid transparent;
        border-right: ${size / 2}px solid transparent;
        border-top: ${pointerH}px solid #000;
        position: absolute; bottom: 0; left: 0;
      "></div>
      <div style="
        width: 0; height: 0;
        border-left: ${(size - borderW * 2) / 2}px solid transparent;
        border-right: ${(size - borderW * 2) / 2}px solid transparent;
        border-top: ${pointerH - 2}px solid ${color};
        position: absolute; bottom: 2px; left: ${borderW}px;
      "></div>
    </div>
  `
  return L.divIcon({
    className: 'neo-brutalist-marker',
    html,
    iconSize: [size, size + pointerH],
    iconAnchor: [size / 2, size + pointerH],
    popupAnchor: [0, -(size + pointerH)],
  })
}

function createUserIcon() {
  const html = `
    <div style="position:relative;width:28px;height:28px;">
      <div style="
        position:absolute;
        inset: 0;
        background: #0d9488;
        opacity: 0.2;
        animation: pulse-ring 1.5s ease-out infinite;
      "></div>
      <div style="
        position:absolute;
        inset: 4px;
        background: #0d9488;
        border: 3px solid #000;
        box-shadow: 2px 2px 0 #000;
      ">
        <div style="
          position:absolute;
          inset: 2px;
          border: 1.5px solid rgba(255,255,255,0.6);
        "></div>
      </div>
    </div>
  `
  return L.divIcon({
    className: 'neo-brutalist-user-marker',
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
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
