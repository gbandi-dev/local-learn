# ローカルラーン / Local Learn

**北広島町のみんなの学びマップ**  
Community Learning Map for Kitahiroshimacho, Hiroshima

[🌐 Open the app](https://gbandi-dev.github.io/local-learn/) ・ [📂 GitHub](https://github.com/gbandi-dev/local-learn)

<img width="1022" height="730" alt="Screenshot 2026-04-17 at 22 55 21" src="https://github.com/user-attachments/assets/072397d0-ccf9-440d-975b-15cc6094b747" />

---

## Why this matters

Local Learn focuses on two real gaps in Kitahiroshimacho:

- **Kids not attending school** who need alternative learning paths
- **Technical interns from Southeast Asia** trying to navigate rural Japanese life

Instead of building another top-down system, this creates a simple local learning network that residents can grow together.

People in town can add:

- 📍 **Learning places**
- 👥 **Local teachers / people who can help**
- 🟢 **Learning logs**

All of it lives on an interactive map that makes local knowledge easier to find, share, and use.

---

## What it does

- 🗺️ Explore the town through an interactive map
- 📍 Add places where people can learn
- 👥 Add people who can teach or support others
- 🟢 Record learning experiences
- 🔍 Filter by type and category
- ❓ Open the help guide anytime
- 🔐 Admin moderation for publishing and deletion

---

## How to use

### Map pins

The map shows three pin types:

| Pin | Japanese | Meaning |
|---|---|---|
| 🔵 | **場** | A place in town to learn |
| 🟠 | **人** | A person in town who can teach |
| 🟢 | **学** | A logged learning experience |

Tap any pin to open its details.

### Add a place

1. Tap **「場所を追加 / Add a Place」**
2. Tap the map to place a pin, or use **「現在地を使う / Use My Location」**
3. Fill in the form and save

### Add a person

1. Tap **「まちの人を追加 / Add a Person」**
2. Choose a location on the map
3. Add:
   - name
   - what they can teach
   - availability

### Add a learning log

Open **「学びの記録 / Records」** and log:

- your name
- your role
- the place or person visited
- the date
- what you learned or felt
- an optional photo

### Help

- A welcome guide appears during the first 3 visits
- After that, tap the **?** button in the top-right anytime

---

## Admin

Triple-tap the logo within **0.6 seconds** to open the admin password prompt.

Admins can:

- publish submissions
- delete submissions

---

## Sustainability note

This project was built heavily using Claude and Claude Code.

Estimated total footprint: **5 to 15 kg CO₂**

Roughly equivalent to:

- **20 to 60 km** of driving
- **300 to 900** phone charges
- **a few days** of average household electricity use

This was not meant to be a throwaway demo.

If it ends up helping even a small number of kids or interns navigate learning and life here, then that compute turns into something useful rather than just burned effort.

---

## Community

I’m planning to spend this weekend mapping the town with local people. We already spend time together most weekends, so it feels natural to start building this into that rhythm.

---

## For developers

    npm install
    npm run dev
    npm run build

Copy `.env.example` to `.env` and fill in:

    VITE_REEARTH_API_TOKEN=
    VITE_REEARTH_WORKSPACE_ID=
    VITE_REEARTH_PROJECT_ID=
    VITE_REEARTH_SPOTS_MODEL_ID=
    VITE_REEARTH_MENTORS_MODEL_ID=
    VITE_REEARTH_LOGS_MODEL_ID=
    VITE_ADMIN_PASSWORD=

---

## License

This project is **open source, free to use, and released under the MIT License**.

You are free to use, modify, and distribute this project, including for personal and commercial use, as long as the original license notice is included.

---

## Location

Kitahiroshimacho, Hiroshima, Japan
