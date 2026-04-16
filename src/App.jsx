import { useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import AddItemModal from './components/AddItemModal'
import { useGeoData } from './hooks/useGeoData'

export default function App() {
  const { spots, mentors, loading, error, usingDemo, refresh } = useGeoData()

  const [selected, setSelected]               = useState(null)
  const [category, setCategory]               = useState('all')
  const [tab, setTab]                         = useState('all')
  const [sidebarOpen, setSidebarOpen]         = useState(false)
  const [addingType, setAddingType]           = useState(null)
  const [pickingLocation, setPickingLocation] = useState(false)
  const [draftCoords, setDraftCoords]         = useState(null)

  const allItems = [
    ...spots.map((f) => ({ ...f, _type: f._type ?? 'spot' })),
    ...mentors.map((f) => ({ ...f, _type: f._type ?? 'mentor' })),
  ]

  const filtered = allItems.filter((item) => {
    if (tab === 'spots'   && item._type !== 'spot')   return false
    if (tab === 'mentors' && item._type !== 'mentor') return false
    if (category !== 'all') {
      if ((item.properties?.category ?? '').toLowerCase() !== category.toLowerCase()) return false
    }
    return true
  })

  function startAdding(type) {
    setAddingType(type)
    setPickingLocation(true)
    setSidebarOpen(false)
  }

  function cancelAdding() {
    setAddingType(null)
    setPickingLocation(false)
    setDraftCoords(null)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Header ─────────────────────────────── */}
      <header className="bg-blue-800 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-lg z-10">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
            LL
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Local Learn</h1>
            <p className="text-blue-300 text-xs">ローカルラーン · 北広島町</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {usingDemo && (
            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">
              Demo
            </span>
          )}

          {!pickingLocation ? (
            <>
              {/* Desktop add buttons */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => startAdding('spot')}
                  className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-3 py-1.5 rounded-lg transition-all"
                >
                  + Spot
                </button>
                <button
                  onClick={() => startAdding('mentor')}
                  className="text-xs font-semibold bg-orange-500 hover:bg-orange-400 active:scale-95 text-white px-3 py-1.5 rounded-lg transition-all"
                >
                  + Mentor
                </button>
              </div>
              {/* Mobile list toggle */}
              <button
                className="md:hidden text-white text-xs font-semibold border border-white/30 px-3 py-1.5 rounded-lg"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                {sidebarOpen ? 'Map' : 'List'}
              </button>
            </>
          ) : (
            <button
              onClick={cancelAdding}
              className="text-xs font-semibold border border-white/40 text-white px-3 py-1.5 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </header>

      {/* ── Body ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          spots={spots}
          mentors={mentors}
          items={filtered}
          loading={loading}
          error={error}
          selected={selected}
          onSelect={setSelected}
          category={category}
          onCategory={setCategory}
          tab={tab}
          onTab={setTab}
          isOpen={sidebarOpen}
          onBack={() => setSelected(null)}
          onAddSpot={() => startAdding('spot')}
          onAddMentor={() => startAdding('mentor')}
        />

        <MapView
          spots={spots}
          mentors={mentors}
          selected={selected}
          onSelect={(item) => { setSelected(item); setSidebarOpen(false) }}
          onMapClick={(coords) => {
            if (!pickingLocation) return
            setDraftCoords(coords)
            setPickingLocation(false)
          }}
          pickingLocation={pickingLocation}
          category={category}
        />
      </div>

      {/* ── Add Item Modal ──────────────────────── */}
      {addingType && draftCoords && (
        <AddItemModal
          type={addingType}
          coords={draftCoords}
          onClose={cancelAdding}
          onSuccess={() => { setAddingType(null); setDraftCoords(null); refresh() }}
        />
      )}
    </div>
  )
}
