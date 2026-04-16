import { useEffect, useRef } from 'react'
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

const INITIAL_VIEW = { longitude: 132.334, latitude: 34.674, zoom: 13 }

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

      {/* Picking-location banner */}
      {pickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-blue-800 text-white rounded-full px-5 py-2.5 shadow-xl text-sm font-semibold pointer-events-none select-none">
          Click the map to place the marker · クリックして場所を指定
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-8 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2.5 text-xs text-gray-700 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">S</div>
          <span>Learning Spot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">M</div>
          <span>Mentor</span>
        </div>
      </div>
    </div>
  )
}
