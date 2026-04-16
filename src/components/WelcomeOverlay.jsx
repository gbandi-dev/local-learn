import React from 'react'

const FEATURES = [
  { icon: '📍', ja: 'まちの場所を発見', en: 'Discover places to learn' },
  { icon: '👥', ja: 'まちの人に出会う', en: 'Meet people who can teach you' },
  { icon: '📓', ja: '学びを記録する',   en: 'Log what you learned' },
]

export default function WelcomeOverlay({ onDismiss }) {
  // If already dismissed, render nothing
  if (localStorage.getItem('ll-welcomed') === '1') return null

  function handleDismiss() {
    localStorage.setItem('ll-welcomed', '1')
    onDismiss()
  }

  return (
    <div className="fixed inset-0 z-40 bg-teal-900/95 backdrop-blur flex items-center justify-center p-4 safe-area-inset">
      <div className="w-full max-w-md text-center">
        {/* Mascot */}
        <div className="flex justify-center mb-4">
          <img
            src={import.meta.env.BASE_URL + 'mascot.png'}
            alt="mascot"
            className="w-24 h-24 rounded-full bg-white/10 object-contain p-1"
          />
        </div>

        {/* Title */}
        <h1 className="text-white font-bold text-xl leading-snug mb-1">
          北広島町の みんなの学びマップへ<br />ようこそ！
        </h1>
        <p className="text-teal-200 text-sm mb-6">
          Welcome to Kitahiroshimacho's community learning map
        </p>

        {/* Feature cards */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {FEATURES.map((f) => (
            <div
              key={f.ja}
              className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-center"
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-white text-xs font-bold leading-snug">{f.ja}</p>
              <p className="text-teal-200 text-xs mt-0.5 opacity-80">{f.en}</p>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={handleDismiss}
          className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-bold text-base rounded-2xl shadow-lg transition-all"
        >
          はじめる / Get Started
        </button>
      </div>
    </div>
  )
}
