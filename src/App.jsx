import { useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import AddItemModal from './components/AddItemModal'
import { useGeoData } from './hooks/useGeoData'

export default function App() {
  const { spots, mentors, loading, error, usingDemo, refresh } = useGeoData()

  const [selected, setSelected]         = useState(null)
  const [category, setCategory]         = useState('all')
  const [tab, setTab]                   = useState('all')
  const [sidebarOpen, setSidebarOpen]   = useState(false)

  // Adding flow: pick location on map, then fill form
  const [addingType, setAddingType]     = useState(null)   // 'spot' | 'mentor' | null
  const [pickingLocation, setPickingLocation] = useState(false)
  const [draftCoords, setDraftCoords]   = useState(null)   // { lat, lng }

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
    setSidebarOpen(false) // close sidebar on mobile so map is visible
  }

  function cancelAdding() {
    setAddingType(null)
    setPickingLocation(false)
    setDraftCoords(null)
  }

  function handleMapClick(coords) {
    if (!pickingLocation) return
    setDraftCoords(coords)
    setPickingLocation(false)
  }

  function handleFormSuccess() {
    setAddingType(null)
    setDraftCoords(null)
    refresh()
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md z-10">
        <div>
          <h1 className="font-bold text-base leading-tight tracking-tight">Local Learn</h1>
          <p className="text-emerald-200 text-xs">ローカルラーン · 北広島町</p>
        </div>

        <div className="flex items-center gap-2">
          {usingDemo && (
            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
              Demo
            </span>
          )}

          {/* Add buttons */}
          {!pickingLocation ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => startAdding('spot')}
                className="hidden sm:flex items-center gap-1 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-full transition-colors"
              >
                + Spot
              </button>
              <button
                onClick={() => startAdding('mentor')}
                className="hidden sm:flex items-center gap-1 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1.5 rounded-full transition-colors"
              >
                + Mentor
              </button>
              <button
                className="md:hidden text-white text-sm font-medium border border-white/40 px-3 py-1 rounded-full"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                {sidebarOpen ? 'Map' : 'List'}
              </button>
            </div>
          ) : (
            <button
              onClick={cancelAdding}
              className="text-xs font-medium border border-white/60 text-white px-3 py-1.5 rounded-full"
            >
              Cancel
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
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
          onSelect={(item) => {
            setSelected(item)
            setSidebarOpen(false)
          }}
          onMapClick={handleMapClick}
          pickingLocation={pickingLocation}
          category={category}
        />
      </div>

      {/* Add Item Modal — shown once location is picked */}
      {addingType && draftCoords && (
        <AddItemModal
          type={addingType}
          coords={draftCoords}
          onClose={cancelAdding}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
