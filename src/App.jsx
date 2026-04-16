import React, { useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import ReportView from './components/ReportView'
import AddItemModal from './components/AddItemModal'
import { useGeoData } from './hooks/useGeoData'
import { createCmsItem, isCmsConfigured } from './api/cms'

// ── Kitahiroshimacho mascot (cow character) ─────────────────────────────────
function KitaMascot({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      {/* Horns */}
      <path d="M14 12 Q11 5 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M34 12 Q37 5 41 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Ears */}
      <ellipse cx="10" cy="18" rx="6" ry="7.5" fill="white"/>
      <ellipse cx="38" cy="18" rx="6" ry="7.5" fill="white"/>
      <ellipse cx="10" cy="18" rx="3.5" ry="5" fill="#fda4af"/>
      <ellipse cx="38" cy="18" rx="3.5" ry="5" fill="#fda4af"/>
      {/* Head */}
      <circle cx="24" cy="28" r="16" fill="white"/>
      {/* Patch */}
      <ellipse cx="30" cy="24" rx="5" ry="4" fill="#d1fae5" transform="rotate(-15 30 24)"/>
      {/* Eyes */}
      <circle cx="18.5" cy="25" r="3.5" fill="#1c1917"/>
      <circle cx="29.5" cy="25" r="3.5" fill="#1c1917"/>
      <circle cx="19.5" cy="23.8" r="1.2" fill="white"/>
      <circle cx="30.5" cy="23.8" r="1.2" fill="white"/>
      {/* Nose */}
      <ellipse cx="24" cy="33" rx="6.5" ry="4.5" fill="#fda4af"/>
      <circle cx="21.5" cy="33" r="1.8" fill="#f43f5e"/>
      <circle cx="26.5" cy="33" r="1.8" fill="#f43f5e"/>
    </svg>
  )
}

// ── Icons for bottom nav ────────────────────────────────────────────────────
function IconCamera({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
function IconMap({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  )
}
function IconList({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <circle cx="3" cy="6" r="0.5" fill="currentColor"/><circle cx="3" cy="12" r="0.5" fill="currentColor"/><circle cx="3" cy="18" r="0.5" fill="currentColor"/>
    </svg>
  )
}

// ── Build a local GeoJSON feature ───────────────────────────────────────────
function makeFeature(type, formData, coords) {
  return {
    type: 'Feature',
    id: `local-${Date.now()}`,
    _type: type,
    _local: true,
    geometry: { type: 'Point', coordinates: [coords.lng, coords.lat] },
    properties: {
      name:        formData.name,
      name_ja:     formData.name_ja,
      description: formData.description,
      category:    formData.category,
      languages:   formData.languages,
    },
  }
}

// ── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { spots, mentors, loading, error, usingDemo, refresh } = useGeoData()

  // Local items added via form (shown immediately, with or without CMS)
  const [localSpots,   setLocalSpots]   = useState([])
  const [localMentors, setLocalMentors] = useState([])

  const allSpots   = [...spots,   ...localSpots]
  const allMentors = [...mentors, ...localMentors]

  // View state
  const [mobileView,      setMobileView]      = useState('report') // report | map | list
  const [selected,        setSelected]        = useState(null)
  const [category,        setCategory]        = useState('all')
  const [tab,             setTab]             = useState('all')

  // Map-click add flow (desktop / map tab)
  const [addingType,      setAddingType]      = useState(null)
  const [pickingLocation, setPickingLocation] = useState(false)
  const [draftCoords,     setDraftCoords]     = useState(null)

  // Unified filtered list for sidebar
  const allItems = [
    ...allSpots.map((f) => ({ ...f, _type: f._type ?? 'spot' })),
    ...allMentors.map((f) => ({ ...f, _type: f._type ?? 'mentor' })),
  ].filter((item) => {
    if (tab === 'spots'   && item._type !== 'spot')   return false
    if (tab === 'mentors' && item._type !== 'mentor') return false
    if (category !== 'all') {
      if ((item.properties?.category ?? '').toLowerCase() !== category.toLowerCase()) return false
    }
    return true
  })

  // ── Handle form submission (ReportView or AddItemModal) ───────────────────
  async function handleSubmit(type, formData, coords) {
    const finalCoords = coords ?? { lat: 34.674, lng: 132.334 }

    if (isCmsConfigured()) {
      try {
        await createCmsItem(type, { ...formData, ...finalCoords })
        refresh() // re-fetch from CMS
        return
      } catch (e) {
        console.warn('CMS write failed — saving locally:', e.message)
      }
    }

    // Fallback: add to local state so marker appears immediately
    const feature = makeFeature(type, formData, finalCoords)
    if (type === 'spot')   setLocalSpots((s) => [...s, feature])
    else                   setLocalMentors((m) => [...m, feature])
  }

  function startAdding(type) {
    setAddingType(type)
    setPickingLocation(true)
    setMobileView('map')
  }

  function cancelAdding() {
    setAddingType(null)
    setPickingLocation(false)
    setDraftCoords(null)
  }

  // ── Shared map + sidebar ──────────────────────────────────────────────────
  const mapEl = (
    <MapView
      spots={allSpots}
      mentors={allMentors}
      selected={selected}
      onSelect={(item) => { setSelected(item); setMobileView('list') }}
      onMapClick={(coords) => {
        if (!pickingLocation) return
        setDraftCoords(coords)
        setPickingLocation(false)
      }}
      pickingLocation={pickingLocation}
      category={category}
    />
  )

  const sidebarEl = (
    <Sidebar
      spots={allSpots}
      mentors={allMentors}
      items={allItems}
      loading={loading}
      error={error}
      selected={selected}
      onSelect={setSelected}
      category={category}
      onCategory={setCategory}
      tab={tab}
      onTab={setTab}
      isOpen={true}
      onBack={() => setSelected(null)}
      onAddSpot={() => startAdding('spot')}
      onAddMentor={() => startAdding('mentor')}
    />
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Header ─────────────────────────────── */}
      <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center shrink-0 shadow-inner">
            <KitaMascot className="w-9 h-9" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">ローカルラーン</h1>
            <p className="text-teal-200 text-xs">Local Learn · 北広島町</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {usingDemo && (
            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">Demo</span>
          )}
          {!pickingLocation ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <button onClick={() => startAdding('spot')}   className="text-xs font-semibold bg-blue-500 hover:bg-blue-400 active:scale-95 text-white px-3 py-1.5 rounded-lg transition-all">+ Spot</button>
              <button onClick={() => startAdding('mentor')} className="text-xs font-semibold bg-orange-500 hover:bg-orange-400 active:scale-95 text-white px-3 py-1.5 rounded-lg transition-all">+ Mentor</button>
            </div>
          ) : (
            <button onClick={cancelAdding} className="text-xs font-semibold border border-white/40 text-white px-3 py-1.5 rounded-lg">Cancel</button>
          )}
        </div>
      </header>

      {/* ── Desktop layout: sidebar + map always ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {sidebarEl}
        {mapEl}
      </div>

      {/* ── Mobile layout: one view at a time ───── */}
      <div className="md:hidden flex flex-1 overflow-hidden flex-col">
        {mobileView === 'report' && (
          <ReportView
            onSubmit={handleSubmit}
            onViewMap={() => setMobileView('map')}
          />
        )}
        {mobileView === 'map' && (
          <div className="flex-1 relative">{mapEl}</div>
        )}
        {mobileView === 'list' && (
          <div className="flex flex-1 overflow-hidden">
            {React.cloneElement(sidebarEl, { isOpen: true })}
          </div>
        )}
      </div>

      {/* ── Mobile bottom nav ──────────────────── */}
      <nav className="md:hidden bg-white border-t border-gray-200 flex shrink-0 safe-bottom">
        {[
          { id: 'report', label: 'Report', ja: '登録', Icon: IconCamera },
          { id: 'map',    label: 'Map',    ja: '地図', Icon: IconMap    },
          { id: 'list',   label: 'List',   ja: '一覧', Icon: IconList   },
        ].map(({ id, label, ja, Icon }) => (
          <button
            key={id}
            onClick={() => setMobileView(id)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors ${
              mobileView === id ? 'text-teal-700' : 'text-gray-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            <span className="text-xs opacity-60">{ja}</span>
            {mobileView === id && <div className="absolute bottom-0 w-10 h-0.5 bg-teal-700 rounded-full" />}
          </button>
        ))}
      </nav>

      {/* ── Add Item Modal (map-click flow) ─────── */}
      {addingType && draftCoords && (
        <AddItemModal
          type={addingType}
          coords={draftCoords}
          onClose={cancelAdding}
          onSuccess={() => { setAddingType(null); setDraftCoords(null) }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
