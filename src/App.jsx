import React, { useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import ReportView from './components/ReportView'
import AddItemModal from './components/AddItemModal'
import { useGeoData } from './hooks/useGeoData'
import { createCmsItem, isCmsConfigured } from './api/cms'

// ── Icons ────────────────────────────────────────────────────────────────────
function IconMap({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  )
}
function IconPeople({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function IconNote({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

// ── Build a local GeoJSON feature ─────────────────────────────────────────────
function makeFeature(type, formData, coords) {
  return {
    type: 'Feature',
    id: `local-${Date.now()}`,
    _type: type,
    _local: true,
    geometry: { type: 'Point', coordinates: [coords.lng, coords.lat] },
    properties: {
      name:        formData.username ?? formData.name,
      description: formData['area-description'] ?? formData['what-i-can-teach'],
      category:    formData.category,
      languages:   formData.languages,
    },
  }
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { spots, mentors, loading, error, usingDemo, refresh } = useGeoData()

  const [localSpots,   setLocalSpots]   = useState([])
  const [localMentors, setLocalMentors] = useState([])

  const allSpots   = [...spots,   ...localSpots]
  const allMentors = [...mentors, ...localMentors]

  // 'map' | 'list' | 'report'
  const [mobileView,      setMobileView]      = useState('map')
  const [selected,        setSelected]        = useState(null)
  const [category,        setCategory]        = useState('all')
  const [tab,             setTab]             = useState('all')

  const [addingType,      setAddingType]      = useState(null)
  const [pickingLocation, setPickingLocation] = useState(false)
  const [draftCoords,     setDraftCoords]     = useState(null)

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

  async function handleSubmit(type, formData, coords) {
    const finalCoords = coords ?? { lat: 34.674, lng: 132.334 }
    if (isCmsConfigured()) {
      try {
        await createCmsItem(type, { ...formData, ...finalCoords })
        refresh()
        return
      } catch (e) {
        console.warn('CMS write failed — saving locally:', e.message)
      }
    }
    const feature = makeFeature(type, formData, finalCoords)
    if (type === 'spot') setLocalSpots((s) => [...s, feature])
    else                 setLocalMentors((m) => [...m, feature])
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

  // ── Nav ───────────────────────────────────────────────────────────────────
  const NAV = [
    { id: 'map',    ja: '地図',       sub: '場所をさがす', Icon: IconMap    },
    { id: 'list',   ja: 'まちの人',   sub: 'People',       Icon: IconPeople },
    { id: 'report', ja: '学びの記録', sub: 'Record',       Icon: IconNote   },
  ]

  function goTab(id) {
    setMobileView(id)
    if (id === 'list') setTab('mentors')
    if (id === 'map')  setTab('all')
  }

  // ── Shared elements ───────────────────────────────────────────────────────
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
    <div className="flex justify-center bg-gray-300 h-screen">
    <div className="flex flex-col h-screen w-full max-w-screen-lg overflow-hidden shadow-2xl">

      {/* ── Header ─────────────────────────────── */}
      <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}mascot.png`} alt="mascot" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">ローカルラーン</h1>
            <p className="text-teal-200 text-xs">Local Learn · 北広島町</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {usingDemo && (
            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">デモ</span>
          )}
          {!pickingLocation ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <button onClick={() => startAdding('spot')}   className="text-xs font-semibold bg-blue-500 hover:bg-blue-400 active:scale-95 text-white px-3 py-1.5 rounded-lg transition-all">＋ 場所</button>
              <button onClick={() => startAdding('mentor')} className="text-xs font-semibold bg-orange-500 hover:bg-orange-400 active:scale-95 text-white px-3 py-1.5 rounded-lg transition-all">＋ まちの人</button>
            </div>
          ) : (
            <button onClick={cancelAdding} className="text-xs font-semibold border border-white/40 text-white px-3 py-1.5 rounded-lg">キャンセル</button>
          )}
        </div>
      </header>

      {/* ── Mobile top nav ─────────────────────── */}
      <nav className="md:hidden bg-white border-b border-gray-200 flex shrink-0 z-10">
        {NAV.map(({ id, ja, sub, Icon }) => (
          <button
            key={id}
            onClick={() => goTab(id)}
            className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-colors relative ${
              mobileView === id ? 'text-teal-700' : 'text-gray-400'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-bold leading-none">{ja}</span>
            {mobileView === id && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-700 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* ── Desktop layout ─────────────────────── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {sidebarEl}
        {mapEl}
      </div>

      {/* ── Mobile layout ──────────────────────── */}
      <div className="md:hidden flex flex-1 overflow-hidden flex-col">
        {mobileView === 'map' && (
          <div className="flex-1 relative">{mapEl}</div>
        )}
        {mobileView === 'list' && (
          <div className="flex flex-1 overflow-hidden">
            {React.cloneElement(sidebarEl, { isOpen: true })}
          </div>
        )}
        {mobileView === 'report' && (
          <ReportView
            onSubmit={handleSubmit}
            onViewMap={() => setMobileView('map')}
          />
        )}
      </div>

      {/* ── Add Item Modal ─────────────────────── */}
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
    </div>
  )
}
