import { useState, useEffect, useRef } from 'react'

const CATEGORIES = ['Nature', 'Workshop', 'Culture', 'Sports', 'Library', 'Other']
const CATEGORY_JA = { Nature: '自然', Workshop: 'ワーク', Culture: '文化', Sports: '運動', Library: '図書', Other: 'その他' }
const LANG_OPTIONS = ['Japanese', 'English', 'Other']

const EMPTY_SPOT = {
  username:           '',
  'area-description': '',
  category:           '',
  'recommended-for':  [],
}
const EMPTY_MENTOR = {
  name:               '',
  'what-i-can-teach': '',
  languages:          'Japanese',
  'available-when':   '',
}

function CameraIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

export default function AddItemModal({ type, coords: initialCoords, onClose, onSuccess, onSubmit }) {
  const isSpot = type === 'spot'
  const [form,         setForm]         = useState(isSpot ? EMPTY_SPOT : EMPTY_MENTOR)
  const [coords,       setCoords]       = useState(initialCoords)
  const [geoLoading,   setGeoLoading]   = useState(false)
  const [geoError,     setGeoError]     = useState(null)
  const [submitting,   setSubmitting]   = useState(false)
  const [error,        setError]        = useState(null)
  const [done,         setDone]         = useState(false)
  const [photoFile,    setPhotoFile]    = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const cameraRef = useRef()

  // Lock body scroll while modal is open (prevents iOS background scroll bleed)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setGeoError('このブラウザは位置情報をサポートしていません / Geolocation not supported')
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoLoading(false)
      },
      () => {
        setGeoError('位置情報の取得に失敗しました / Could not get location')
        setGeoLoading(false)
      },
      { timeout: 10000 }
    )
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const name = isSpot ? form.username : form.name
    if (!name?.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(type, { ...form, photoFile }, coords)
      setDone(true)
      setTimeout(() => { onSuccess(); onClose() }, 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const nameVal = isSpot ? form.username : form.name

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 ${isSpot ? 'bg-blue-600' : 'bg-orange-500'} rounded-t-2xl sm:rounded-t-2xl`}>
          <div>
            <h2 className="font-bold text-white text-base">{isSpot ? 'まちの場所を追加' : 'まちの人を追加'}</h2>
            <p className="text-white/70 text-xs mt-0.5">{isSpot ? 'Place in Town' : 'Person in Town'}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5" style={{ WebkitOverflowScrolling: 'touch' }}>

          {/* Location */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">場所 / Location</p>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="flex-1 text-sm font-mono text-green-800">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
            </div>
            <button
              type="button"
              onClick={handleGeolocate}
              disabled={geoLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-teal-200 bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100 active:scale-95 transition-all disabled:opacity-50"
            >
              {geoLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="9" strokeOpacity="0.3"/>
                </svg>
              )}
              <span>現在地を使う / Use My Location</span>
            </button>
            {geoError && <p className="mt-1 text-xs text-red-600">{geoError}</p>}
          </div>

          {/* Name / Username */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              {isSpot ? 'ユーザー名 / Username' : '名前 / Name'}
              <span className="text-red-400 normal-case font-normal ml-1">必須 / required</span>
            </label>
            <input
              type="text"
              value={nameVal}
              onChange={(e) => set(isSpot ? 'username' : 'name', e.target.value)}
              required
              className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              placeholder={isSpot ? 'e.g. yamada_taro' : 'e.g. Hanako Yamada'}
            />
          </div>

          {/* Category (spots only) */}
          {isSpot && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">カテゴリ / Category</p>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const active = form.category === cat
                  return (
                    <button key={cat} type="button" onClick={() => set('category', cat)}
                      className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95 ${
                        active ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      <span className="block">{CATEGORY_JA[cat]}</span>
                      <span className={`block text-xs ${active ? 'text-teal-200' : 'text-gray-400'}`}>{cat}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              {isSpot ? 'エリアの説明 / Area Description' : '教えられること / What I Can Teach'}
            </label>
            <textarea
              value={isSpot ? form['area-description'] : form['what-i-can-teach']}
              onChange={(e) => set(isSpot ? 'area-description' : 'what-i-can-teach', e.target.value)}
              rows={3}
              className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
              placeholder={isSpot ? '場所の説明を入力…' : '教えられることを入力…'}
            />
          </div>

          {/* Languages (mentors only) */}
          {!isSpot && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">言語 / Language</p>
              <div className="flex gap-3 flex-wrap">
                {LANG_OPTIONS.map((lang) => (
                  <button key={lang} type="button" onClick={() => set('languages', lang)}
                    className={`px-4 py-2 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95 ${
                      form.languages === lang ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 text-gray-600'
                    }`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Available When (mentors only) */}
          {!isSpot && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">活動できる時間 / Available When</label>
              <input
                type="text"
                value={form['available-when']}
                onChange={(e) => set('available-when', e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                placeholder="例：週末・午後 / e.g. Weekends, afternoons"
              />
            </div>
          )}

          {/* Photo */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">写真 / Photo <span className="text-gray-400 normal-case font-normal">(任意 / optional)</span></p>
            <input ref={cameraRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={photoPreview} alt="preview" className="w-full h-40 object-cover" />
                <button type="button" onClick={() => { setPhotoPreview(null); setPhotoFile(null) }}
                  className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">×</button>
              </div>
            ) : (
              <button type="button" onClick={() => cameraRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-teal-300 bg-teal-50 rounded-xl py-6 active:scale-95 transition-all">
                <CameraIcon className="w-7 h-7 text-teal-500" />
                <span className="text-sm font-bold text-teal-700">写真を追加</span>
                <span className="text-xs text-teal-500">Add a Photo</span>
              </button>
            )}
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{error}</div>}
          {done  && <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700 font-medium">保存しました！/ Saved! Refreshing map…</div>}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 active:scale-95 transition-all">
            キャンセル
          </button>
          <button onClick={handleSubmit} disabled={submitting || done || !nameVal?.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-teal-700 hover:bg-teal-800">
            {submitting ? '保存中…' : '保存する'}
          </button>
        </div>
      </div>
    </div>
  )
}
