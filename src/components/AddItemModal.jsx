import { useState } from 'react'

const CATEGORIES = ['Nature', 'Workshop', 'Culture', 'Sports', 'Library', 'Other']
const CATEGORY_JA = { Nature: '自然', Workshop: 'ワーク', Culture: '文化', Sports: '運動', Library: '図書', Other: 'その他' }
const LANGS = ['Japanese', 'English', 'Other']
const EMPTY = { name: '', name_ja: '', description: '', category: '', languages: ['Japanese'] }

export default function AddItemModal({ type, coords, onClose, onSuccess, onSubmit }) {
  const [form,       setForm]       = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)
  const [done,       setDone]       = useState(false)

  const isSpot = type === 'spot'

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }
  function toggleLang(lang) {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter((l) => l !== lang)
        : [...f.languages, lang],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.category) return
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 ${isSpot ? 'bg-blue-600' : 'bg-orange-500'} rounded-t-2xl sm:rounded-t-2xl`}>
          <div>
            <h2 className="font-bold text-white text-base">{isSpot ? 'Add Learning Spot' : 'Add Community Mentor'}</h2>
            <p className="text-white/70 text-xs mt-0.5">{isSpot ? '学習スポットを追加' : 'メンターを追加'}</p>
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

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Name <span className="text-red-400 normal-case font-normal">required</span></label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required
              className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              placeholder="e.g. Kitahiroshima Town Library" />
          </div>

          {/* Name JA */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">名前 (Japanese)</label>
            <input type="text" value={form.name_ja} onChange={(e) => set('name_ja', e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              placeholder="例：北広島町立図書館" />
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Category <span className="text-red-400 normal-case font-normal">required</span></p>
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

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description / 説明</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
              className="w-full border-2 border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
              placeholder="Brief description…" />
          </div>

          {/* Languages */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Languages / 対応言語</p>
            <div className="flex gap-4">
              {LANGS.map((lang) => (
                <label key={lang} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input type="checkbox" checked={form.languages.includes(lang)} onChange={() => toggleLang(lang)} className="w-4 h-4 accent-teal-600 rounded" />
                  {lang}
                </label>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{error}</div>}
          {done  && <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700 font-medium">Saved! Refreshing map…</div>}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 active:scale-95 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting || done || !form.name.trim() || !form.category}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-teal-700 hover:bg-teal-800">
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
