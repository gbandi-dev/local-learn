import FilterBar from './FilterBar'
import DetailPanel from './DetailPanel'

const TABS = [
  { id: 'all',     label: 'All',     ja: 'すべて' },
  { id: 'spots',   label: 'Spots',   ja: 'スポット' },
  { id: 'mentors', label: 'Mentors', ja: 'メンター' },
]

export default function Sidebar({
  spots, mentors, items, loading, error,
  selected, onSelect, category, onCategory,
  tab, onTab, isOpen, onBack,
  onAddSpot, onAddMentor,
}) {
  return (
    <div
      className={`
        ${isOpen ? 'flex' : 'hidden'} md:flex
        absolute inset-0 md:relative z-20 md:z-auto
        w-full md:w-80 flex-col bg-gray-50
        border-r border-gray-200 shrink-0 overflow-hidden
      `}
    >
      {selected ? (
        <DetailPanel item={selected} onBack={onBack} />
      ) : (
        <>
          {/* Stats panel */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-white border-b border-gray-200">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-700 leading-none">{spots.length}</p>
              <p className="text-xs font-semibold text-blue-600 mt-1">Learning Spots</p>
              <p className="text-xs text-blue-400">学習スポット</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-orange-600 leading-none">{mentors.length}</p>
              <p className="text-xs font-semibold text-orange-600 mt-1">Mentors</p>
              <p className="text-xs text-orange-400">メンター</p>
            </div>
          </div>

          {/* Add buttons (mobile) */}
          <div className="sm:hidden flex gap-2 px-3 py-2 bg-white border-b border-gray-200">
            <button
              onClick={onAddSpot}
              className="flex-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2 rounded-lg transition-all"
            >
              + Add Spot
            </button>
            <button
              onClick={onAddMentor}
              className="flex-1 text-xs font-semibold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white py-2 rounded-lg transition-all"
            >
              + Add Mentor
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-white border-b border-gray-200">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onTab(t.id)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                  tab === t.id
                    ? 'border-b-2 border-blue-700 text-blue-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.label}
                <span className="ml-1 opacity-60">{t.ja}</span>
              </button>
            ))}
          </div>

          {/* Category filter */}
          <FilterBar category={category} onCategory={onCategory} />

          {/* Item list */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && !loading && (
              <div className="m-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                Could not reach API — showing demo data
              </div>
            )}
            {!loading && items.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p className="text-sm font-medium">No results</p>
                <p className="text-xs mt-1">データがありません</p>
              </div>
            )}
            {items.map((item, i) => (
              <ItemCard key={item.id ?? i} item={item} onSelect={onSelect} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ItemCard({ item, onSelect }) {
  const p = item.properties ?? {}
  const isSpot = item._type === 'spot'
  const color  = isSpot ? 'bg-blue-500' : 'bg-orange-500'
  const label  = isSpot ? 'S' : 'M'

  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full text-left px-3 py-3 border-b border-gray-100 hover:bg-white active:bg-gray-100 flex items-start gap-3 transition-colors"
    >
      {/* Badge */}
      <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
        {label}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
            {p.name ?? 'Unnamed'}
          </p>
          {item._demo && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium shrink-0">
              Demo
            </span>
          )}
        </div>
        {p.name_ja && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{p.name_ja}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {p.category && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
              isSpot ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {p.category}
            </span>
          )}
          {p.languages && (
            <span className="text-xs text-gray-400">
              {(Array.isArray(p.languages) ? p.languages : [p.languages]).join(', ')}
            </span>
          )}
        </div>
      </div>

      <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
