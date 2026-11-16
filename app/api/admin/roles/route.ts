import { NextRequest, NextResponse } from "next/server"
import { adminServices } from "@/lib/firebase-admin"

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1]
    if (!token) return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 })
    const { auth, firestore } = adminServices()
    const caller = await auth.verifyIdToken(token, true)
    if (caller.superadmin !== true) return NextResponse.json({ error: "Acceso restringido" }, { status: 403 })
    const body = await req.json()
    const uid = body?.uid
    const role = body?.role
    if (typeof uid !== "string" || uid.length > 128 || !["student", "admin"].includes(role)) {
      return NextResponse.json({ error: "Datos no válidos" }, { status: 400 })
    }
    if (uid === caller.uid) return NextResponse.json({ error: "No puedes cambiar tu propio rol" }, { status: 400 })
    const target = await auth.getUser(uid)
    if (target.customClaims?.superadmin === true) return NextResponse.json({ error: "No se puede modificar otro superadministrador" }, { status: 403 })
    await auth.setCustomUserClaims(uid, { ...target.customClaims, admin: role === "admin", superadmin: false })
    await firestore.collection("users").doc(uid).update({ role })
    return NextResponse.json({ ok: true, role })
  } catch (error) {
    console.error("Error gestionando roles:", error)
    return NextResponse.json({ error: "No se pudo actualizar el rol" }, { status: 500 })
  }
}
