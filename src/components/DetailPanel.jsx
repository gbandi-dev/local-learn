const TYPE = {
  spot:   { en: 'Learning Spot',      ja: '学習スポット',      bg: 'bg-blue-700',   pill: 'bg-blue-100 text-blue-700' },
  mentor: { en: 'Community Mentor',   ja: 'コミュニティメンター', bg: 'bg-orange-500', pill: 'bg-orange-100 text-orange-700' },
}

export default function DetailPanel({ item, onBack }) {
  const p    = item.properties ?? {}
  const meta = TYPE[item._type] ?? TYPE.spot
  const langs = Array.isArray(p.languages) ? p.languages : p.languages ? [p.languages] : []

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      {/* Coloured header strip */}
      <div className={`${meta.bg} px-4 py-3 flex items-center gap-3`}>
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-white/60 text-xs">|</span>
        <span className="text-white text-xs font-semibold">{meta.en}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Photo */}
        {p.photo ? (
          <img src={p.photo} alt={p.name} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No photo available</span>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Type badge */}
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${meta.pill}`}>
            {meta.en} · {meta.ja}
          </span>

          {/* Name */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{p.name ?? 'Unnamed'}</h2>
            {p.name_ja && <p className="text-sm text-gray-500 mt-0.5">{p.name_ja}</p>}
          </div>

          {/* Category */}
          {p.category && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Category / カテゴリ</p>
              <p className="text-sm text-gray-800 font-medium mt-1">{p.category}</p>
            </div>
          )}

          {/* Description */}
          {p.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">About / 概要</p>
              <p className="text-sm text-gray-700 leading-relaxed">{p.description}</p>
            </div>
          )}

          {/* Languages */}
          {langs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Languages / 対応言語</p>
              <div className="flex flex-wrap gap-1.5">
                {langs.map((lang) => (
                  <span key={lang} className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Demo notice */}
          {item._demo && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <strong>Demo data</strong> — replaced automatically once CMS is populated.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
