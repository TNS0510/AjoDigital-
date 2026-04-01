# Deployment Instructions: AjoDigital (Esusu) MVP

This guide provides step-by-step instructions for deploying the AjoDigital application using **Vercel** (Frontend) and **Firebase** (Backend).

## 1. Prerequisites
- A [GitHub](https://github.com) account.
- A [Vercel](https://vercel.com) account.
- A [Firebase](https://console.firebase.google.com) project (already created during development).

## 2. Prepare the Repository
1. Push your code to a new GitHub repository.
2. Ensure `.gitignore` is correctly configured to exclude `node_modules` and `dist`.

## 3. Deploy Frontend to Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository.
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables:**
   Add the following variables from your `firebase-applet-config.json`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_DATABASE_ID` (This is the `firestoreDatabaseId` field)
6. Click **"Deploy"**.

## 4. Deploy Firebase Security Rules
To ensure your data is protected in production, you must deploy the security rules.
1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```
   - Select your existing project.
   - When asked for the rules file name, use `firestore.rules`.
4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## 5. Configure Authentication Redirects
1. Go to the [Firebase Console](https://console.firebase.google.com).
2. Navigate to **Authentication** > **Settings** > **Authorized Domains**.
3. Add your Vercel deployment URL (e.g., `ajodigital.vercel.app`) to the list.

## 6. Verification
Once deployed, visit your Vercel URL and verify:
- [ ] You can sign in via Google.
- [ ] You can create a group.
- [ ] Real-time updates are working.
- [ ] Security rules are enforced (test by trying to access unauthorized data).

---
**Note:** The `server.ts` file in this repository is used for local development and previewing. Vercel will automatically handle the static serving of your Vite application in production.
