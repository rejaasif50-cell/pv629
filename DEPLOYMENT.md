# Reza Enterprise PVC Print - Deployment & Hosting Guide

This project is a modern, responsive single-page web application built with **React**, **Vite**, **Tailwind CSS**, and optional **Firebase** (Authentication, Firestore, Storage) integration.

---

## 1. Firebase Hosting Deployment

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase in Project
In the root directory of this project, run:
```bash
firebase init
```
- Select: **Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys**
- Select: **Use an existing project** (choose your Firebase project)
- What do you want to use as your public directory? -> Type: `dist`
- Configure as a single-page app (rewrite all urls to /index.html)? -> Type: `Yes`
- Set up automatic builds and deploys with GitHub? -> Optional (`Yes` or `No`)

### Step 4: Add Firebase Configuration
The project is pre-configured with your Firebase Project (`v111d-a3ee2`) in `src/config/firebase.ts`:
```env
VITE_FIREBASE_API_KEY=AIzaSyAdQNE9TtUfc0k7rBfiq7nFmL_oXmLT2Zk
VITE_FIREBASE_AUTH_DOMAIN=v111d-a3ee2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=v111d-a3ee2
VITE_FIREBASE_STORAGE_BUCKET=v111d-a3ee2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=681929047534
VITE_FIREBASE_APP_ID=1:681929047534:web:3b1ff24cc88ba59a0fe2ff
VITE_FIREBASE_MEASUREMENT_ID=G-ZHW0KNGK9K
```

### Step 5: Build & Deploy
```bash
npm run build
firebase deploy --only hosting
```
Your website will be live at `https://<your-project-id>.web.app` or `https://<your-project-id>.firebaseapp.com`.

---

## 2. GitHub Pages Deployment

### Option A: Using Vite Base & gh-pages
1. In `vite.config.ts`, set the base path if hosting on a project repository:
   ```ts
   export default defineConfig({
     base: '/repository-name/',
     plugins: [react(), tailwindcss()],
   });
   ```
2. Build the app:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your `gh-pages` branch using the `gh-pages` npm package or GitHub Actions.

---

## 3. Key Features Built-in

- **Customer Flow:**
  - Hero showcase with 13 PVC card services
  - High-res photo & document upload (PDF, JPG, PNG) with file size validation
  - Real-time coupon validator (`WELCOME50`, `BULK10`, `FESTIVE100`)
  - Dynamic QR code generation for UPI payments (`upi://pay?pa=...`)
  - Order ID generator (`REZA-PVC-2026-XXXXXX`)
  - Live order tracking with status timeline
  - Printable tax invoices with GST and itemized breakdown
  - Floating WhatsApp support & direct helpline click-to-chat
- **Admin Control Panel:**
  - Dashboard analytics: Total orders, revenue, pending reviews, printing queues
  - Order Management: 12-stage status progression, courier AWB assignment, file downloads
  - Payment Verifications: Approval & rejection with UTR & screenshot inspection
  - Card Services: Add, edit prices (regular vs offer), badges, and upload guidelines
  - Website & UPI Settings: Update UPI ID, merchant name, shipping charges, free delivery thresholds, and announcements
- **Demo Credentials:**
  - **Admin Login:** `admin@rezaenterprise.com` / `admin123`
  - **Customer Login:** `customer@demo.com` / `customer123`
