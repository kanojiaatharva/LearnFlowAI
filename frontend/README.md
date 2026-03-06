# LearnFlow AI — Frontend

A modern AI-powered learning dashboard built with **React 19 + Vite 7 + Tailwind CSS 4**.

![UI Preview](docs/preview.png)

---

## Features

| Page | API Endpoint | Description |
|------|-------------|-------------|
| **Explain Content** | `POST /api/explain` | Paste any text or code and get an AI explanation tailored to your skill level |
| **Q&A Assistant** | `POST /api/qa` | Session-aware chat interface with typing indicators and auto-scroll |
| **Upload Knowledge** | `POST /api/upload` | Upload PDFs to the RAG knowledge base with drag-and-drop and progress tracking |

---

## Tech Stack

- **React 19** — UI components
- **Vite 7** — Build tool & dev server
- **Tailwind CSS 4** — Utility-first styling
- **Axios** — HTTP client (60s timeout, no manual Content-Type on file uploads)

---

## Project Structure

```
src/
├── app/
│   ├── App.jsx               # Root component + state-based routing
│   └── providers.jsx
├── layout/
│   ├── Navbar.jsx            # Top bar with logo + AI Ready badge
│   └── Sidebar.jsx           # Navigation sidebar
├── features/
│   ├── explain/
│   │   └── ExplainPage.jsx   # POST /api/explain
│   ├── chat/
│   │   └── ChatPage.jsx      # POST /api/qa
│   └── upload/
│       └── UploadPage.jsx    # POST /api/upload
├── styles/
│   └── globals.css           # Design tokens + component classes
└── main.jsx                  # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:5000`

### Install & Run

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

### Build for Production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build
```

---

## API Contract

The frontend expects the backend at `http://localhost:5000/api` with these endpoints:

### `POST /api/explain`
```json
// Request
{ "content": "string" }

// Response
{ "explanation": "string" }
```

### `POST /api/qa`
```json
// Request
{ "sessionId": "string", "question": "string" }

// Response
{ "answer": "string" }
```

> `sessionId` is auto-generated and persisted in `localStorage` per browser session.

### `POST /api/upload`
```
// Request — multipart/form-data
file: <PDF file>

// Response
{ "message": "Document processed successfully" }
```

> ⚠️ **Do not set `Content-Type` manually** — the browser sets the correct `multipart/form-data` boundary automatically.

---

## Design System

- **Theme:** Dark gradient, glassmorphism cards, purple/blue neon accents
- **Typography:** Inter (Google Fonts)
- **Component classes** (defined in `globals.css`): `.card`, `.card-glow`, `.btn`, `.btn-primary`, `.btn-secondary`, `.input`, `.dropzone`, `.skeleton`, `.toast-*`, `.spinner`
- **Animations:** `fade-in`, `pop-in`, shimmer skeleton loader, typing bounce dots

---

## Environment

To point to a different backend URL, update the `baseURL` in each page file:

```js
// src/features/explain/ExplainPage.jsx  (and chat/upload)
const API = axios.create({ baseURL: "http://localhost:5000/api", timeout: 60000 });
```

> For a production setup, move this to a `.env` file:
> ```
> VITE_API_URL=https://your-backend.com/api
> ```
> Then use `import.meta.env.VITE_API_URL` as the `baseURL`.
