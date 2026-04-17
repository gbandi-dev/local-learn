ローカルラーン / Local Learn

北広島町のみんなの学びマップ
Community Learning Map for Kitahiroshimacho, Hiroshima

🔗 サイトを開く / Open the app

📂 GitHub Repository

🖼️ Screenshot

(Replace with your actual screenshot file — e.g. /public/screenshot.png or /docs/screenshot.png)

🧭 概要 / Overview

ローカルラーンは、北広島町の「場所」「人」「学び」をつなぐインタラクティブな地図アプリです。
Local Learn is an interactive map that connects places, people, and learning experiences in Kitahiroshimacho.

🎯 Why it matters

This project focuses on two real gaps in the community:

子どもの学びの選択肢不足
Kids not attending school who need alternative learning paths
地方での生活に適応する外国人インターンの課題
Technical interns from Southeast Asia navigating rural Japanese life

Instead of building another top-down system, this creates a local, bottom-up learning network:

Residents can map learning places (📍)
Share people who can teach (👥)
Record real learning experiences (🟢 学)

All connected through a simple, shared map.

🧩 主な機能 / Core Features
🗺️ 地図ベースの探索 / Map-based exploration
📍 まちの場所 / Places
👥 まちの人 / People
🟢 学びの記録 / Learning records
🔍 フィルター（種類・カテゴリ）/ Filters
➕ 投稿機能 / Add places, people, records
使い方 / How to Use
🗺️ 地図を見る / Browsing the Map
ピン	意味	Pin	Meaning
🔵 場	学べる場所	🔵 Place	A place to learn
🟠 人	教えてくれる人	🟠 Person	Someone who can teach
🟢 学	学びの記録	🟢 Record	A learning experience

タップすると詳細が表示されます。
Tap any pin to see details.

➕ 投稿する / Contribute

左下のボタンから追加できます：

📍 場所を追加 / Add a Place
👥 人を追加 / Add a Person
🟢 記録を追加 / Add a Record
📝 学びを記録する / Logging

記録できる内容：

名前 / Name
役割 / Role
訪問した場所や人 / Place or person
日付 / Date
学び・気づき / What you learned
写真（任意）/ Photo
❓ ヘルプ / Help
初回3回はガイド表示
以降は右上の ? から確認
🔐 管理者向け / Admin

ロゴを 0.6秒以内に3回タップで管理画面へ。
Triple-tap the logo to access admin mode.

🌱 Sustainability note

This project was built heavily using Claude / Claude Code.

Rough estimate:

5–15 kg CO₂ total

Equivalent to:

~20–60 km of driving
~300–900 phone charges
a few days of household electricity

This wasn’t meant to be a throwaway demo.

If even a few kids or interns use it to navigate learning and life here,
then that cost turns into something with real value.

🤝 Community

Planning to map the town together with local residents —
something that already happens informally, now made visible.

Big thanks to @Maher and @Yamazaki for the support 🙏

💻 開発者向け / For Developers
npm install
npm run dev
npm run build

.env.example をコピーして .env を作成：

VITE_REEARTH_API_TOKEN=
VITE_REEARTH_WORKSPACE_ID=
VITE_REEARTH_PROJECT_ID=
VITE_REEARTH_SPOTS_MODEL_ID=
VITE_REEARTH_MENTORS_MODEL_ID=
VITE_REEARTH_LOGS_MODEL_ID=
VITE_ADMIN_PASSWORD=
📍 Location

北広島町（広島県）
Kitahiroshimacho, Hiroshima, Japan

📜 License

MIT
