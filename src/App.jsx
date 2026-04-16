import { useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import { useGeoData } from './hooks/useGeoData'

export default function App() {
  const { spots, mentors, loading, error, usingDemo } = useGeoData()

  const [selected, setSelected]       = useState(null)
  const [category, setCategory]       = useState('all')
  const [tab, setTab]                 = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Build a unified, filtered item list for the sidebar
  const allItems = [
    ...spots.map((f) => ({ ...f, _type: f._type ?? 'spot' })),
    ...mentors.map((f) => ({ ...f, _type: f._type ?? 'mentor' })),
  ]

  const filtered = allItems.filter((item) => {
    if (tab === 'spots'   && item._type !== 'spot')   return false
    if (tab === 'mentors' && item._type !== 'mentor') return false
    if (category !== 'all') {
      const cat = (item.properties?.category ?? '').toLowerCase()
      if (cat !== category.toLowerCase()) return false
    }
    return true
  })

  function handleSelect(item) {
    setSelected(item)
    setSidebarOpen(false) // close mobile overlay after selecting from map
  }

  function handleSidebarSelect(item) {
    setSelected(item)
    // Keep sidebar open on mobile so the detail panel is visible
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md z-10">
        <div>
          <h1 className="font-bold text-base leading-tight tracking-tight">
            Local Learn
          </h1>
          <p className="text-emerald-200 text-xs">ローカルラーン · 北広島町</p>
        </div>

        <div className="flex items-center gap-2">
          {usingDemo && (
            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
              Demo
            </span>
          )}
          {/* Mobile toggle — hidden on md+ */}
          <button
            className="md:hidden text-white text-sm font-medium border border-white/40 px-3 py-1 rounded-full"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? 'Map' : 'List'}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Backdrop for mobile sidebar */}
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
          onSelect={handleSidebarSelect}
          category={category}
          onCategory={setCategory}
          tab={tab}
          onTab={setTab}
          isOpen={sidebarOpen}
          onBack={() => setSelected(null)}
        />

        <MapView
          spots={spots}
          mentors={mentors}
          selected={selected}
          onSelect={handleSelect}
          category={category}
        />
      </div>
    </div>
  )
}
