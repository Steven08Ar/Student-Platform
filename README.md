# Class Organization Platform

A serverless web platform for organizing classes, built with React, Vite, Firebase, and Tailwind CSS.

## Features
- **Roles**: Teacher (manage classes) and Student (view/interact).
- **Authentication**: Firebase Auth with role-based routing.
- **Database**: Firestore for real-time data.
- **UI**: Modern and responsive design using ShadCN UI + Tailwind.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Create a project in [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password).
   - Enable **Firestore Database**.
   - Copy your Firebase config keys.
   - Rename `.env.example` to `.env` and fill in the values.

3. **Deploy Security Rules**
   - Copy the contents of `firestore.rules` to your Firestore Rules tab in the console.

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

1. Push this code to GitHub.
2. Import the project in Vercel.
3. In Vercel Project Settings -> Environment Variables, add all the variables from your `.env` file.
4. Deploy!

## Architecture
- **Frontend Only**: No custom backend server needed.
- **Serverless**: Uses Firebase for all backend logic (Auth, DB).
- **Security**: Handled via Firestore Rules and client-side routing checks.
