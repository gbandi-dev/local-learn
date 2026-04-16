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
function IconPlus({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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

const NAV = [
  { id: 'map',    ja: '地図',       en: 'Map',     Icon: IconMap    },
  { id: 'list',   ja: 'まちの人',   en: 'People',  Icon: IconPeople },
  { id: 'report', ja: '学びの記録', en: 'Records', Icon: IconNote   },
]

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { spots, mentors, loading, error, usingDemo, refresh } = useGeoData()

  const [localSpots,   setLocalSpots]   = useState([])
  const [localMentors, setLocalMentors] = useState([])

  const allSpots   = [...spots,   ...localSpots]
  const allMentors = [...mentors, ...localMentors]

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
    setAddingType(null); setPickingLocation(false); setDraftCoords(null)
  }
  function goTab(id) {
    setMobileView(id)
    if (id === 'list') setTab('mentors')
    if (id === 'map')  setTab('all')
  }

  const mapEl = (
    <MapView
      spots={allSpots} mentors={allMentors} selected={selected}
      onSelect={(item) => { setSelected(item); setMobileView('list') }}
      onMapClick={(coords) => { if (!pickingLocation) return; setDraftCoords(coords); setPickingLocation(false) }}
      pickingLocation={pickingLocation}
      category={category}
    />
  )

  const sidebarEl = (
    <Sidebar
      spots={allSpots} mentors={allMentors} items={allItems}
      loading={loading} error={error} selected={selected}
      onSelect={setSelected} category={category} onCategory={setCategory}
      tab={tab} onTab={setTab} isOpen={true}
      onBack={() => setSelected(null)}
      onAddSpot={() => startAdding('spot')}
      onAddMentor={() => startAdding('mentor')}
    />
  )

  return (
    <div className="flex justify-center bg-gray-300 h-screen">
    <div className="flex h-screen w-full max-w-screen-lg overflow-hidden shadow-2xl">

      {/* ── Desktop left nav sidebar ───────────── */}
      <aside className="hidden md:flex flex-col w-52 bg-teal-800 text-white shrink-0">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-teal-700/60">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-white overflow-hidden shrink-0">
              <img src={`${import.meta.env.BASE_URL}mascot.png`} alt="mascot" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">ローカルラーン</p>
              <p className="text-teal-300 text-xs">Local Learn</p>
            </div>
          </div>
          <p className="text-teal-400 text-xs mt-1">北広島町 · Kitahiroshimacho</p>
          {usingDemo && (
            <span className="mt-2 inline-block text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">デモ / Demo</span>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ id, ja, en, Icon }) => (
            <button key={id} onClick={() => goTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                mobileView === id
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-teal-200 hover:bg-white/10 hover:text-white'
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              <div>
                <p className="text-sm font-semibold leading-none">{ja}</p>
                <p className="text-xs opacity-60 mt-0.5">{en}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Action buttons */}
        <div className="px-3 pb-5 space-y-2 border-t border-teal-700/60 pt-4">
          {pickingLocation ? (
            <button onClick={cancelAdding}
              className="w-full py-2.5 rounded-xl border border-white/30 text-white text-sm font-semibold">
              キャンセル / Cancel
            </button>
          ) : (
            <>
              <button onClick={() => startAdding('spot')}
                className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 active:scale-95 text-white text-sm font-semibold transition-all">
                <IconPlus className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">場所を追加</p>
                  <p className="text-xs opacity-70">Add a Place</p>
                </div>
              </button>
              <button onClick={() => startAdding('mentor')}
                className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-white text-sm font-semibold transition-all">
                <IconPlus className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">まちの人を追加</p>
                  <p className="text-xs opacity-70">Add a Person</p>
                </div>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ── Mobile header ──────────────────────── */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-lg z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white overflow-hidden shrink-0">
              <img src={`${import.meta.env.BASE_URL}mascot.png`} alt="mascot" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">ローカルラーン</h1>
              <p className="text-teal-200 text-xs">北広島町</p>
            </div>
          </div>
          {usingDemo && <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">デモ</span>}
        </header>

        {/* Mobile top nav tabs */}
        <nav className="bg-white border-b border-gray-200 flex shrink-0 z-10">
          {NAV.map(({ id, ja, en, Icon }) => (
            <button key={id} onClick={() => goTab(id)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-colors relative ${
                mobileView === id ? 'text-teal-700' : 'text-gray-400'
              }`}>
              <Icon className="w-4 h-4" />
              <span className="text-xs font-bold leading-none">{ja}</span>
              <span className="text-xs opacity-50 leading-none">{en}</span>
              {mobileView === id && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-700" />}
            </button>
          ))}
        </nav>

        {/* Mobile content */}
        <div className="flex flex-1 overflow-hidden flex-col">
          {mobileView === 'map'    && <div className="flex-1 relative">{mapEl}</div>}
          {mobileView === 'list'   && <div className="flex flex-1 overflow-hidden">{React.cloneElement(sidebarEl, { isOpen: true })}</div>}
          {mobileView === 'report' && <ReportView onSubmit={handleSubmit} onViewMap={() => setMobileView('map')} />}
        </div>
      </div>

      {/* ── Desktop main area (sidebar + map) ─── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {sidebarEl}
        {mapEl}
      </div>

      {addingType && draftCoords && (
        <AddItemModal
          type={addingType} coords={draftCoords}
          onClose={cancelAdding}
          onSuccess={() => { setAddingType(null); setDraftCoords(null) }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
    </div>
  )
}
