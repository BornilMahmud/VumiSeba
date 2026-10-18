# Vercel Deployment Guide for VumiSeba (ভূমিসেবা)

This project is pre-configured and optimized for **1-Click, Zero-Configuration Deployment on Vercel**.

---

## 🚀 Quick Deployment Options

### Option 1: Deploy via Vercel Web Dashboard (Recommended)

1. Push your repository to **GitHub** (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Select the **`VumiSeba`** repository and click **Import**.
5. Vercel will automatically detect the configuration from [`vercel.json`](file:///Users/armanhossenripon/Documents/GitHub/VumiSeba/vercel.json):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build:client` (or `npm run vercel-build`)
   - **Output Directory:** `dist`
6. Click **Deploy**. Your application will be live in ~45 seconds!

---

### Option 2: Deploy via Vercel CLI

```bash
# 1. Install or run Vercel CLI directly
npx vercel

# 2. Follow the on-screen prompts:
# ? Set up and deploy "~/Documents/GitHub/VumiSeba"? [Y/n] y
# ? Which scope do you want to deploy to? (Select your account)
# ? Link to existing project? [y/N] n
# ? What's your project's name? vumiseba
# ? In which directory is your code located? ./
#
# 3. For Production release:
npx vercel --prod
```

---

## ⚙️ Configuration Details

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Framework** | `vite` | Configured in `vercel.json` |
| **Build Command** | `npm run build:client` | Runs `vite build` producing optimized chunks |
| **Output Directory** | `dist` | Production static bundle |
| **SPA Fallback Routing** | `/(.*) -> /index.html` | Prevents 404 on page refresh for all client routes |
| **Asset Caching** | `max-age=31536000, immutable` | Instant asset delivery from Vercel Edge Network |
| **Security Headers** | `nosniff`, `SAMEORIGIN`, `1; mode=block` | Hardened against XSS and clickjacking |

---

## 🌐 Environment Variables (Optional)

The frontend features a **100% self-contained Offline Demo Mode**. It runs instantly out-of-the-box on Vercel with no environment variables required:
- Instant 1-click Demo Login (Citizen, Union Officer, AC Land, Sub-Registrar, Super Admin)
- Full Smart NID Card and Laminated NID Card rendering
- Land parcel searches, Risk Assessment, and Ownership Verification
- Biometric KYC simulation and Citizen ID allocation

### Connecting to an External Live Backend (Optional)
If you deploy the Express server (e.g. to **Render**, **Railway**, or a **VPS**):

1. Go to your Vercel Project Dashboard → **Settings** → **Environment Variables**.
2. Add:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.onrender.com
   ```
3. Redeploy the project. The frontend will automatically proxy all API requests to your live backend.
