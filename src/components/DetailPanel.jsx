const TYPE_META = {
  spot: {
    en: 'Learning Spot',
    ja: '学習スポット',
    pill: 'bg-blue-100 text-blue-700',
  },
  mentor: {
    en: 'Community Mentor',
    ja: 'コミュニティメンター',
    pill: 'bg-orange-100 text-orange-700',
  },
}

export default function DetailPanel({ item, onBack }) {
  const p = item.properties ?? {}
  const meta = TYPE_META[item._type] ?? TYPE_META.spot

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Back button */}
      <div className="px-3 py-2 border-b border-gray-100">
        <button
          onClick={onBack}
          className="text-sm text-emerald-700 hover:text-emerald-900 font-medium"
        >
          ← Back / 戻る
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Photo */}
        {p.photo && (
          <img
            src={p.photo}
            alt={p.name}
            className="w-full h-40 object-cover rounded-xl"
          />
        )}

        {/* Type badge */}
        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.pill}`}>
          {meta.en} · {meta.ja}
        </span>

        {/* Name */}
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-snug">
            {p.name ?? 'Unnamed'}
          </h2>
          {p.name_ja && (
            <p className="text-sm text-gray-500 mt-0.5">{p.name_ja}</p>
          )}
        </div>

        {/* Category */}
        {p.category && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              Category / カテゴリ
            </p>
            <p className="text-sm text-gray-700">{p.category}</p>
          </div>
        )}

        {/* Description */}
        {p.description && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              About / 概要
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{p.description}</p>
          </div>
        )}

        {/* Languages */}
        {p.languages && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Languages / 対応言語
            </p>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(p.languages) ? p.languages : [p.languages]).map(
                (lang) => (
                  <span
                    key={lang}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {lang}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Demo notice */}
        {item._demo && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
            Demo data — will be replaced once the CMS is populated.
          </div>
        )}
      </div>
    </div>
  )
}
