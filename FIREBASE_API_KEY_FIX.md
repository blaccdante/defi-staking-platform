# 🔥 Firebase API Key Fix Guide

## ❌ Current Issue
```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.).
```

## ✅ Solution: Update Your API Key

### Step 1: Access Firebase Console
1. Open your browser and go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Look for your project named `defi-staking-platform`

### Step 2: Get the Correct API Key

**If your project exists:**
1. Click on `defi-staking-platform` project
2. Click the gear icon ⚙️ next to "Project Overview"
3. Select **Project Settings**
4. Scroll down to **Your apps** section
5. You should see a web app configuration

**If your project doesn't exist:**
1. Click **Create a project**
2. Name it `defi-staking-platform`
3. Follow the setup wizard
4. After creation, click **Add app** and select the web icon `</>`
5. Register your app with name "DeFi Staking Platform"

### Step 3: Copy the Complete Configuration
You'll see something like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // FULL 39-character key
  authDomain: "defi-staking-platform.firebaseapp.com",
  projectId: "defi-staking-platform",
  storageBucket: "defi-staking-platform.appspot.com",
  messagingSenderId: "688919996953",
  appId: "1:688919996953:web:dfd94df56ed2eb644a588b"
};
```

### Step 4: Update Your .env File
Replace the line in your `.env` file:
```bash
# Change this:
VITE_FIREBASE_API_KEY=REPLACE_WITH_FULL_API_KEY_FROM_FIREBASE_CONSOLE

# To this (with your actual API key):
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Enable Authentication
While you're in Firebase Console:
1. Go to **Authentication** from the left sidebar
2. Click **Get started** if it's your first time
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Enable it and click **Save**

### Step 6: Set Up Firestore (if needed)
1. Go to **Firestore Database** from the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose the one closest to you)

### Step 7: Test the Fix
1. Save your `.env` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Try creating an account again

## 🚨 Common Issues

**Issue: "Project not found"**
- Make sure the project ID in `.env` matches exactly what's in Firebase Console

**Issue: "API key still invalid"**
- Make sure you copied the COMPLETE API key (usually ~40 characters)
- Check for extra spaces or missing characters

**Issue: "Operation not allowed"**
- Make sure Email/Password authentication is enabled in Firebase Console

## ✅ Success Indicators
When it's working, you should see:
- No more API key errors
- Firebase debug panel shows green checkmarks
- Account creation works without errors

## Need Help?
If you're still having issues, share:
1. The exact error message you see
2. Whether the project exists in Firebase Console
3. The first 10 and last 5 characters of your API key (for verification)