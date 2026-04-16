# ローカルラーン / Local Learn

**北広島町のみんなの学びマップ**
Community Learning Map for Kitahiroshimacho, Hiroshima

🔗 [サイトを開く / Open the app](https://gbandi-dev.github.io/local-learn)

---

## 使い方 / How to Use

### 地図を見る / Browsing the Map

地図には2種類のピンが表示されます。
The map shows two types of pins:

| ピン | 意味 | Pin | Meaning |
|------|------|-----|---------|
| 🔵 **場** | まちの場所（学べる場所） | 🔵 **場** | A place in town to learn |
| 🟠 **人** | まちの人（教えてくれる人） | 🟠 **人** | A person in town who can teach |

ピンをタップすると詳細が表示されます。
Tap any pin to see details.

---

### 場所を追加する / Adding a Place

1. 画面左下の **「場所を追加 / Add a Place」** ボタンをタップ
2. 地図上でピンを置きたい場所をタップ — または **「現在地を使う / Use My Location」** で自動取得
3. フォームに情報を入力して **「保存する」** をタップ

---

1. Tap the **「場所を追加 / Add a Place」** button at the bottom-left of the map
2. Tap the map where you want to place the pin — or tap **「現在地を使う / Use My Location」** to use GPS
3. Fill in the form and tap **「保存する」** (Save)

---

### まちの人を追加する / Adding a Person

1. 画面左下の **「まちの人を追加 / Add a Person」** ボタンをタップ
2. 地図上で場所を指定（活動拠点など）
3. 名前・教えられること・活動時間を入力して保存

---

1. Tap **「まちの人を追加 / Add a Person」** at the bottom-left of the map
2. Pick a location on the map (your base of activity)
3. Enter your name, what you can teach, and when you're available, then save

---

### 学びを記録する / Logging a Learning Experience

上部ナビの **「学びの記録 / Records」** タブをタップして、以下を記録できます：

Tap the **「学びの記録 / Records」** tab in the top navigation to log:

- あなたの名前 / Your name
- 役割（学生・大人・先生など）/ Your role
- 訪問した場所や人 / The place or person you visited
- 日付 / Date
- 学んだこと・感じたこと / What you learned or felt
- 写真 / A photo (optional)

---

### ヘルプ / Help

- 初回3回の訪問時にウェルカム画面が表示されます。
- それ以降は画面右上の **「?」** ボタンでいつでも確認できます。

---

- The welcome screen appears automatically on your first 3 visits.
- After that, tap the **「?」** circle in the top-right corner to reopen it anytime.

---

## 管理者向け / For Administrators

ロゴを **0.6秒以内に3回** タップするとパスワード入力画面が表示されます。ログイン後、投稿の公開・削除が可能です。

Triple-tap the logo within 0.6 seconds to open the admin password prompt. Once logged in, you can publish or delete any submission.

---

## 開発者向け / For Developers

```bash
# 依存関係のインストール / Install dependencies
npm install

# 開発サーバーの起動 / Start dev server
npm run dev

# ビルド / Build
npm run build
```

`.env.example` をコピーして `.env` を作成し、Re:Earth CMS の認証情報を設定してください。

Copy `.env.example` to `.env` and fill in your Re:Earth CMS credentials.

```
VITE_REEARTH_API_TOKEN=
VITE_REEARTH_WORKSPACE_ID=
VITE_REEARTH_PROJECT_ID=
VITE_REEARTH_SPOTS_MODEL_ID=
VITE_REEARTH_MENTORS_MODEL_ID=
VITE_REEARTH_LOGS_MODEL_ID=
VITE_ADMIN_PASSWORD=
```

---

北広島町 · Kitahiroshimacho, Hiroshima, Japan
