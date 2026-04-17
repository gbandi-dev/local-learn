import FilterBar from './FilterBar'
import DetailPanel from './DetailPanel'

const TABS = [
  { id: 'all',     ja: 'すべて',     en: 'All'     },
  { id: 'spots',   ja: 'まちの場所', en: 'Places'  },
  { id: 'mentors', ja: 'まちの人',   en: 'People'  },
  { id: 'logs',    ja: '学びの記録', en: 'Records' },
]

const CATEGORY_JA = {
  Nature:   '自然',
  Workshop: 'ワークショップ',
  Culture:  '文化',
  Sports:   'スポーツ',
  Library:  '図書館',
  Other:    'その他',
}

export default function Sidebar({
  spots, mentors, logs, items, loading, error,
  selected, onSelect, category, onCategory,
  tab, onTab, isOpen, onBack, onHome,
  onAddSpot, onAddMentor,
}) {
  return (
    <div className={`
      ${isOpen ? 'flex' : 'hidden'} md:flex
      relative w-full md:w-80 flex-col bg-gray-50
      border-r border-gray-200 shrink-0 overflow-hidden
    `}>
      {/* Mobile home button */}
      {onHome && (
        <button onClick={onHome}
          className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-teal-700 text-white text-sm font-semibold shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
          <span>地図に戻る</span>
          <span className="text-teal-300 text-xs ml-1">Back to Map</span>
        </button>
      )}

      {selected ? (
        <DetailPanel item={selected} onBack={onBack} />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-white border-b border-gray-200">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-700 leading-none">{spots.length}</p>
              <p className="text-xs font-bold text-blue-700 mt-1">まちの場所</p>
              <p className="text-xs text-blue-400">Places</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-orange-600 leading-none">{mentors.length}</p>
              <p className="text-xs font-bold text-orange-600 mt-1">まちの人</p>
              <p className="text-xs text-orange-400">People</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-emerald-700 leading-none">{(logs ?? []).length}</p>
              <p className="text-xs font-bold text-emerald-700 mt-1">学びの記録</p>
              <p className="text-xs text-emerald-400">Records</p>
            </div>
          </div>

          {/* Add buttons (mobile only) */}
          <div className="sm:hidden flex gap-2 px-3 py-2 bg-white border-b border-gray-200">
            <button onClick={onAddSpot}
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white active:scale-95 transition-all">
              <p className="text-xs font-bold">＋ 場所を追加</p>
              <p className="text-xs opacity-70">Add a Place</p>
            </button>
            <button onClick={onAddMentor}
              className="flex-1 py-2 rounded-lg bg-orange-500 text-white active:scale-95 transition-all">
              <p className="text-xs font-bold">＋ まちの人を追加</p>
              <p className="text-xs opacity-70">Add a Person</p>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-white border-b border-gray-200">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => onTab(t.id)}
                className={`flex-1 py-2.5 transition-colors relative ${
                  tab === t.id ? 'text-teal-700' : 'text-gray-400 hover:text-gray-600'
                }`}>
                <p className="text-xs font-bold leading-none">{t.ja}</p>
                <p className="text-xs opacity-60 mt-0.5">{t.en}</p>
                {tab === t.id && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-700" />}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <FilterBar category={category} onCategory={onCategory} />

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && !loading && (
              <div className="m-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                APIに接続できませんでした。ベータデータを表示しています。
              </div>
            )}
            {!loading && items.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p className="text-sm font-bold">見つかりません</p>
                <p className="text-xs mt-1">No results</p>
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
  const p      = item.properties ?? {}
  const type   = item._type ?? 'spot'
  const color  = type === 'spot' ? 'bg-blue-500' : type === 'log' ? 'bg-emerald-500' : 'bg-orange-500'
  const kanji  = type === 'spot' ? '場' : type === 'log' ? '学' : '人'

  const rawName = p.name ?? p.username
  const displayName = Array.isArray(rawName) ? rawName[0] : (rawName ?? (type === 'log' ? '学びの記録' : type === 'spot' ? 'まちの場所' : 'まちの人'))
  const catJa = CATEGORY_JA[p.category] ?? p.category

  return (
    <button onClick={() => onSelect(item)}
      className="w-full text-left px-3 py-3 border-b border-gray-100 hover:bg-white active:bg-gray-100 flex items-start gap-3 transition-colors">
      <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
        {kanji}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{displayName}</p>
          {item._demo && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium shrink-0">ベータ</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {type === 'log' && p['spot-visited'] && (
            <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-emerald-100 text-emerald-700">
              {p['spot-visited']}
            </span>
          )}
          {type === 'log' && p.date && (
            <span className="text-xs text-gray-400">{p.date.slice(0, 10)}</span>
          )}
          {type !== 'log' && p.category && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
              type === 'spot' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {catJa}{p.category !== catJa ? ` / ${p.category}` : ''}
            </span>
          )}
          {p['what-i-can-teach'] && (
            <span className="text-xs text-gray-400 truncate max-w-[150px]">{p['what-i-can-teach']}</span>
          )}
          {type === 'log' && p['what-i-learned'] && (
            <span className="text-xs text-gray-400 truncate max-w-[180px]">{p['what-i-learned']}</span>
          )}
        </div>
      </div>

      <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
