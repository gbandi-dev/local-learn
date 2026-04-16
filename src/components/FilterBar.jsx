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
    <div className="px-2 py-2 border-b border-gray-100 flex flex-wrap gap-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategory(cat.id)}
          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
            category === cat.id
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.en}
          <span className="ml-1 opacity-60">{cat.ja}</span>
        </button>
      ))}
    </div>
  )
}
