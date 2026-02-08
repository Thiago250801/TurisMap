import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { initializeAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";

/**
 * Safer Firebase initialization
 *
 * - Uses `process.env.EXPO_PUBLIC_*` variables (as requested)
 * - Emits developer-friendly warnings if some env vars are missing
 * - Guards against double initialization (useful in hot-reload/dev)
 * - Wraps auth / firestore initialization in try/catch so app can fail gracefully
 */

const REQUIRED_ENVS = [
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID",
];

const missing = REQUIRED_ENVS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Use console.warn so the app still runs in environments where envs are injected differently.
  // This message helps developers configure Expo `.env.local` or app config.
  // Do not throw here to avoid breaking e.g. tests or environments where you intentionally
  // provide config elsewhere.
  // eslint-disable-next-line no-console
  console.warn(
    `[Firebase] Missing environment variables: ${missing.join(
      ", ",
    )}. Firebase may not initialize correctly.`,
  );
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: any = null;

try {
  // Avoid double initialization (helpful in dev / HMR)
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.error("[Firebase] initializeApp error:", error);
  // Re-throwing here would stop the app; prefer to surface error and let callers handle absence of `app`.
  // throw error;
}

try {
  if (app) {
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (authInitError) {
      // If initializeAuth fails (platform differences), warn but continue.
      // eslint-disable-next-line no-console
      console.warn(
        "[Firebase] initializeAuth failed - auth might be unavailable in this environment.",
        authInitError,
      );
      auth = null;
    }
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn("[Firebase] Auth initialization unexpected error:", e);
  auth = null;
}

try {
  if (app) {
    db = getFirestore(app);
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Firebase] getFirestore failed - Firestore may be unavailable.",
    e,
  );
  db = null;
}

/**
 * Exports:
 * - `app`: Firebase app instance (or null if initialization failed)
 * - `auth`: Firebase Auth instance (or null)
 * - `db`: Firestore instance (or null)
 *
 * Callers should handle the possibility of `null` (especially in tests or environments
 * where env variables aren't present). In typical device/emulator usage with envs set,
 * these will be non-null.
 */
export { app, auth, db };

/**
 * Backwards-compatible alias used by services in this codebase.
 * Some modules import `{ dbAny as db }` — provide a named export `dbAny`
 * that points to the same underlying Firestore instance (or null).
 */
export const dbAny: any = db;
