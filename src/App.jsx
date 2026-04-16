import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's broken default icon paths when bundled with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CENTER = [34.674, 132.334]
const ZOOM = 13
const SPOTS_URL =
  'https://api.cms.reearth.io/api/p/prototype-workspaces/local-learn/learning-spots.geojson'

export default function App() {
  const [spots, setSpots] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'empty' | 'ok' | 'error'

  useEffect(() => {
    fetch(SPOTS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const features = data.features ?? []
        setSpots(features)
        setStatus(features.length === 0 ? 'empty' : 'ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  const bannerText = {
    loading: 'Loading learning spots…',
    empty: 'No spots in the dataset yet — map is ready',
    error: 'Could not load spots — check the API endpoint',
    ok: `${spots.length} learning spot${spots.length !== 1 ? 's' : ''} loaded`,
  }[status]

  return (
    <div style={{ position: 'relative' }}>
      <div className={`status-banner ${status === 'error' ? 'error' : status === 'empty' ? 'empty' : ''}`}>
        {bannerText}
      </div>

      <MapContainer center={CENTER} zoom={ZOOM} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {spots.map((feature, i) => {
          const [lng, lat] = feature.geometry.coordinates
          const p = feature.properties ?? {}
          return (
            <Marker key={feature.id ?? i} position={[lat, lng]}>
              <Popup>
                <strong>{p.name ?? p.Name ?? 'Learning Spot'}</strong>
                {p.description && <p style={{ margin: '4px 0 0' }}>{p.description}</p>}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
