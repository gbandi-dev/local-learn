import { useState } from 'react'

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

export default function AddItemModal({ type, coords, onClose, onSuccess, onSubmit }) {
  const isSpot = type === 'spot'
  const [form,       setForm]       = useState(isSpot ? EMPTY_SPOT : EMPTY_MENTOR)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)
  const [done,       setDone]       = useState(false)

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    const name = isSpot ? form.username : form.name
    if (!name?.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(type, form, coords)
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Location */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Location / 場所</p>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-sm font-mono text-green-800">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
            </div>
          </div>

          {/* Name / Username */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              {isSpot ? 'Username / ユーザー名' : 'Name / 名前'}
              <span className="text-red-400 normal-case font-normal ml-1">required</span>
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
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Category / カテゴリ</p>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const active = form.category === cat
                  return (
                    <button key={cat} type="button" onClick={() => set('category', cat)}
                      className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95 ${
                        active ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      <span className="block">{cat}</span>
                      <span className={`block text-xs ${active ? 'text-teal-200' : 'text-gray-400'}`}>{CATEGORY_JA[cat]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              {isSpot ? 'Area Description / エリアの説明' : 'What I Can Teach / 教えられること'}
            </label>
            <textarea
              value={isSpot ? form['area-description'] : form['what-i-can-teach']}
              onChange={(e) => set(isSpot ? 'area-description' : 'what-i-can-teach', e.target.value)}
              rows={3}
              className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
              placeholder={isSpot ? 'Brief description of this spot…' : 'What can you teach or share…'}
            />
          </div>

          {/* Languages (mentors only) */}
          {!isSpot && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Language / 言語</p>
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
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Available When / 活動できる時間</label>
              <input
                type="text"
                value={form['available-when']}
                onChange={(e) => set('available-when', e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                placeholder="e.g. Weekends, afternoons / 週末・午後"
              />
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{error}</div>}
          {done  && <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700 font-medium">Saved! Refreshing map…</div>}
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
