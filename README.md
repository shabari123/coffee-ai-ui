# ☕ Swasthya Coffee AI UI

React/Vite frontend for the Swasthya Coffee AI Assistant.

## Tech stack

-   React 19
-   Vite
-   React Markdown
-   JavaScript
-   CSS

## Architecture
Browser
  ↓
React App
  ↓
api.js
  ↓
POST /chat
  ↓
Swasthya Coffee FastAPI Backend

## Main files
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── Header.jsx
│   ├── Message.jsx
│   ├── ChatInput.jsx
│   ├── ProductCard.jsx
│   └── ChatBox.jsx
├── services/
│   └── api.js
├── utils/
│   └── session.js
└── styles/

### `App.jsx`

Controls:

-   Chat state.
-   Loading state.
-   User messages.
-   AI responses.
-   Product results.
-   Auto-scroll.
-   Welcome screen.

### `api.js`

Calls:
POST {VITE_API_URL}/chat

Request:
{
  "session_id": "uuid",
  "message": "Show me the available products"
}

### `session.js`

Creates a browser session ID using `crypto.randomUUID()` and stores it
in `localStorage`.

This allows the backend to associate multiple messages from the same
browser with the same Redis-backed conversation.

### `ProductCard.jsx`

Displays product information returned by the backend:

-   Image
-   Name
-   Price
-   Stock status
-   WooCommerce product link

## Environment variables
Create `.env` locally:
VITE_API_URL=http://localhost:8000

For production, configure the variable in Render:
VITE_API_URL=https://swasthya-coffee-api.onrender.com
Do not commit `.env`.

## Local development
npm install
npm run dev

Open:
http://localhost:5173

The backend must be running separately.

## Production build
npm run build

Vite creates:
dist/

## Render deployment
This frontend is deployed as a Render Static Site.
Build command:
npm install; npm run build

Publish directory:
dist

Live URL:
https://swasthya-coffee-ui.onrender.com

## Related backend
The backend repository is the FastAPI service:
coffee-ai-assistant

Production backend:
https://swasthya-coffee-api.onrender.com
