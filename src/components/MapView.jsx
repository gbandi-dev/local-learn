import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const CENTER = [34.674, 132.334]
const ZOOM = 13

const SPOT_COLOR = '#3B82F6'   // blue-500
const MENTOR_COLOR = '#F97316' // orange-500

function createIcon(color, selected = false) {
  const size = selected ? 22 : 16
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:${color};
      border:2.5px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  })
}

// Flies to the selected item without remounting the map
function FlyTo({ selected }) {
  const map = useMap()
  useEffect(() => {
    if (selected?.geometry?.coordinates) {
      const [lng, lat] = selected.geometry.coordinates
      map.flyTo([lat, lng], 15, { duration: 0.8 })
    }
  }, [selected, map])
  return null
}

export default function MapView({ spots, mentors, selected, onSelect, category }) {
  const filterByCategory = (features) =>
    category === 'all'
      ? features
      : features.filter(
          (f) =>
            (f.properties?.category ?? '').toLowerCase() === category.toLowerCase()
        )

  const visibleSpots = filterByCategory(spots)
  const visibleMentors = filterByCategory(mentors)

  return (
    <div className="flex-1 relative">
      <MapContainer center={CENTER} zoom={ZOOM} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo selected={selected} />

        {visibleSpots.map((feature, i) => {
          const [lng, lat] = feature.geometry.coordinates
          return (
            <Marker
              key={feature.id ?? `spot-${i}`}
              position={[lat, lng]}
              icon={createIcon(SPOT_COLOR, selected?.id === feature.id)}
              eventHandlers={{ click: () => onSelect(feature) }}
            />
          )
        })}

        {visibleMentors.map((feature, i) => {
          const [lng, lat] = feature.geometry.coordinates
          return (
            <Marker
              key={feature.id ?? `mentor-${i}`}
              position={[lat, lng]}
              icon={createIcon(MENTOR_COLOR, selected?.id === feature.id)}
              eventHandlers={{ click: () => onSelect(feature) }}
            />
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-5 right-3 z-[400] bg-white rounded-lg shadow-md px-3 py-2 text-xs text-gray-700 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 shrink-0" />
          Learning Spot / 学習スポット
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-orange-500 shrink-0" />
          Community Mentor / メンター
        </div>
      </div>
    </div>
  )
}
