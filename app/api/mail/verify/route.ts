import { NextRequest, NextResponse } from "next/server"
import { adminServices } from "@/lib/firebase-admin"
import { sendDamAcademyMail } from "@/lib/damacademy-mail"

export const runtime = "nodejs"
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1]
    if (!token) return NextResponse.json({ error: "Sesión requerida" }, { status: 401 })
    const { auth } = adminServices()
    const decoded = await auth.verifyIdToken(token, true)
    const user = await auth.getUser(decoded.uid)
    if (!user.email) return NextResponse.json({ error: "Usuario sin correo" }, { status: 400 })
    if (user.emailVerified) return NextResponse.json({ ok: true, verified: true })
    const testRecipient = process.env.RESEND_TEST_RECIPIENT?.trim().toLowerCase()
    if (user.email.toLowerCase() !== testRecipient) return NextResponse.json({ useFirebase: true })
    const link = await auth.generateEmailVerificationLink(user.email)
    await sendDamAcademyMail(user.email, link, "verify")
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error verificación personalizada", error instanceof Error ? error.message : "Error")
    return NextResponse.json({ useFirebase: true }, { status: 503 })
  }
}
