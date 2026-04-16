import FilterBar from './FilterBar'
import DetailPanel from './DetailPanel'

const TABS = [
  { id: 'all',     label: 'All / すべて' },
  { id: 'spots',   label: 'Spots' },
  { id: 'mentors', label: 'Mentors' },
]

export default function Sidebar({
  items, loading, error, selected, onSelect,
  category, onCategory, tab, onTab,
  isOpen, onBack,
}) {
  return (
    <div
      className={`
        ${isOpen ? 'flex' : 'hidden'} md:flex
        absolute inset-0 md:relative
        z-20 md:z-auto
        w-full md:w-80
        flex-col bg-white border-r border-gray-200 shrink-0 overflow-hidden
      `}
    >
      {selected ? (
        <DetailPanel item={selected} onBack={onBack} />
      ) : (
        <>
          <FilterBar category={category} onCategory={onCategory} />

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onTab(t.id)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  tab === t.id
                    ? 'border-b-2 border-emerald-600 text-emerald-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <p className="p-4 text-sm text-gray-400 text-center">
                Loading… / 読み込み中
              </p>
            )}
            {error && !loading && (
              <p className="p-4 text-sm text-red-500 text-center">
                Could not reach API
              </p>
            )}
            {!loading && items.length === 0 && (
              <div className="p-6 text-center text-gray-400">
                <p className="text-sm">No results</p>
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

  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full text-left px-3 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-start gap-3 transition-colors"
    >
      <span
        className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
          isSpot ? 'bg-blue-500' : 'bg-orange-500'
        }`}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {p.name ?? 'Unnamed'}
        </p>
        {p.name_ja && (
          <p className="text-xs text-gray-400 truncate">{p.name_ja}</p>
        )}
        {p.category && (
          <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
        )}
      </div>
    </button>
  )
}
