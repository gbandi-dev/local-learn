import Comments from './Comments'

const TYPE = {
  spot:   { ja: 'まちの場所', en: 'Place in Town',   bg: 'bg-blue-700',   pill: 'bg-blue-100 text-blue-700' },
  mentor: { ja: 'まちの人',   en: 'Person in Town',  bg: 'bg-orange-500', pill: 'bg-orange-100 text-orange-700' },
}

export default function DetailPanel({ item, onBack }) {
  const p    = item.properties ?? {}
  const meta = TYPE[item._type] ?? TYPE.spot

  const name        = p.name ?? p.username ?? meta.ja
  const description = p.description ?? p['area-description'] ?? p['what-i-can-teach']
  const langs = Array.isArray(p.languages)
    ? p.languages
    : p.languages ? [p.languages] : []

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      {/* Header strip */}
      <div className={`${meta.bg} px-4 py-3 flex items-center gap-3`}>
        <button onClick={onBack}
          className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          もどる
        </button>
        <span className="text-white/60 text-xs">|</span>
        <span className="text-white text-xs font-semibold">{meta.ja}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Photo */}
        {p.photo ? (
          <img src={p.photo} alt={name} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">写真なし</span>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Badge */}
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${meta.pill}`}>
            {meta.ja}
          </span>

          {/* Name */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{name}</h2>
          </div>

          {/* Category */}
          {p.category && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400 font-semibold mb-1">カテゴリ</p>
              <p className="text-sm text-gray-800 font-medium">{p.category}</p>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400 font-semibold mb-1">説明</p>
              <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Recommended For */}
          {p['recommended-for'] && p['recommended-for'].length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400 font-semibold mb-2">おすすめ対象</p>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(p['recommended-for']) ? p['recommended-for'] : [p['recommended-for']]).map((r) => (
                  <span key={r} className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full">{r}</span>
                ))}
              </div>
            </div>
          )}

          {/* Languages / Available When */}
          {langs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400 font-semibold mb-2">言語</p>
              <div className="flex flex-wrap gap-1.5">
                {langs.map((lang) => (
                  <span key={lang} className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full">{lang}</span>
                ))}
              </div>
            </div>
          )}
          {p['available-when'] && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400 font-semibold mb-1">活動できる時間</p>
              <p className="text-sm text-gray-700">{p['available-when']}</p>
            </div>
          )}

          {/* Demo notice */}
          {item._demo && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              ベータデータです。CMSにデータが登録されると自動的に置き換わります。
              <span className="block opacity-60 mt-0.5">Beta data — replaced once CMS is populated.</span>
            </div>
          )}

          {/* Comments */}
          {!item._demo && item.id && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
              <Comments itemId={item.id} itemType={item._type ?? 'spot'} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
