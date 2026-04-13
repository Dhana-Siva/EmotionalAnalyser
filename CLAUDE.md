# NovaBank - AI-Powered Retail Banking Demo

## Overview
A React-based POC showcasing AI-enhanced retail banking: conversational assistant, smart spending insights, and anomaly detection. Uses mock data — no backend required.

## Tech Stack
- React 18 + Vite
- Material UI v5 (theme in `src/theme.js`)
- React Router v6
- Chart.js + react-chartjs-2
- Mock data (JSON files in `src/data/`)

## Commands
- `npm run dev` — Start dev server (typically http://localhost:5173)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build

## Project Structure
- `src/data/` — Mock accounts, transactions (with anomaly flags), chat response engine
- `src/components/` — Reusable components organized by feature (Layout, Chat, Dashboard, Insights)
- `src/pages/` — Route-level page components
- `src/theme.js` — MUI theme with banking brand colors (navy/teal)

## Routes
- `/` — Dashboard (balances, spending chart, anomaly alerts, recent transactions)
- `/accounts` — Account details + filterable transaction table
- `/insights` — Spending analysis charts, AI insights, anomaly detection list
- `/chat` — AI conversational assistant with quick-action chips

## Key Patterns
- Chat responses use pattern matching in `src/data/chatResponses.js`
- Anomalies are flagged directly in `transactions.json` with `anomaly`, `anomalyReason`, `severity` fields
- MUI Grid v2 syntax (`size={{ xs: 12, md: 4 }}`) is used throughout
