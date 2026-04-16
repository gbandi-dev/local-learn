import { useState, useRef, useEffect } from 'react'

// ── Data ────────────────────────────────────────────────────────────────────
const TYPES = [
  { id: 'spot',   ja: '学習スポット',       en: 'Learning Spot',    color: '#3b82f6' },
  { id: 'mentor', ja: 'コミュニティメンター', en: 'Community Mentor', color: '#f97316' },
]

const CATEGORIES = [
  { id: 'Nature',   ja: '自然',         en: 'Nature'   },
  { id: 'Workshop', ja: 'ワークショップ', en: 'Workshop' },
  { id: 'Culture',  ja: '文化',         en: 'Culture'  },
  { id: 'Sports',   ja: 'スポーツ',     en: 'Sports'   },
  { id: 'Library',  ja: '図書館',       en: 'Library'  },
  { id: 'Other',    ja: 'その他',       en: 'Other'    },
]

const RECOMMEND_OPTIONS = [
  { id: 'Children',  ja: '子ども',   en: 'Children'  },
  { id: 'Students',  ja: '学生',     en: 'Students'  },
  { id: 'Adults',    ja: '大人',     en: 'Adults'    },
  { id: 'Families',  ja: '家族',     en: 'Families'  },
  { id: 'Everyone',  ja: '全員',     en: 'Everyone'  },
]

const LANG_OPTIONS = [
  { id: 'Japanese', ja: '日本語',   en: 'Japanese' },
  { id: 'English',  ja: '英語',     en: 'English'  },
  { id: 'Other',    ja: 'その他',   en: 'Other'    },
]

const EMPTY_SPOT = {
  username:         '',
  'area-description': '',
  category:         '',
  'recommended-for': [],
}
const EMPTY_MENTOR = {
  name:              '',
  'what-i-can-teach': '',
  languages:         'Japanese',
  'available-when':  '',
}

// ── Icons ────────────────────────────────────────────────────────────────────
function CameraIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
function GalleryIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )
}
function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// ── Section card wrapper ─────────────────────────────────────────────────────
function Section({ num, ja, en, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-gray-50">
        <span className="text-xs font-bold text-gray-400 mr-2">{num}.</span>
        <span className="text-base font-bold text-gray-900">{ja}</span>
        <span className="ml-2 text-xs text-gray-400 font-medium">{en}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// ── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ onReset, onViewMap }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-gray-50">
      <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200 flex items-center justify-center mb-5">
        <CheckIcon className="w-10 h-10 text-teal-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">登録しました</h2>
      <p className="text-gray-500 mt-1 text-sm">Submitted successfully</p>
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button onClick={onReset} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 active:scale-95 transition-all">
          続けて登録<br /><span className="text-xs font-normal text-gray-400">Add Another</span>
        </button>
        <button onClick={onViewMap} className="flex-1 py-3 bg-teal-700 text-white rounded-xl text-sm font-bold active:scale-95 transition-all">
          地図を見る<br /><span className="text-xs font-normal text-teal-200">View Map</span>
        </button>
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ReportView({ onSubmit, onViewMap }) {
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile,    setPhotoFile]    = useState(null)
  const [coords,       setCoords]       = useState(null)
  const [locStatus,    setLocStatus]    = useState('finding')
  const [type,         setType]         = useState(null)
  const [form,         setForm]         = useState(EMPTY_SPOT)
  const [submitting,   setSubmitting]   = useState(false)
  const [done,         setDone]         = useState(false)
  const [formError,    setFormError]    = useState(null)

  const cameraRef  = useRef()
  const galleryRef = useRef()

  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus('error'); return }
    navigator.geolocation.getCurrentPosition(
      (p) => { setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocStatus('found') },
      ()  => setLocStatus('error'),
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }, [])

  function selectType(t) {
    setType(t)
    setForm(t === 'spot' ? EMPTY_SPOT : EMPTY_MENTOR)
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  function toggleRecommend(id) {
    setForm((f) => ({
      ...f,
      'recommended-for': f['recommended-for'].includes(id)
        ? f['recommended-for'].filter((x) => x !== id)
        : [...f['recommended-for'], id],
    }))
  }

  const nameValue = type === 'spot' ? form.username : form.name
  const canSubmit = nameValue?.trim() && type && !submitting

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    setFormError(null)
    try {
      await onSubmit(type, { ...form, photoFile }, coords)
      setDone(true)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setDone(false); setForm(EMPTY_SPOT); setPhotoPreview(null)
    setPhotoFile(null); setType(null); setFormError(null)
  }

  if (done) return <SuccessScreen onReset={reset} onViewMap={onViewMap} />

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 pb-24">

      {/* Scenario banner */}
      <div className="bg-teal-50 border-b border-teal-100 px-4 py-2.5">
        <p className="text-xs text-teal-700 font-medium">
          <span className="font-bold">場所：</span>北広島町，広島県
          <span className="mx-1.5 text-teal-300">·</span>
          <span className="text-teal-600">Kitahiroshimacho, Hiroshima</span>
        </p>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* ── 1. 写真 ─────────────────────────────── */}
        <Section num="1" ja="写真" en="Photo">
          <input ref={cameraRef}  type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
          <input ref={galleryRef} type="file" accept="image/*"                       className="hidden" onChange={handlePhoto} />
          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={photoPreview} alt="preview" className="w-full h-48 object-cover" />
              <button
                onClick={() => { setPhotoPreview(null); setPhotoFile(null) }}
                className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none"
              >×</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => cameraRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-teal-300 bg-teal-50 rounded-xl py-7 active:scale-95 transition-all">
                <CameraIcon className="w-8 h-8 text-teal-500" />
                <span className="text-sm font-bold text-teal-700">写真を撮る</span>
                <span className="text-xs text-teal-500">Take Photo</span>
              </button>
              <button onClick={() => galleryRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl py-7 active:scale-95 transition-all">
                <GalleryIcon className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-bold text-gray-500">ライブラリ</span>
                <span className="text-xs text-gray-400">From Library</span>
              </button>
            </div>
          )}
        </Section>

        {/* ── 2. 種類 ─────────────────────────────── */}
        <Section num="2" ja="種類" en="Type">
          <div className="space-y-2">
            {TYPES.map((t) => {
              const active = type === t.id
              return (
                <button key={t.id} onClick={() => selectType(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                    active ? 'border-gray-300 bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}>
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: active ? t.color : '#d1d5db' }} />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{t.ja}</p>
                    <p className="text-xs text-gray-400">{t.en}</p>
                  </div>
                  {active && (
                    <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: t.color }}>
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </Section>

        {/* ── 3. カテゴリ (spots only) ─────────────── */}
        {type === 'spot' && (
          <Section num="3" ja="カテゴリ" en="Category">
            <div className="space-y-2">
              {CATEGORIES.map((cat) => {
                const active = form.category === cat.id
                return (
                  <button key={cat.id} onClick={() => set('category', cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                      active ? 'border-teal-300 bg-teal-50' : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}>
                    <div className={`w-3 h-3 rounded-full shrink-0 ${active ? 'bg-teal-600' : 'bg-gray-300'}`} />
                    <span className={`text-sm font-bold ${active ? 'text-teal-800' : 'text-gray-700'}`}>{cat.ja}</span>
                    <span className={`text-xs ml-1 ${active ? 'text-teal-500' : 'text-gray-400'}`}>{cat.en}</span>
                    {active && <CheckIcon className="w-4 h-4 text-teal-600 ml-auto" />}
                  </button>
                )
              })}
            </div>
          </Section>
        )}

        {/* ── 4. 名前 / ユーザー名 ────────────────── */}
        {type && (
          <Section
            num={type === 'spot' ? '4' : '3'}
            ja={type === 'spot' ? 'ユーザー名' : '名前'}
            en={type === 'spot' ? 'Username' : 'Name'}
          >
            <input
              type="text"
              value={type === 'spot' ? form.username : form.name}
              onChange={(e) => set(type === 'spot' ? 'username' : 'name', e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              placeholder={type === 'spot' ? '例：yamada_taro' : '例：山田 花子'}
            />
          </Section>
        )}

        {/* ── 5. 説明 ─────────────────────────────── */}
        {type && (
          <Section
            num={type === 'spot' ? '5' : '4'}
            ja={type === 'spot' ? 'エリアの説明' : '教えられること'}
            en={type === 'spot' ? 'Area Description' : 'What I Can Teach'}
          >
            <textarea
              value={type === 'spot' ? form['area-description'] : form['what-i-can-teach']}
              onChange={(e) => set(type === 'spot' ? 'area-description' : 'what-i-can-teach', e.target.value)}
              rows={3}
              className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
              placeholder={type === 'spot' ? 'このスポットについて教えてください…' : 'どんなことを教えられますか…'}
            />
          </Section>
        )}

        {/* ── 6a. おすすめ対象 (spots) ─────────────── */}
        {type === 'spot' && (
          <Section num="6" ja="おすすめ対象" en="Recommended For">
            <div className="space-y-2">
              {RECOMMEND_OPTIONS.map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-100 bg-white cursor-pointer select-none active:scale-[0.98] transition-all">
                  <input
                    type="checkbox"
                    checked={form['recommended-for'].includes(opt.id)}
                    onChange={() => toggleRecommend(opt.id)}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                  <span className="text-sm font-bold text-gray-800">{opt.ja}</span>
                  <span className="text-xs text-gray-400 ml-1">{opt.en}</span>
                </label>
              ))}
            </div>
          </Section>
        )}

        {/* ── 6b. 言語 + 活動時間 (mentors) ───────── */}
        {type === 'mentor' && (
          <>
            <Section num="5" ja="対応言語" en="Languages">
              <div className="space-y-2">
                {LANG_OPTIONS.map((l) => (
                  <button key={l.id} onClick={() => set('languages', l.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                      form.languages === l.id ? 'border-teal-300 bg-teal-50' : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}>
                    <div className={`w-3 h-3 rounded-full shrink-0 ${form.languages === l.id ? 'bg-teal-600' : 'bg-gray-300'}`} />
                    <span className={`text-sm font-bold ${form.languages === l.id ? 'text-teal-800' : 'text-gray-700'}`}>{l.ja}</span>
                    <span className={`text-xs ml-1 ${form.languages === l.id ? 'text-teal-500' : 'text-gray-400'}`}>{l.en}</span>
                    {form.languages === l.id && <CheckIcon className="w-4 h-4 text-teal-600 ml-auto" />}
                  </button>
                ))}
              </div>
            </Section>
            <Section num="6" ja="活動できる時間" en="Available When">
              <input
                type="text"
                value={form['available-when']}
                onChange={(e) => set('available-when', e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                placeholder="例：週末・午後 / Weekends, afternoons"
              />
            </Section>
          </>
        )}

        {/* ── GPS ─────────────────────────────────── */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
          locStatus === 'found'   ? 'bg-green-50 border-green-200' :
          locStatus === 'error'   ? 'bg-amber-50 border-amber-200' :
                                    'bg-gray-50 border-gray-200'
        }`}>
          {locStatus === 'finding' && <div className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin shrink-0" />}
          {locStatus === 'found'   && <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />}
          {locStatus === 'error'   && <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />}
          <div>
            <p className={`text-xs font-bold ${
              locStatus === 'found' ? 'text-green-700' : locStatus === 'error' ? 'text-amber-700' : 'text-gray-500'
            }`}>
              {locStatus === 'finding' ? '位置情報を取得中…' : locStatus === 'found' ? 'GPS取得済み' : '位置情報が利用できません'}
            </p>
            <p className="text-xs text-gray-400">
              {locStatus === 'found' && coords
                ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                : locStatus === 'error'
                ? 'デフォルト位置（北広島町）を使用します'
                : 'Detecting location…'}
            </p>
          </div>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{formError}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 bg-teal-700 text-white font-bold text-base rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-teal-200"
        >
          送信する
          <span className="block text-xs font-normal text-teal-200 mt-0.5">Submit Entry</span>
        </button>

      </div>
    </div>
  )
}
