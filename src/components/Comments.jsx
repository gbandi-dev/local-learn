import { useState, useEffect } from 'react'
import { fetchComments, createComment } from '../api/cms'

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  } catch {
    return dateStr
  }
}

function getFieldValue(item, key) {
  return item.fields?.find((f) => f.key === key)?.value ?? ''
}

export default function Comments({ itemId, itemType }) {
  const [comments,    setComments]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [author,      setAuthor]      = useState('')
  const [body,        setBody]        = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted,   setSubmitted]   = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchComments(itemId)
      .then(setComments)
      .finally(() => setLoading(false))
  }, [itemId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!author.trim() || !body.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const created = await createComment(itemType, itemId, author.trim(), body.trim())
      // Optimistically add to list
      setComments((prev) => [...prev, created])
      setAuthor('')
      setBody('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold text-gray-800">コメント</h3>
        <span className="text-xs text-gray-400">/ Comments</span>
        {!loading && (
          <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
            {comments.length}
          </span>
        )}
      </div>

      {/* Existing comments */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 mb-4">まだコメントはありません / No comments yet</p>
      ) : (
        <div className="space-y-2 mb-4">
          {comments.map((c, i) => (
            <div key={c.id ?? i} className="bg-white border border-gray-200 rounded-xl px-3 py-2.5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-gray-800">{getFieldValue(c, 'author') || '匿名'}</span>
                <span className="text-xs text-gray-400">{formatDate(getFieldValue(c, 'date'))}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{getFieldValue(c, 'body')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
        <p className="text-xs font-bold text-gray-600">コメントを追加 / Add a Comment</p>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="お名前 / Your name"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 transition-colors"
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="コメントを書いてください… / Write a comment…"
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 transition-colors resize-none"
          required
        />
        {submitError && <p className="text-xs text-red-600">{submitError}</p>}
        {submitted && <p className="text-xs text-teal-600 font-medium">送信しました！/ Comment posted!</p>}
        <button
          type="submit"
          disabled={submitting || !author.trim() || !body.trim()}
          className="w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors active:scale-95"
        >
          {submitting ? '送信中…' : '送信する / Submit'}
        </button>
      </form>
    </div>
  )
}
