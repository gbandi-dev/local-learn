import { useState, useEffect } from 'react'
import { fetchCmsItems, deleteCmsItem, publishCmsItem } from '../api/cms'

const TABS = [
  { id: 'spot',   ja: 'まちの場所',   en: 'Places'  },
  { id: 'mentor', ja: 'まちの人',     en: 'People'  },
  { id: 'log',    ja: '学びの記録',   en: 'Logs'    },
]

function formatJapaneseDate(dateStr) {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  } catch {
    return dateStr
  }
}

function getDisplayName(item) {
  if (!item.fields || !Array.isArray(item.fields)) return item.id ?? '—'
  const nameField = item.fields.find((f) => f.key === 'name' || f.key === 'username')
  return nameField?.value || item.id || '—'
}

function FieldPreview({ fields }) {
  if (!fields || fields.length === 0) return null
  const preview = fields
    .filter((f) => f.value !== null && f.value !== undefined && f.value !== '' && typeof f.value !== 'object')
    .slice(0, 3)
  if (preview.length === 0) return null
  return (
    <div className="mt-1 space-y-0.5">
      {preview.map((f) => (
        <p key={f.key} className="text-xs text-gray-500 truncate">
          <span className="font-medium text-gray-600">{f.key}:</span> {String(f.value)}
        </p>
      ))}
    </div>
  )
}

function ItemCard({ item, type, onPublish, onDelete }) {
  const [publishing, setPublishing] = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  async function handlePublish() {
    setPublishing(true)
    try {
      await onPublish(item.id)
    } finally {
      setPublishing(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`「${getDisplayName(item)}」を削除しますか？\nDelete this item?`)) return
    setDeleting(true)
    try {
      await onDelete(item.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm truncate">{getDisplayName(item)}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatJapaneseDate(item.createdAt ?? item.updatedAt)}
          </p>
          <FieldPreview fields={item.fields} />
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={handlePublish}
            disabled={publishing || deleting}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {publishing ? '処理中…' : '公開する / Publish'}
          </button>
          <button
            onClick={handleDelete}
            disabled={publishing || deleting}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {deleting ? '処理中…' : '削除 / Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage({ onClose }) {
  const [activeTab, setActiveTab] = useState('spot')
  const [items,     setItems]     = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  async function loadItems(type) {
    setLoading(true)
    setError('')
    setItems([])
    try {
      const data = await fetchCmsItems(type)
      setItems(data.items ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems(activeTab)
  }, [activeTab])

  async function handlePublish(itemId) {
    await publishCmsItem(activeTab, itemId)
    await loadItems(activeTab)
  }

  async function handleDelete(itemId) {
    await deleteCmsItem(activeTab, itemId)
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-teal-700 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
        <div>
          <h2 className="font-bold text-lg leading-tight">管理ページ / Admin</h2>
          <p className="text-teal-200 text-xs">北広島町ローカルラーン</p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          aria-label="閉じる"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 flex shrink-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-3 text-center text-xs font-bold transition-colors relative ${
              activeTab === t.id
                ? 'text-teal-700'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="block">{t.ja}</span>
            <span className="block opacity-60 font-normal">{t.en}</span>
            {activeTab === t.id && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-bold">エラー / Error</p>
            <p className="mt-1 text-xs">{error}</p>
            <button
              onClick={() => loadItems(activeTab)}
              className="mt-3 px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-400 transition-colors"
            >
              再試行 / Retry
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm font-bold text-gray-700">まだ投稿がありません</p>
            <p className="text-xs text-gray-400 mt-1">No submissions yet</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-3 max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 font-medium px-1">
              {items.length}件 / {items.length} items
            </p>
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                type={activeTab}
                onPublish={handlePublish}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
