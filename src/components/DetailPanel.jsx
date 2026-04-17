import { useState, useEffect } from 'react'
import Comments from './Comments'
import { fetchItemPhotoUrl } from '../api/cms'

const TYPE = {
  spot:   { ja: 'まちの場所', en: 'Place in Town',   bg: 'bg-blue-700',    pill: 'bg-blue-100 text-blue-700'       },
  mentor: { ja: 'まちの人',   en: 'Person in Town',  bg: 'bg-orange-500',  pill: 'bg-orange-100 text-orange-700'   },
  log:    { ja: '学びの記録', en: 'Learning Record', bg: 'bg-emerald-700', pill: 'bg-emerald-100 text-emerald-700' },
}

const CATEGORY_JA = {
  Nature:   '自然',
  Workshop: 'ワークショップ',
  Culture:  '文化',
  Sports:   'スポーツ',
  Library:  '図書館',
  Other:    'その他',
}

const LANG_JA = {
  Japanese: '日本語',
  English:  '英語',
  Other:    'その他',
}



export default function DetailPanel({ item, onBack }) {
  const p    = item.properties ?? {}
  const type = item._type ?? 'spot'
  const meta = TYPE[type] ?? TYPE.spot
  const isLog = type === 'log'

  const [cmsPhotoUrl, setCmsPhotoUrl] = useState(null)
  useEffect(() => {
    setCmsPhotoUrl(null)
    if (isLog) {
      // Log photos come embedded in GeoJSON properties
      const url = p.photo?.[0]?.url ?? null
      if (url) setCmsPhotoUrl(url)
      return
    }
    if (!item.id || item._local || item._demo) return
    fetchItemPhotoUrl(type, item.id)
      .then((url) => { if (url) setCmsPhotoUrl(url) })
      .catch(() => null)
  }, [item.id, type])

  const rawName = p.name ?? p.username
  const name = Array.isArray(rawName) ? rawName[0] : (rawName ?? meta.ja)
  const description = p.description ?? p['area-description'] ?? p['what-i-can-teach']
  const langs = Array.isArray(p.languages) ? p.languages : p.languages ? [p.languages] : []

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
        {cmsPhotoUrl ? (
          <img src={cmsPhotoUrl} alt={name} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">写真なし / No photo</span>
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Badge */}
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${meta.pill}`}>
            {meta.ja} / {meta.en}
          </span>

          {/* Name */}
          <h2 className="text-lg font-bold text-gray-900 leading-snug">{name}</h2>

          {/* ── Log fields ── */}
          {isLog && (
            <>
              {p.category && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">カテゴリ / Category</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {CATEGORY_JA[p.category] ? `${CATEGORY_JA[p.category]} / ${p.category}` : p.category}
                  </p>
                </div>
              )}
              {p.role && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">役割 / Role</p>
                  <p className="text-sm text-gray-800 font-medium">{p.role}</p>
                </div>
              )}
              {p.date && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">日付 / Date</p>
                  <p className="text-sm text-gray-800">{p.date.slice(0, 10)}</p>
                </div>
              )}
              {p['spot-visited'] && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">訪問した場所 / Spot Visited</p>
                  <p className="text-sm text-gray-800">{p['spot-visited']}</p>
                </div>
              )}
              {p['what-i-learned'] && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">学んだこと / What I Learned</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{p['what-i-learned']}</p>
                </div>
              )}
              {p.teacher && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">先生へのメモ / Note to Teacher</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.teacher}</p>
                </div>
              )}
            </>
          )}

          {/* ── Spot / Mentor fields ── */}
          {!isLog && (
            <>
              {p.category && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">カテゴリ / Category</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {CATEGORY_JA[p.category] ? `${CATEGORY_JA[p.category]} / ${p.category}` : p.category}
                  </p>
                </div>
              )}
              {description && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">説明 / Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                </div>
              )}
              {p['recommended-for'] && p['recommended-for'].length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-2">おすすめ対象 / Recommended For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(p['recommended-for']) ? p['recommended-for'] : [p['recommended-for']]).map((r) => (
                      <span key={r} className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
              )}
              {langs.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-2">言語 / Languages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {langs.map((lang) => (
                      <span key={lang} className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full">
                        {LANG_JA[lang] ? `${LANG_JA[lang]} / ${lang}` : lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {p['available-when'] && (
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 font-semibold mb-1">活動できる時間 / Available When</p>
                  <p className="text-sm text-gray-700">{p['available-when']}</p>
                </div>
              )}
            </>
          )}

          {item._demo && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              ベータデータです。CMSにデータが登録されると自動的に置き換わります。
              <span className="block opacity-60 mt-0.5">Beta data — replaced once CMS is populated.</span>
            </div>
          )}

          {!item._demo && item.id && !isLog && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
              <Comments itemId={item.id} itemType={type} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
