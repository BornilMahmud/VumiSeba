# Development & Operations Guide — VumiSeba (ভূমিসেবা)

## 1. Prerequisites & Environment Setup

- **Node.js:** Node.js v20.x LTS or higher (compatible with Node 18.18+).
- **Package Manager:** `npm` (v10+).
- **TypeScript:** Strict type checking enabled across client, server, and tests.

### Clone and Install
```bash
git clone https://github.com/BornilMahmud/VumiSeba.git
cd VumiSeba
npm install
```

---

## 2. Core Scripts & Commands

| Command | Action & Purpose |
|:---|:---|
| `npm run dev` | Runs both client (Vite on port 3000) and backend (Express on port 5050) concurrently via `concurrently`. |
| `npm run dev:client` | Starts Vite client dev server with Hot Module Replacement (HMR). |
| `npm run dev:server` | Starts Express backend server with `tsx watch` auto-reloading. |
| `npm run seed` | Seeds `data/db.json` with 20+ realistic parcels and 9-stage lifecycle test cases. |
| `npm run build` | Full production build: compiles client TypeScript, bundles Vite assets, and compiles Express server. |
| `npm test` | Runs the full verification test suite (Core Correctness, Risk Engine, E2E Acceptance). |
| `npm run test:firebase` | Executes the 26-check Firebase authentication and security rules test suite. |

---

## 3. Environment Configuration

Copy `.env.example` to `.env` or set environment variables in your deployment dashboard:

```bash
# Server Configuration
PORT=5050
NODE_ENV=development
JWT_SECRET=bhumisathi-dev-super-secure-key-2026-bangladesh
DEMO_MODE=true

# Frontend Client Configuration
VITE_API_URL=http://localhost:5050/api
VITE_APP_NAME="VumiSeba (ভূমিসেবা)"

# Firebase Client SDK Configuration (Optional in Demo Mode)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=landtech-e5773.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=landtech-e5773
VITE_FIREBASE_STORAGE_BUCKET=landtech-e5773.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 4. Production Deployment

### 4.1 Frontend (Vercel)
The repository includes a production `vercel.json` configured for client-side routing:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 4.2 Backend (Render)
Configured via `render.yaml`:
```yaml
services:
  - type: web
    name: vumiseba-api
    env: node
    buildCommand: npm install && npm run build:server
    startCommand: node dist-server/server/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5050
      - key: DEMO_MODE
        value: "true"
```

### 4.3 Cloud Firestore & Security Rules (Firebase)
Deploy security rules and database indexes via Firebase CLI:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```
