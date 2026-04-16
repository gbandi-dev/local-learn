import { useState } from 'react'
import { createCmsItem, isCmsConfigured } from '../api/cms'

const CATEGORIES = ['Nature', 'Workshop', 'Culture', 'Sports', 'Library', 'Other']
const ALL_LANGUAGES = ['Japanese', 'English', 'Other']

const EMPTY_FORM = {
  name: '',
  name_ja: '',
  description: '',
  category: 'Nature',
  languages: ['Japanese'],
}

export default function AddItemModal({ type, coords, onClose, onSuccess }) {
  const [form, setForm]           = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState(null)
  const [done, setDone]           = useState(false)

  const configured = isCmsConfigured()

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleLanguage(lang) {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter((l) => l !== lang)
        : [...f.languages, lang],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSubmitting(true)
    setError(null)

    try {
      await createCmsItem(type, { ...form, lat: coords.lat, lng: coords.lng })
      setDone(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const typeLabel = type === 'spot' ? 'Learning Spot' : 'Community Mentor'
  const typeColor = type === 'spot' ? 'bg-blue-500' : 'bg-orange-500'

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${typeColor}`} />
            <h2 className="font-semibold text-gray-900 text-sm">
              Add {typeLabel}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* CMS not configured warning */}
          {!configured && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
              <strong>CMS not connected.</strong> Add your Re:Earth API credentials to a{' '}
              <code className="bg-amber-100 px-1 rounded">.env</code> file to save to the CMS.
              See <code className="bg-amber-100 px-1 rounded">.env.example</code> for setup.
            </div>
          )}

          {/* Coordinates (read-only, set by map click) */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Location / 場所
            </label>
            <p className="text-sm text-gray-700 font-mono bg-gray-50 rounded-lg px-3 py-2">
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          </div>

          {/* Name EN */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Name (English) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Kitahiroshima Library"
            />
          </div>

          {/* Name JA */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Name (Japanese) / 名前
            </label>
            <input
              type="text"
              value={form.name_ja}
              onChange={(e) => set('name_ja', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="例：北広島町立図書館"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Description / 説明
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Brief description of this spot or mentor…"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Category / カテゴリ
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Languages / 対応言語
            </label>
            <div className="flex gap-3">
              {ALL_LANGUAGES.map((lang) => (
                <label key={lang} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.languages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                    className="accent-emerald-600"
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 leading-relaxed">
              {error}
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
              Saved to CMS! Refreshing map…
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || done || !form.name.trim()}
            className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Saving…' : 'Save to CMS'}
          </button>
        </div>
      </div>
    </div>
  )
}
