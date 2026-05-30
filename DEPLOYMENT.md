# Deployment Guide — AI Business Growth OS

## Deployment Options

| Platform | Frontend | Backend | Database |
|----------|----------|---------|----------|
| **Vercel** | ✅ Recommended | Serverless functions | Firebase |
| **Netlify** | ✅ Supported | Netlify Functions | Firebase |
| **Firebase Hosting** | ✅ Supported | Cloud Functions | Firebase |
| **Railway/Render** | Static build | ✅ Node.js server | Firebase |

---

## Option 1: Vercel (Recommended)

### Frontend on Vercel

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Set root directory to `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_API_URL=https://your-api.railway.app/api
   ```

### Backend on Railway/Render

1. Create new service pointing to `backend/` directory
2. Start command: `node src/index.js`
3. Add all variables from `backend/.env.example`
4. Copy the deployed URL to frontend's `VITE_API_URL`

---

## Option 2: Firebase Hosting (Full Stack)

### Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

### Deploy Firestore Rules
```bash
cd firebase
firebase use your-project-id
firebase deploy --only firestore:rules,storage
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Hosting
```bash
cd firebase
firebase deploy --only hosting
```

### Backend as Cloud Functions (optional)
Convert Express app to Firebase Functions or deploy backend separately on Railway.

---

## Option 3: Netlify

### Frontend
1. Connect GitHub repo
2. Base directory: `frontend`
3. Build: `npm run build`
4. Publish: `dist`
5. Add `netlify.toml`:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Firebase Configuration Checklist

### Authentication
- [ ] Enable Email/Password provider
- [ ] Enable Google provider
- [ ] Add authorized domains (your production URL)
- [ ] Configure OAuth consent screen

### Firestore
- [ ] Create database (production mode)
- [ ] Deploy security rules from `firebase/firestore.rules`
- [ ] Deploy indexes from `firebase/firestore.indexes.json`

### Storage
- [ ] Enable Cloud Storage
- [ ] Deploy rules from `firebase/storage.rules`

### Service Account (Backend)
1. Project Settings → Service Accounts
2. Generate new private key
3. Save as `backend/serviceAccountKey.json` (never commit!)
4. Or paste JSON into `FIREBASE_SERVICE_ACCOUNT` env var

---

## Environment Variables Reference

### Frontend (VITE_*)
All frontend env vars must be prefixed with `VITE_`.

### Backend
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default 3001) |
| `OPENAI_API_KEY` | Recommended | OpenAI API key |
| `FIREBASE_SERVICE_ACCOUNT` | Recommended | Firebase admin JSON |
| `SMTP_*` or `RESEND_API_KEY` | Optional | Email sending |
| `FRONTEND_URL` | Yes (prod) | CORS origin |

---

## Production Checklist

- [ ] Set strong Firebase security rules
- [ ] Enable Firebase App Check
- [ ] Configure rate limiting (already in backend)
- [ ] Set up monitoring (Firebase Analytics / Sentry)
- [ ] Enable HTTPS everywhere
- [ ] Rotate API keys regularly
- [ ] Set up backup for Firestore
- [ ] Configure custom domain
- [ ] Test all auth flows in production
- [ ] Verify CORS settings

---

## FFmpeg Video Rendering (Optional)

For production video rendering, install FFmpeg on your server:

```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
choco install ffmpeg
```

The video creator module generates scripts and storyboards. FFmpeg integration for actual rendering can be added to `backend/src/services/video.js`.

---

## Scaling Considerations

- **Firestore**: Use composite indexes for complex queries
- **OpenAI**: Implement caching for repeated requests
- **Rate Limiting**: Adjust limits in `backend/src/index.js`
- **CDN**: Firebase Hosting / Vercel include CDN automatically
- **Background Jobs**: Use Firebase Cloud Functions or Bull queue for autopilot

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Set `FRONTEND_URL` in backend env |
| Firebase auth fails | Check authorized domains in Firebase console |
| AI returns demo data | Set `OPENAI_API_KEY` in backend |
| Theme not persisting | Check localStorage is enabled |
| Build fails | Ensure Node.js 20+ is installed |

---

## Support

For issues, check:
1. Browser console for frontend errors
2. Backend logs for API errors
3. Firebase console for auth/database issues
