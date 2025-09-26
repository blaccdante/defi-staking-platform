# Firebase Authentication Troubleshooting Guide

## Current Issue
Account creation is not working with Firebase errors.

## Your Firebase Configuration
Based on your `.env` file, your Firebase project is configured as:
- Project ID: `defi-staking-platform`
- Auth Domain: `defi-staking-platform.firebaseapp.com`

## Step-by-Step Fix

### 1. Check Firebase Console Settings
Go to [Firebase Console](https://console.firebase.google.com/) and:

1. **Verify Project Exists**
   - Make sure the project `defi-staking-platform` exists
   - If not, create a new Firebase project

2. **Enable Authentication**
   - Go to **Authentication** → **Sign-in method**
   - Enable **Email/password** authentication
   - Make sure the toggle is ON (blue)

3. **Check Firestore Database**
   - Go to **Firestore Database**
   - If not created, click "Create database"
   - Choose "Start in test mode" for development
   - Select a location (choose closest to you)

### 2. Verify Domain Authorization
In Firebase Console → Authentication → Settings → Authorized domains:
- Make sure `localhost` is in the list
- Add `127.0.0.1` if not present
- For production, add your domain

### 3. Check API Key Status
In Firebase Console → Project Settings → General:
- Verify your API key matches the one in `.env`
- Make sure the API key is not restricted for your use case

### 4. Test Configuration
Open the `firebase-test.html` file we created in your browser and:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Click "Test Signup" button
4. Check for specific error messages

## Common Error Codes and Solutions

### `auth/invalid-api-key`
- **Problem**: API key is wrong or restricted
- **Solution**: Get fresh API key from Firebase Console

### `auth/project-not-found`
- **Problem**: Project ID is wrong or project doesn't exist
- **Solution**: Verify project ID in Firebase Console

### `auth/operation-not-allowed`
- **Problem**: Email/password authentication is not enabled
- **Solution**: Enable it in Firebase Console → Authentication → Sign-in method

### `auth/network-request-failed`
- **Problem**: Network connectivity or CORS issues
- **Solution**: Check internet connection, verify domain authorization

### `permission-denied` (Firestore)
- **Problem**: Firestore security rules are too restrictive
- **Solution**: Update Firestore rules or start in test mode

## Quick Fixes to Try

### Fix 1: Update Firestore Security Rules
If you're getting Firestore permission errors, go to Firestore → Rules and use this for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: Only for development!
    }
  }
}
```

### Fix 2: Check Environment Variables
Make sure your `.env` file has all required variables and restart the dev server after any changes.

### Fix 3: Try Different Email/Password
Some issues occur with specific email formats or weak passwords:
- Use a valid email format
- Password must be at least 6 characters
- Try with a different test email

## Next Steps
1. Open `firebase-test.html` in your browser
2. Check the console for specific errors
3. Follow the error-specific solutions above
4. Once Firebase test works, the main app should work too

## If Still Not Working
1. Share the specific error code/message you see
2. Verify all Firebase Console settings match this guide
3. Consider creating a fresh Firebase project if current one has issues