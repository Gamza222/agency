# 🚀 GitHub & Deployment Setup Guide

## Current Status

✅ **Git repository initialized** locally  
❌ **Not connected to GitHub** yet  
✅ **GitHub Actions workflows** configured  
✅ **Vercel deployment** configured

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `agency` (or your preferred name)
   - **Description**: (optional)
   - **Visibility**: Choose Public or Private
   - **⚠️ DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/gamzaramazanov/Desktop/projects/agency

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Next.js 15 project with GitHub Actions setup"

# Rename branch to main (if needed)
git branch -M main

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/agency.git

# Push to GitHub
git push -u origin main
```

## Step 3: Set Up Vercel

### 3.1 Create Vercel Account & Project

1. Go to [Vercel](https://vercel.com) and sign in (or create account)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (it should appear after Step 2)
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
5. Click **"Deploy"**

### 3.2 Get Vercel Credentials

After the first deployment, you'll need to get these values:

1. **Vercel Token**:

   - Go to [Vercel Settings → Tokens](https://vercel.com/account/tokens)
   - Click **"Create Token"**
   - Name it (e.g., "GitHub Actions")
   - Copy the token (you'll only see it once!)

2. **Vercel Org ID**:

   - Go to [Vercel Settings → General](https://vercel.com/account/general)
   - Find **"Team ID"** or **"Organization ID"**
   - Copy it

3. **Vercel Project ID**:
   - Go to your project settings in Vercel
   - In the URL or settings, you'll see the project ID
   - Or run: `vercel project ls` (if you have Vercel CLI installed)

## Step 4: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add these three secrets:

   | Secret Name         | Value                   | Where to Find              |
   | ------------------- | ----------------------- | -------------------------- |
   | `VERCEL_TOKEN`      | Your Vercel token       | Vercel Settings → Tokens   |
   | `VERCEL_ORG_ID`     | Your Vercel Org/Team ID | Vercel Settings → General  |
   | `VERCEL_PROJECT_ID` | Your Vercel Project ID  | Project Settings in Vercel |

## Step 5: Test the Setup

### Test GitHub Actions

1. Make a small change to any file
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test: GitHub Actions setup"
   git push
   ```
3. Go to your GitHub repository → **Actions** tab
4. You should see workflows running:
   - **CI/CD Pipeline** (runs on every push)
   - **Deploy Production** (runs when pushing to main)

### Test Deployment

1. Push to `main` branch (or merge a PR)
2. Check the **Actions** tab for deployment status
3. Once complete, your site will be live at:
   - Production: `https://your-project-name.vercel.app`
   - Preview: Each PR gets its own preview URL

## 📋 Workflow Overview

### What Happens Automatically:

1. **On Push to `main` branch**:

   - ✅ CI/CD pipeline runs (tests, linting, security checks)
   - ✅ Production deployment to Vercel
   - ✅ Health checks

2. **On Pull Request**:

   - ✅ CI/CD pipeline runs
   - ✅ Preview deployment to Vercel
   - ✅ Comment added to PR with preview URL

3. **Manual Deployment**:
   - You can trigger deployments manually from GitHub Actions tab

## 🔧 Troubleshooting

### GitHub Actions Not Running?

- Check that workflows are in `.github/workflows/` directory ✅
- Verify the branch name matches (should be `main` not `master`)
- Check GitHub Actions tab for error messages

### Vercel Deployment Failing?

- Verify all three secrets are set correctly
- Check Vercel dashboard for error logs
- Ensure `vercel.json` is in the root directory ✅

### Can't Find Vercel Project ID?

Install Vercel CLI and run:

```bash
npm install -g vercel
vercel login
vercel project ls
```

## 📚 Project Stack

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **State Management**: Zustand
- **Animation**: Framer Motion, GSAP
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Connect local repo to GitHub
3. ✅ Set up Vercel project
4. ✅ Add GitHub secrets
5. ✅ Push code and watch it deploy!

---

**Need Help?** Check the [GitHub Actions documentation](https://docs.github.com/en/actions) or [Vercel documentation](https://vercel.com/docs).
