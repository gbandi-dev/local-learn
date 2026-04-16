import { useEffect, useRef } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

// Free vector tile style — no API key needed
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

const INITIAL_VIEW = { longitude: 132.334, latitude: 34.674, zoom: 13 }
const SPOT_COLOR   = '#3B82F6' // blue-500
const MENTOR_COLOR = '#F97316' // orange-500

function Pin({ color, size }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        border: '2.5px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
        cursor: 'pointer',
      }}
    />
  )
}

export default function MapView({
  spots, mentors, selected, onSelect,
  onMapClick, pickingLocation, category,
}) {
  const mapRef = useRef()

  // Fly to selected item whenever it changes
  useEffect(() => {
    if (selected?.geometry?.coordinates && mapRef.current) {
      const [lng, lat] = selected.geometry.coordinates
      mapRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: 800 })
    }
  }, [selected])

  const filterByCategory = (features) =>
    category === 'all'
      ? features
      : features.filter(
          (f) => (f.properties?.category ?? '').toLowerCase() === category.toLowerCase()
        )

  const visibleSpots   = filterByCategory(spots)
  const visibleMentors = filterByCategory(mentors)

  return (
    <div className="flex-1 relative">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        cursor={pickingLocation ? 'crosshair' : 'grab'}
        onClick={(e) => {
          if (pickingLocation && onMapClick) {
            onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng })
          }
        }}
        attributionControl={{ compact: true }}
      >
        <NavigationControl position="top-right" />

        {visibleSpots.map((feature, i) => {
          const [lng, lat] = feature.geometry.coordinates
          const isSelected = selected?.id === feature.id
          return (
            <Marker
              key={feature.id ?? `spot-${i}`}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                onSelect(feature)
              }}
            >
              <Pin color={SPOT_COLOR} size={isSelected ? 22 : 16} />
            </Marker>
          )
        })}

        {visibleMentors.map((feature, i) => {
          const [lng, lat] = feature.geometry.coordinates
          const isSelected = selected?.id === feature.id
          return (
            <Marker
              key={feature.id ?? `mentor-${i}`}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                onSelect(feature)
              }}
            >
              <Pin color={MENTOR_COLOR} size={isSelected ? 22 : 16} />
            </Marker>
          )
        })}
      </Map>

      {/* Picking-location banner */}
      {pickingLocation && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white rounded-full px-4 py-2 shadow-lg text-sm font-medium text-gray-700 pointer-events-none select-none">
          Click the map to place the marker · クリックして場所を指定
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-8 right-3 z-10 bg-white rounded-lg shadow-md px-3 py-2 text-xs text-gray-700 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0 inline-block" />
          Learning Spot / 学習スポット
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0 inline-block" />
          Community Mentor / メンター
        </div>
      </div>
    </div>
  )
}
