import { useState, useRef } from 'react'

const ROLES = [
  { id: 'Student',   ja: '学生・生徒',   en: 'Student'   },
  { id: 'Adult',     ja: '大人・地域住民', en: 'Adult'     },
  { id: 'Teacher',   ja: '先生・指導者',  en: 'Teacher'   },
  { id: 'Volunteer', ja: 'ボランティア',  en: 'Volunteer' },
  { id: 'Other',     ja: 'その他',        en: 'Other'     },
]

const LANGS = [
  { id: 'Japanese', ja: '日本語',  en: 'Japanese' },
  { id: 'English',  ja: '英語',    en: 'English'  },
  { id: 'Other',    ja: 'その他',  en: 'Other'    },
]

const EMPTY = {
  name:                '',
  role:                '',
  'spot-visited':      '',
  date:                new Date().toISOString().split('T')[0],
  'what-i-learned':    '',
  'language-written-in': [],
  teacher:             '',
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function CameraIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

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
        続けて記録する<br /><span className="text-xs font-normal text-teal-200">Add Another Record</span>
      </button>
    </div>
  )
}

export default function LogView({ onSubmit }) {
  const [form,       setForm]       = useState(EMPTY)
  const [photoFile,  setPhotoFile]  = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)
  const [formError,  setFormError]  = useState(null)
  const cameraRef = useRef()

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }
  function toggleLang(id) {
    setForm((f) => ({
      ...f,
      'language-written-in': f['language-written-in'].includes(id)
        ? f['language-written-in'].filter((l) => l !== id)
        : [...f['language-written-in'], id],
    }))
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
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

  function reset() {
    setDone(false)
    setForm({ ...EMPTY, date: new Date().toISOString().split('T')[0] })
    setPhotoFile(null)
    setPhotoPreview(null)
    setFormError(null)
  }

  if (done) return <SuccessScreen onReset={reset} />

  const canSubmit = form.name.trim() && form['what-i-learned'].trim() && !submitting

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 pb-24">
      <div className="bg-teal-50 border-b border-teal-100 px-4 py-2.5">
        <p className="text-xs text-teal-700 font-medium">
          <span className="font-bold">学びの記録</span>
          <span className="mx-1.5 text-teal-300">·</span>
          <span className="text-teal-600">Learning Record — 北広島町</span>
        </p>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* 1. 名前 */}
        <Section num="1" ja="あなたの名前" en="Your Name">
          <input type="text" value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            placeholder="例：田中ひろし" />
        </Section>

        {/* 2. 役割 */}
        <Section num="2" ja="役割" en="Role">
          <div className="space-y-2">
            {ROLES.map((r) => {
              const active = form.role === r.id
              return (
                <button key={r.id} onClick={() => set('role', r.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                    active ? 'border-teal-300 bg-teal-50' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}>
                  <div className={`w-3 h-3 rounded-full shrink-0 ${active ? 'bg-teal-600' : 'bg-gray-300'}`} />
                  <div className="text-left">
                    <p className={`text-sm font-bold ${active ? 'text-teal-800' : 'text-gray-700'}`}>{r.ja}</p>
                    <p className={`text-xs ${active ? 'text-teal-500' : 'text-gray-400'}`}>{r.en}</p>
                  </div>
                  {active && <CheckIcon className="w-4 h-4 text-teal-600 ml-auto" />}
                </button>
              )
            })}
          </div>
        </Section>

        {/* 3. 訪問した場所 */}
        <Section num="3" ja="訪問した場所・まちの人" en="Spot or Person Visited">
          <input type="text" value={form['spot-visited']}
            onChange={(e) => set('spot-visited', e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            placeholder="例：北広島町立図書館、田中ひろしさん" />
        </Section>

        {/* 4. 日付 */}
        <Section num="4" ja="日付" en="Date">
          <input type="date" value={form.date}
            onChange={(e) => set('date', e.target.value)}
            className="w-full min-w-0 border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors box-border" />
        </Section>

        {/* 5. 学んだこと */}
        <Section num="5" ja="学んだこと・感じたこと" en="What I Learned">
          <textarea value={form['what-i-learned']}
            onChange={(e) => set('what-i-learned', e.target.value)}
            rows={4}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
            placeholder="今日の体験で気づいたこと、感じたこと、学んだことを自由に書いてください…" />
        </Section>

        {/* 6. 写真 */}
        <Section num="6" ja="写真" en="Photo">
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={photoPreview} alt="preview" className="w-full h-48 object-cover" />
              <button onClick={() => { setPhotoPreview(null); setPhotoFile(null) }}
                className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">×</button>
            </div>
          ) : (
            <button onClick={() => cameraRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-teal-300 bg-teal-50 rounded-xl py-7 active:scale-95 transition-all">
              <CameraIcon className="w-8 h-8 text-teal-500" />
              <span className="text-sm font-bold text-teal-700">写真を追加</span>
              <span className="text-xs text-teal-500">Add a Photo (optional)</span>
            </button>
          )}
        </Section>

        {/* 7. 言語 */}
        <Section num="7" ja="記録の言語" en="Language Written In">
          <div className="space-y-2">
            {LANGS.map((l) => (
              <label key={l.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-100 bg-white cursor-pointer select-none">
                <input type="checkbox" checked={form['language-written-in'].includes(l.id)}
                  onChange={() => toggleLang(l.id)}
                  className="w-4 h-4 accent-teal-600 rounded" />
                <div>
                  <p className="text-sm font-bold text-gray-800">{l.ja}</p>
                  <p className="text-xs text-gray-400">{l.en}</p>
                </div>
              </label>
            ))}
          </div>
        </Section>

        {/* 8. 先生・スタッフメモ */}
        <Section num="8" ja="先生・スタッフへのメモ（任意）" en="Note to Teacher / Staff">
          <textarea value={form.teacher}
            onChange={(e) => set('teacher', e.target.value)}
            rows={3}
            className="w-full border-2 border-gray-200 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
            placeholder="先生やスタッフへの連絡事項があれば…" />
        </Section>

        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{formError}</div>
        )}

        <button onClick={handleSubmit} disabled={!canSubmit}
          className="w-full py-4 bg-teal-700 text-white font-bold text-base rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-teal-200">
          記録を送信する
          <span className="block text-xs font-normal text-teal-200 mt-0.5">Submit Learning Record</span>
        </button>

      </div>
    </div>
  )
}
