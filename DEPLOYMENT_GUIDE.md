# Complete Deployment Guide

This guide breaks down exactly what settings you need to fill in on Render (for your backend) and Vercel (for your frontend). Since your code is already pushed to GitHub, we'll deploy directly from your repository!

---

## Part 1: Deploying the Backend on Render

The backend must be deployed first so we get the live API URL to paste into the frontend code.

1. Go to [Render.com](https://render.com) and sign in with your GitHub account.
2. Click the **"New +"** button at the top and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and click Next.
4. Connect your GitHub account (if prompted) and search for your repository: `7H-ANKUR/tata_sales-analysis`. Click **Connect**.
5. Fill in the deployment settings exactly as follows:

   - **Name**: `tata-motors-api` (or anything you prefer)
   - **Region**: Choose the one closest to you (e.g., Singapore or Frankfurt).
   - **Branch**: `main`
   - **Root Directory**: `ml/tata-backend` *(Very Important!)*
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`

6. Scroll down to the **Instance Type** and select the **Free** tier.
7. Click **Create Web Service**.

Wait approximately 3-5 minutes for Render to install the Python packages and boot up the ML model. Once you see a message saying "Your service is live 🎉", **copy the URL located at the top left of your screen** (it will look something like `https://tata-motors-api-xyz.onrender.com`).

---

## Part 2: Updating the Frontend with the Live URL

Now that your backend is alive, we must tell your frontend where to find it.

1. Open your code editor locally on your computer.
2. Open the file: `ml/tata-frontend/app.js`
3. At the very top (Line 9), replace the `API_BASE` with your new Render URL:
   ```javascript
   const API_BASE = 'https://tata-motors-api-xyz.onrender.com'; // Paste your copied Render URL here!
   const USE_MOCK = false; // Make sure this remains false!
   ```
4. Save the file.
5. Push this small code update to GitHub using your terminal:
   ```bash
   git add "ml/tata-frontend/app.js"
   git commit -m "Update API_BASE to live Render URL"
   git push origin main
   ```

---

## Part 3: Deploying the Frontend on Vercel

Vercel is perfect for this because we've already included a `vercel.json` file that handles the configurations for you!

1. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. From your dashboard, click **"Add New"** > **"Project"**.
3. Under the *Import Git Repository* section, find `tata_sales-analysis` and click **Import**.
4. Fill in the deployment settings exactly as follows:

   - **Project Name**: `tata-motors-platform`
   - **Framework Preset**: `Other`
   - **Root Directory**: Click "Edit", select `ml/tata-frontend`, and click **Continue**. *(Very Important!)*

5. Expand the **Build and Output Settings** section and ensure everything is toggled **Off** or left blank. (Since this is Vanilla HTML/JS, it requires no build command, and our `vercel.json` securely handles routing!)
6. Click **Deploy**.

Vercel will take less than 15 seconds to deploy your frontend. Once the confetti pops on your screen, click **Continue to Dashboard** and click **Visit** to see your live, fully operational Tata Motors Sales Intelligence Platform!
