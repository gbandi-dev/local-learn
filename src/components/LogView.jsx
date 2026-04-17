import { useState } from 'react'

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function SuccessScreen({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-gray-50">
      <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200 flex items-center justify-center mb-5">
        <CheckIcon className="w-10 h-10 text-teal-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">記録しました</h2>
      <p className="text-gray-500 mt-1 text-sm">Learning record saved</p>
      <button onClick={onReset}
        className="mt-8 w-full max-w-xs py-3 bg-teal-700 text-white rounded-xl text-sm font-bold active:scale-95 transition-all">
        続けて記録する / Add Another Record
      </button>
    </div>
  )
}

const EMPTY = { name: '', 'spot-visited': '', 'what-i-learned': '', teacher: '' }

export default function LogView({ onSubmit }) {
  const [form,       setForm]       = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)
  const [formError,  setFormError]  = useState(null)

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  async function handleSubmit() {
    if (!form.name.trim() || !form['what-i-learned'].trim()) return
    setSubmitting(true)
    setFormError(null)
    try {
      await onSubmit('log', form, null)
      setDone(true)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return <SuccessScreen onReset={() => { setDone(false); setForm(EMPTY); setFormError(null) }} />

  const canSubmit = form.name.trim() && form['what-i-learned'].trim() && !submitting

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-10">
      <div className="bg-teal-50 border-b border-teal-100 px-4 py-3">
        <p className="text-sm font-bold text-teal-700">学びの記録 <span className="font-normal text-teal-500">· Learning Record</span></p>
        <p className="text-xs text-teal-500 mt-0.5">北広島町 · Kitahiroshimacho</p>
      </div>

      <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">

        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            名前 / Name <span className="text-red-400 normal-case font-normal ml-1">必須</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
            placeholder="例：田中ひろし"
          />
        </div>

        {/* Spot visited */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            訪問した場所 / Spot Visited
          </label>
          <input
            type="text"
            value={form['spot-visited']}
            onChange={(e) => set('spot-visited', e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
            placeholder="例：北広島町立図書館"
          />
        </div>

        {/* What I learned */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            学んだこと / What I Learned <span className="text-red-400 normal-case font-normal ml-1">必須</span>
          </label>
          <textarea
            value={form['what-i-learned']}
            onChange={(e) => set('what-i-learned', e.target.value)}
            rows={5}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none bg-white"
            placeholder="今日の体験で気づいたこと、感じたこと、学んだことを自由に書いてください…"
          />
        </div>

        {/* Teacher note */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            先生・スタッフへのメモ / Note to Teacher
          </label>
          <textarea
            value={form.teacher}
            onChange={(e) => set('teacher', e.target.value)}
            rows={3}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none bg-white"
            placeholder="先生やスタッフへの連絡事項があれば…"
          />
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 break-all whitespace-pre-wrap">{formError}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 bg-teal-700 text-white font-bold text-base rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-teal-200"
        >
          記録を送信する
          <span className="block text-xs font-normal text-teal-200 mt-0.5">Submit Learning Record</span>
        </button>

      </div>
    </div>
  )
}
