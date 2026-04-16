const CATEGORIES = [
  { id: 'all',      en: 'All',      ja: 'すべて' },
  { id: 'Nature',   en: 'Nature',   ja: '自然' },
  { id: 'Workshop', en: 'Workshop', ja: 'ワーク' },
  { id: 'Culture',  en: 'Culture',  ja: '文化' },
  { id: 'Sports',   en: 'Sports',   ja: '運動' },
  { id: 'Library',  en: 'Library',  ja: '図書' },
  { id: 'Other',    en: 'Other',    ja: 'その他' },
]

export default function FilterBar({ category, onCategory }) {
  return (
    <div className="px-3 py-2 bg-white border-b border-gray-200 flex gap-1.5 overflow-x-auto scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategory(cat.id)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
            category === cat.id
              ? 'bg-teal-700 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.en}
          <span className={`ml-1 ${category === cat.id ? 'text-teal-200' : 'text-gray-400'}`}>
            {cat.ja}
          </span>
        </button>
      ))}
    </div>
  )
}
