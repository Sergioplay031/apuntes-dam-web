import "server-only"
import { cert, getApps, initializeApp, getApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

export function adminServices() {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (!encoded) throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 no configurada")
  const account = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"))
  if (account.project_id !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) throw new Error("Proyecto de Firebase no coincide")
  const app = getApps().length ? getApp() : initializeApp({ credential: cert(account) })
  return { auth: getAuth(app), firestore: getFirestore(app) }
}
