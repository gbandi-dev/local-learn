import { useState, useRef } from 'react'

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function CameraIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
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

const ROLES = [
  { value: 'Student',          label: '学生 / Student' },
  { value: 'Volunteer',        label: 'ボランティア / Volunteer' },
  { value: 'Community Member', label: '地域の人 / Community Member' },
  { value: 'Other',            label: 'その他 / Other' },
]

const today = () => new Date().toISOString().split('T')[0]

const EMPTY = { name: '', role: '', 'spot-visited': '', date: today(), 'what-i-learned': '', teacher: '' }

export default function LogView({ onSubmit }) {
  const [form,         setForm]         = useState(EMPTY)
  const [photoFile,    setPhotoFile]    = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [submitting,   setSubmitting]   = useState(false)
  const [done,         setDone]         = useState(false)
  const [formError,    setFormError]    = useState(null)
  const fileInputRef = useRef(null)

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      setFormError('写真はJPG形式のみ対応しています / Only JPG photos are supported')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setFormError(null)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function clearPhoto() {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form['what-i-learned'].trim()) return
    setSubmitting(true)
    setFormError(null)
    try {
      await onSubmit('log', { ...form, photoFile }, null)
      setDone(true)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return (
    <SuccessScreen onReset={() => {
      setDone(false)
      setForm(EMPTY)
      setFormError(null)
      clearPhoto()
    }} />
  )

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

        {/* Role */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            役割 / Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => set('role', r.value)}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-colors text-left ${
                  form.role === r.value
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 bg-white text-gray-600 active:bg-gray-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            日付 / Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
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

        {/* Photo */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            写真 / Photo <span className="text-gray-400 normal-case font-normal">(任意 / optional · JPG only)</span>
          </p>
          <input
            ref={fileInputRef}
            id="log-photo"
            type="file"
            accept="image/jpeg"
            className="hidden"
            onChange={handlePhoto}
          />
          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={photoPreview} alt="preview" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none"
              >×</button>
            </div>
          ) : (
            <label htmlFor="log-photo"
              className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-teal-300 bg-teal-50 rounded-xl py-6 cursor-pointer active:scale-95 transition-all">
              <CameraIcon className="w-7 h-7 text-teal-500" />
              <span className="text-sm font-bold text-teal-700">写真を追加</span>
              <span className="text-xs text-teal-500">Add a Photo (JPG)</span>
            </label>
          )}
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
          {submitting ? '送信中… / Sending…' : '記録を送信する'}
          {!submitting && <span className="block text-xs font-normal text-teal-200 mt-0.5">Submit Learning Record</span>}
        </button>

      </div>
    </div>
  )
}
