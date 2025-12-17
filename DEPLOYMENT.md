# 🚀 Deployment Guide - Live Production Version

## Overview

You have **3 ways** to deploy your project to production:

1. **Manual GitHub Actions** (Recommended) - Deploy via GitHub UI
2. **Vercel CLI** - Deploy directly from your terminal
3. **Vercel Dashboard** - Deploy via Vercel web interface

---

## Option 1: Deploy via GitHub Actions (Recommended)

### Prerequisites

Make sure you have set up these GitHub Secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Steps

1. **Go to your GitHub repository**
2. Click on the **"Actions"** tab
3. Select **"Deploy Production Environment"** workflow from the left sidebar
4. Click **"Run workflow"** button (top right)
5. Select:
   - Branch: `main` (or your production branch)
   - Environment: `production`
6. Click **"Run workflow"**
7. Wait for the deployment to complete (you'll see progress in real-time)
8. Your site will be live at your Vercel URL!

### What Happens

- ✅ Builds your Next.js application
- ✅ Runs all checks
- ✅ Deploys to Vercel production
- ✅ Performs health checks
- ✅ Shows deployment URL in the logs

---

## Option 2: Deploy via Vercel CLI (Fastest)

### Setup (One-time)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

### Deploy to Production

```bash
# From your project directory
cd /Users/gamzaramazanov/Desktop/projects/agency

# Deploy to production
vercel --prod
```

### First Time Setup

If this is your first deployment:

```bash
# Link your project to Vercel
vercel link

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account/team)
# - Link to existing project? No (or Yes if you already created one)
# - Project name? agency (or your preferred name)
# - Directory? ./
# - Override settings? No

# Then deploy
vercel --prod
```

### Quick Commands

```bash
# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

---

## Option 3: Deploy via Vercel Dashboard

### Steps

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Import your GitHub repository** (if not already imported):

   - Click **"Add New..."** → **"Project"**
   - Select your repository
   - Configure settings (usually auto-detected for Next.js)
   - Click **"Deploy"**

3. **For subsequent deployments**:
   - Go to your project in Vercel
   - Click **"Deployments"** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push to your main branch (if you enable auto-deploy)

---

## Setting Up Vercel (First Time)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### Step 2: Create Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings
4. Click **"Deploy"**

### Step 3: Get Credentials for GitHub Actions

After first deployment, get these values:

#### Vercel Token

1. Go to [Vercel Settings → Tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name it: `GitHub Actions`
4. Copy the token (save it - you won't see it again!)

#### Vercel Org ID

1. Go to [Vercel Settings → General](https://vercel.com/account/general)
2. Find **"Team ID"** or **"Organization ID"**
3. Copy it

#### Vercel Project ID

1. Go to your project in Vercel
2. Go to **Settings** → **General**
3. Find **"Project ID"**
4. Copy it

Or use CLI:

```bash
vercel project ls
```

### Step 4: Add GitHub Secrets

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

| Secret Name         | Value                   |
| ------------------- | ----------------------- |
| `VERCEL_TOKEN`      | Your Vercel token       |
| `VERCEL_ORG_ID`     | Your Vercel Org/Team ID |
| `VERCEL_PROJECT_ID` | Your Vercel Project ID  |

---

## Environment Variables

### Setting Environment Variables in Vercel

1. Go to your project in Vercel
2. **Settings** → **Environment Variables**
3. Add your production environment variables:

**Required for Production:**

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_ENV=production`
- `NEXT_PUBLIC_APP_NAME=Your App Name`
- `NEXT_PUBLIC_API_URL=your-api-url`
- `NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn` (if using Sentry)
- `JWT_SECRET=your-secret` (if using JWT)
- Any other environment variables your app needs

**Note:** Variables starting with `NEXT_PUBLIC_` are exposed to the browser. Keep secrets without this prefix.

---

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables are set in Vercel
- [ ] GitHub secrets are configured (for GitHub Actions)
- [ ] Code is committed and pushed to `main` branch
- [ ] Tests pass locally (`npm run test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in development
- [ ] Production API URLs are correct
- [ ] Security secrets are strong and unique

---

## Troubleshooting

### Deployment Fails in GitHub Actions

**Check:**

1. Are all three Vercel secrets set correctly?
2. Is the Vercel project linked to your GitHub repo?
3. Check the Actions logs for specific errors

**Fix:**

```bash
# Verify Vercel connection
vercel whoami

# Check project settings
vercel project ls
```

### Build Fails

**Common issues:**

- Missing environment variables
- TypeScript errors
- Missing dependencies

**Fix:**

```bash
# Test build locally first
npm run build

# Check for errors
npm run lint
npm run type-check
```

### Site Not Loading

**Check:**

1. Is the deployment successful? (check Vercel dashboard)
2. Are environment variables set correctly?
3. Check Vercel deployment logs

**Fix:**

```bash
# View deployment logs
vercel logs [deployment-url]

# Check deployment status
vercel ls
```

---

## Quick Reference

### GitHub Actions Deployment

```
GitHub Repo → Actions Tab → Deploy Production → Run workflow
```

### Vercel CLI Deployment

```bash
vercel --prod
```

### Vercel Dashboard

```
vercel.com → Your Project → Deployments → Redeploy
```

---

## Your Live URL

After deployment, your site will be available at:

- **Production**: `https://your-project-name.vercel.app`
- **Custom Domain**: (if configured in Vercel)

You can find your deployment URL in:

- Vercel Dashboard → Your Project → Deployments
- GitHub Actions logs (after deployment)
- Terminal output (if using CLI)

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- Check deployment logs in Vercel Dashboard or GitHub Actions
