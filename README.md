# NovaBank — Emotion-Aware Banking Demo

A React-based proof-of-concept showcasing an AI-enhanced retail banking experience where the dashboard **adapts in real time based on your facial expression**, detected via your device camera.

## What It Does

| Your Expression | Dashboard Response |
|---|---|
| 😊 Happy | Warm orange theme · Personalised offers carousel |
| 😐 Neutral | Classic navy theme · Standard dashboard |
| 😟 Sad | Muted grey theme · Encouragement card · Hides charts |
| 😰 Stressed | Calm teal theme · Support card with helpline · Hides charts |
| 😠 Angry | Dark theme · Quick-help card · Hides charts |

The mood detection **locks** on negative emotions so the UI doesn't flicker — a "I'm feeling better" button resets it.

---

## Tech Stack

- **React 19** + **Vite**
- **Material UI v7** (mood-based themes)
- **face-api.js** — runs 100% in the browser, no backend or API key needed
- **React Router v7**
- **Chart.js** + react-chartjs-2
- Mock JSON data — no backend required

---

## Quick Start

```bash
git clone <repo-url>
cd novabank
npm install
npm run dev
```

Open **http://localhost:5173** in your browser (Chrome or Safari).

> **iPhone / Mobile:** Open the URL in Safari on your iPhone while on the **same Wi-Fi network** as your machine. Use your machine's local IP instead of `localhost`, e.g. `http://192.168.x.x:5173`
>
> To find your machine's IP: run `ipconfig getifaddr en0` (Mac) in terminal.

---

## Camera & Face Detection

1. The app loads face-api.js models from `public/models/` on startup
2. Once models are loaded, the **camera icon** in the top-right becomes active
3. Click it to start your webcam — expressions are sampled every second
4. A 1.5-second debounce prevents mood flickering
5. The detected mood emoji and colour border appear on the video thumbnail

**Models used** (already bundled in `public/models/`):
- `tiny_face_detector` — lightweight face localisation
- `face_expression_net` — 7-class expression classifier (happy, sad, angry, fearful, disgusted, surprised, neutral)

No data ever leaves your device.

---

## Project Structure

```
src/
├── components/
│   ├── FaceDetection/    # WebcamMood.jsx — camera + face-api.js detection
│   ├── Layout/           # Sidebar, TopBar (responsive for mobile)
│   ├── Dashboard/        # AccountSummary, SpendingChart, AnomalyAlert, mood cards
│   ├── Chat/             # AI chatbot UI
│   └── Insights/         # Spending charts, anomaly list
├── context/
│   └── MoodContext.jsx   # Global mood state (reducer + debounce + locking)
├── data/                 # Mock JSON — accounts, transactions, offers
├── pages/                # Route-level components
└── theme.js              # 5 mood-based MUI themes
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard — balances, spending chart, mood-adaptive cards |
| `/accounts` | Account details + filterable transaction table |
| `/insights` | Spending analysis, AI insights, anomaly detection |
| `/chat` | AI conversational assistant |

---

## Customising

- **Add a new mood:** extend `moodPalettes` in `theme.js`, add a case in `mapExpressions()` in `WebcamMood.jsx`, and handle it in `MoodCard` in `DashboardPage.jsx`
- **Tweak detection sensitivity:** adjust `CONFIDENCE_THRESHOLD` and `DEBOUNCE_MS` in `MoodContext.jsx`
- **Mock data:** edit JSON files in `src/data/` — no restart needed with Vite HMR
