import { NextRequest, NextResponse } from "next/server"
import { createHash } from "node:crypto"
import { adminServices } from "@/lib/firebase-admin"
import { sendDamAcademyMail } from "@/lib/damacademy-mail"
import { Timestamp } from "firebase-admin/firestore"

export const runtime = "nodejs"
const generic = { ok: true }
export async function POST(request: NextRequest) {
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "Petición inválida" }, { status: 400 }) }
  const email = typeof body === "object" && body !== null && "email" in body && typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!email || email.length > 254) return NextResponse.json({ error: "Correo inválido" }, { status: 400 })
  const testRecipient = process.env.RESEND_TEST_RECIPIENT?.trim().toLowerCase()
  if (!testRecipient || email !== testRecipient) return NextResponse.json({ useFirebase: true })
  try {
    const { auth, firestore } = adminServices()
    // Límite persistente de 1 intento cada 10 minutos para la cuenta de pruebas.
    const hash = createHash("sha256").update(email).digest("hex")
    const docRef = firestore.collection("mail_rate_limits").doc(hash)
    const allowed = await firestore.runTransaction(async (tx) => {
      const snap = await tx.get(docRef)
      const last = snap.data()?.lastSent?.toMillis?.() || 0
      if (Date.now() - last < 10 * 60_000) return false
      tx.set(docRef, { lastSent: Timestamp.now() })
      return true
    })
    if (!allowed) return NextResponse.json(generic)
    try {
      const link = await auth.generatePasswordResetLink(email)
      await sendDamAcademyMail(email, link, "reset")
    } catch (err) {
      console.error("Envío de recuperación de prueba fallido", err instanceof Error ? err.message : "Error")
      // No revelar si el usuario existe.
    }
    return NextResponse.json(generic)
  } catch (err) {
    console.error("Configuración recuperación", err instanceof Error ? err.message : "Error")
    return NextResponse.json({ useFirebase: true }, { status: 503 })
  }
}
