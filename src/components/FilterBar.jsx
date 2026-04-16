const CATEGORIES = [
  { id: 'all',      ja: 'すべて',           en: 'All'      },
  { id: 'Nature',   ja: '自然',             en: 'Nature'   },
  { id: 'Workshop', ja: 'ワークショップ',   en: 'Workshop' },
  { id: 'Culture',  ja: '文化',             en: 'Culture'  },
  { id: 'Sports',   ja: 'スポーツ',         en: 'Sports'   },
  { id: 'Library',  ja: '図書・学習',       en: 'Library'  },
  { id: 'Other',    ja: 'その他',           en: 'Other'    },
]

export default function FilterBar({ category, onCategory }) {
  return (
    <div className="px-3 py-2 bg-white border-b border-gray-200 flex gap-1.5 overflow-x-auto scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategory(cat.id)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
            category === cat.id
              ? 'bg-teal-700 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.ja}
        </button>
      ))}
    </div>
  )
}
