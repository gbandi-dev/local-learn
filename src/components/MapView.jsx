import { useEffect, useRef, useState } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

// Satellite imagery (ESRI World Imagery) + CartoDB label overlay
const MAP_STYLE = {
  version: 8,
  sources: {
    satellite: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri &mdash; Esri, Maxar, GeoEye',
      maxzoom: 19,
    },
    labels: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; CARTO',
    },
  },
  layers: [
    { id: 'satellite', type: 'raster', source: 'satellite' },
    { id: 'labels',    type: 'raster', source: 'labels' },
  ],
}

const INITIAL_VIEW = { longitude: 132.53736, latitude: 34.67402, zoom: 15 }

const TYPE_COLOR = { spot: '#3b82f6', mentor: '#f97316' }
const TYPE_LABEL = { spot: '場', mentor: '人' }

function Pin({ type, selected, demo }) {
  const color = TYPE_COLOR[type] ?? '#6b7280'
  const label = TYPE_LABEL[type] ?? '?'
  const size  = selected ? 28 : 22

  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      {/* Pulse ring for demo / new items */}
      {demo && (
        <div
          className="marker-pulse-ring"
          style={{
            position: 'absolute',
            inset: -5,
            borderRadius: '50%',
            background: color,
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          border: `${selected ? 3 : 2}px solid white`,
          boxShadow: selected
            ? `0 0 0 3px ${color}55, 0 4px 12px rgba(0,0,0,0.5)`
            : '0 2px 8px rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size * 0.44,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.15s',
        }}
      >
        {label}
      </div>
    </div>
  )
}

function LocationButton({ mapRef, pickingLocation, onMapClick }) {
  const [loading, setLoading] = useState(false)

  function handleClick() {
    if (!navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false)
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        // Always fly the map to user's location
        mapRef.current?.flyTo({ center: [coords.lng, coords.lat], zoom: 16, duration: 800 })
        // If picking, also set the pin
        if (pickingLocation && onMapClick) onMapClick(coords)
      },
      () => setLoading(false),
      { timeout: 10000 }
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="現在地を表示 / My Location"
      className="absolute bottom-[130px] right-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
      )}
    </button>
  )
}

export default function MapView({
  spots, mentors, selected, onSelect,
  onMapClick, pickingLocation, category,
}) {
  const mapRef = useRef()

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
    <div className="w-full h-full relative">
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
          return (
            <Marker
              key={feature.id ?? `spot-${i}`}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={(e) => { e.originalEvent.stopPropagation(); onSelect(feature) }}
            >
              <Pin type="spot" selected={selected?.id === feature.id} demo={!!feature._demo} />
            </Marker>
          )
        })}

        {visibleMentors.map((feature, i) => {
          const [lng, lat] = feature.geometry.coordinates
          return (
            <Marker
              key={feature.id ?? `mentor-${i}`}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={(e) => { e.originalEvent.stopPropagation(); onSelect(feature) }}
            >
              <Pin type="mentor" selected={selected?.id === feature.id} demo={!!feature._demo} />
            </Marker>
          )
        })}
      </Map>

      {/* Empty state overlay */}
      {spots.length === 0 && mentors.length === 0 && !pickingLocation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl px-6 py-5 max-w-xs text-center pointer-events-auto">
            <div className="text-3xl mb-3">📍</div>
            <p className="text-sm font-bold text-gray-800">まだ場所がありません</p>
            <p className="text-xs text-gray-500 mt-1">No places added yet</p>
            <p className="text-xs text-teal-700 font-medium mt-3">左下のボタンから最初の場所を登録しましょう！</p>
            <p className="text-xs text-gray-400 mt-0.5">Use the buttons below-left to add the first spot</p>
          </div>
        </div>
      )}

      {/* Persistent location button */}
      <LocationButton mapRef={mapRef} pickingLocation={pickingLocation} onMapClick={onMapClick} />

      {/* Picking-location banner */}
      {pickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-blue-800 text-white rounded-full px-5 py-2.5 shadow-xl text-sm font-semibold pointer-events-none select-none text-center">
          地図をタップ・または現在地ボタンで場所を指定
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-8 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2.5 text-xs text-gray-700 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">場</div>
          <div>
            <p className="font-bold leading-none">まちの場所</p>
            <p className="text-gray-400 text-xs">Place in Town</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">人</div>
          <div>
            <p className="font-bold leading-none">まちの人</p>
            <p className="text-gray-400 text-xs">Person in Town</p>
          </div>
        </div>
      </div>
    </div>
  )
}
