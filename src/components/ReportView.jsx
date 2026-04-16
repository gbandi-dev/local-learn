import { useState, useRef, useEffect } from 'react'

const CATEGORIES = ['Nature', 'Workshop', 'Culture', 'Sports', 'Library', 'Other']
const CATEGORY_JA = {
  Nature: '自然', Workshop: 'ワーク', Culture: '文化',
  Sports: '運動', Library: '図書', Other: 'その他',
}
const LANGS = ['Japanese', 'English', 'Other']
const EMPTY_FORM = { name: '', name_ja: '', description: '', category: '', languages: ['Japanese'] }

// ── Icons ──────────────────────────────────────────────────────────────────
function CameraIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
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

// ── Success screen ──────────────────────────────────────────────────────────
function SuccessScreen({ onReset, onViewMap }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200 flex items-center justify-center mb-5">
        <CheckIcon className="w-10 h-10 text-teal-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Submitted!</h2>
      <p className="text-gray-500 mt-1 text-sm">登録しました · ありがとうございます</p>
      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button
          onClick={onReset}
          className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 active:scale-95 transition-all"
        >
          Add Another
        </button>
        <button
          onClick={onViewMap}
          className="flex-1 py-3 bg-teal-700 text-white rounded-xl text-sm font-bold active:scale-95 transition-all"
        >
          View Map
        </button>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ReportView({ onSubmit, onViewMap }) {
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile,    setPhotoFile]    = useState(null)
  const [coords,       setCoords]       = useState(null)
  const [locStatus,    setLocStatus]    = useState('finding') // finding | found | error
  const [type,         setType]         = useState(null)      // 'spot' | 'mentor'
  const [form,         setForm]         = useState(EMPTY_FORM)
  const [submitting,   setSubmitting]   = useState(false)
  const [done,         setDone]         = useState(false)
  const [formError,    setFormError]    = useState(null)

  const cameraRef  = useRef()
  const galleryRef = useRef()

  // Auto-detect GPS on mount
  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus('error'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocStatus('found')
      },
      () => setLocStatus('error'),
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }, [])

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  function toggleLang(lang) {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter((l) => l !== lang)
        : [...f.languages, lang],
    }))
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.category || !type) return
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
    setDone(false)
    setForm(EMPTY_FORM)
    setPhotoPreview(null)
    setPhotoFile(null)
    setType(null)
    setFormError(null)
  }

  if (done) return <SuccessScreen onReset={reset} onViewMap={onViewMap} />

  const canSubmit = form.name.trim() && form.category && type && !submitting

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-24">

      {/* ── Photo capture ──────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        {/* Hidden file inputs */}
        <input ref={cameraRef}  type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        <input ref={galleryRef} type="file" accept="image/*"                       className="hidden" onChange={handlePhoto} />

        {photoPreview ? (
          <div className="relative">
            <img src={photoPreview} alt="preview" className="w-full h-52 object-cover" />
            <button
              onClick={() => { setPhotoPreview(null); setPhotoFile(null) }}
              className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="mx-4 my-4 border-2 border-dashed border-gray-200 rounded-2xl h-40 flex flex-col items-center justify-center gap-2 bg-gray-50">
            <CameraIcon className="w-8 h-8 text-gray-300" />
            <p className="text-xs text-gray-400">Add a photo (optional)</p>
          </div>
        )}

        <div className="flex gap-3 px-4 pb-4">
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-teal-600 text-teal-700 font-semibold text-sm py-2.5 rounded-xl active:scale-95 transition-all"
          >
            <CameraIcon className="w-4 h-4" />
            Take Photo
          </button>
          <button
            onClick={() => galleryRef.current?.click()}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold text-sm py-2.5 rounded-xl active:scale-95 transition-all"
          >
            From Library
          </button>
        </div>
      </div>

      {/* ── GPS Location ───────────────────────── */}
      <div className="mx-4 mt-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Location / 場所</p>
        {locStatus === 'finding' && (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="text-sm text-gray-500">Detecting location… / 位置情報を取得中</span>
          </div>
        )}
        {locStatus === 'found' && coords && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-green-700">GPS location found</p>
              <p className="text-xs font-mono text-green-600">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>
            </div>
          </div>
        )}
        {locStatus === 'error' && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700">Location unavailable</p>
              <p className="text-xs text-amber-600">Will use town centre as default / デフォルト位置を使用</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Type selector ──────────────────────── */}
      <div className="mx-4 mt-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">I'm adding a… / 種類</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'spot',   label: 'Learning Spot',     ja: '学習スポット',   color: 'blue' },
            { id: 'mentor', label: 'Community Mentor',  ja: 'メンター',       color: 'orange' },
          ].map((t) => {
            const active = type === t.id
            const cls = active
              ? t.color === 'blue'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-orange-500 border-orange-500 text-white'
              : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`py-4 rounded-2xl border-2 text-sm font-bold transition-all active:scale-95 ${cls}`}
              >
                <span className={`block text-base mb-0.5 ${active ? '' : t.color === 'blue' ? 'text-blue-500' : 'text-orange-500'}`}>
                  {t.id === 'spot' ? 'S' : 'M'}
                </span>
                <span className="block text-xs">{t.label}</span>
                <span className={`block text-xs mt-0.5 ${active ? 'opacity-70' : 'text-gray-400'}`}>{t.ja}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Name EN ────────────────────────────── */}
      <div className="mx-4 mt-5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          Name <span className="text-red-400 normal-case font-normal">required</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
          placeholder="e.g. Kitahiroshima Nature Trail"
        />
      </div>

      {/* ── Name JA ────────────────────────────── */}
      <div className="mx-4 mt-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          名前 (Japanese)
        </label>
        <input
          type="text"
          value={form.name_ja}
          onChange={(e) => set('name_ja', e.target.value)}
          className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
          placeholder="例：北広島 自然トレイル"
        />
      </div>

      {/* ── Category ───────────────────────────── */}
      <div className="mx-4 mt-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Category / カテゴリ <span className="text-red-400 normal-case font-normal">required</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const active = form.category === cat
            return (
              <button
                key={cat}
                onClick={() => set('category', cat)}
                className={`py-3 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95 ${
                  active ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <span className="block">{cat}</span>
                <span className={`block text-xs mt-0.5 ${active ? 'text-teal-200' : 'text-gray-400'}`}>{CATEGORY_JA[cat]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Description ────────────────────────── */}
      <div className="mx-4 mt-5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          Description / 説明
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none bg-white"
          placeholder="What makes this place or person special?…"
        />
      </div>

      {/* ── Languages ──────────────────────────── */}
      <div className="mx-4 mt-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Languages / 対応言語</p>
        <div className="flex gap-4 flex-wrap">
          {LANGS.map((lang) => (
            <label key={lang} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.languages.includes(lang)}
                onChange={() => toggleLang(lang)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      {/* ── Error ──────────────────────────────── */}
      {formError && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
          {formError}
        </div>
      )}

      {/* ── Submit ─────────────────────────────── */}
      <div className="mx-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 bg-teal-700 text-white font-bold text-sm rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg shadow-teal-200"
        >
          {submitting ? 'Submitting… / 送信中' : 'Submit Entry / 送信する'}
        </button>
      </div>

    </div>
  )
}
