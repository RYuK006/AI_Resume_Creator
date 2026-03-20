# Deployment

> How to deploy Luminance AI to production.

Back to [[00_Index]] | See also: [[02_Setup_Guide]] | [[03_Architecture]]

## Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git add -A
git commit -m "Production ready"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → Import `AI_Resume_Creator`
3. Set **Root Directory** to `client`
4. Framework: Next.js (auto-detected)
5. Click **Deploy**

### Step 3: Set Environment Variables

In Vercel → Project Settings → Environment Variables:

| Variable | Value | Where It's Used |
|----------|-------|-----------------|
| `GEMINI_API_KEY` | Your Gemini API key | [[06_API_Reference|All API endpoints]] |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | [[06_API_Reference#Auth Endpoint]] |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | [[06_API_Reference#Auth Endpoint]] |
| `NEXTAUTH_SECRET` | Any random string | JWT encryption |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | OAuth callbacks |

### Step 4: Update Google OAuth Redirect

In Google Cloud Console → Credentials → Your OAuth client:

Add production redirect URI:
```
https://your-app.vercel.app/api/auth/callback/google
```

See [[02_Setup_Guide#Getting Google OAuth Credentials]] for setup.

### Step 5: Verify

| Check | What to test |
|-------|-------------|
| Landing page | Stitch design loads ([[05_Pages_and_Components#Landing Page]]) |
| Sign in | Google OAuth redirects correctly |
| Form wizard | All 4 steps work ([[05_Pages_and_Components#Form Wizard]]) |
| AI generation | `/api/generate` returns resume ([[06_API_Reference#POST apigenerate]]) |
| ATS scoring | Re-analyze works ([[06_API_Reference#POST apireanalyze]]) |
| PDF export | Downloads correctly |

## Self-Hosted (Node.js)

```bash
cd client
npm run build
npm start    # Starts on port 3000
```

Use a reverse proxy (Nginx/Caddy) for port 80/443 + SSL.

### Nginx Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Checklist

| Item | Required | How to Get |
|------|----------|------------|
| `GEMINI_API_KEY` | ✅ | [[02_Setup_Guide#Getting the Gemini API Key]] |
| `GOOGLE_CLIENT_ID` | ✅ | [[02_Setup_Guide#Getting Google OAuth Credentials]] |
| `GOOGLE_CLIENT_SECRET` | ✅ | [[02_Setup_Guide#Getting Google OAuth Credentials]] |
| `NEXTAUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Your deployment URL |
| Production redirect URI | ✅ | Google Cloud Console |

---

Related: [[02_Setup_Guide]] | [[06_API_Reference]] | [[01_Project_Overview]]
