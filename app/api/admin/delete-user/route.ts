import { NextRequest, NextResponse } from "next/server"
import { adminServices } from "@/lib/firebase-admin"

export async function POST(req: NextRequest) {
  try {
    const bearer = req.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1]
    if (!bearer) return NextResponse.json({ error: "Inicia sesión" }, { status: 401 })
    const { auth, firestore } = adminServices()
    const caller = await auth.verifyIdToken(bearer, true)
    const callerDoc = await firestore.collection("users").doc(caller.uid).get()
    if (callerDoc.data()?.role !== "superadmin") return NextResponse.json({ error: "Solo el superadministrador puede eliminar cuentas" }, { status: 403 })
    const { uid } = await req.json()
    if (typeof uid !== "string" || !uid || uid.length > 128 || uid === caller.uid) return NextResponse.json({ error: "Usuario no válido" }, { status: 400 })
    const target = await auth.getUser(uid)
    const targetDoc = await firestore.collection("users").doc(uid).get()
    if (targetDoc.data()?.role === "superadmin" || target.customClaims?.superadmin === true) return NextResponse.json({ error: "No se puede eliminar otro superadministrador" }, { status: 403 })
    // Borrar primero Authentication: impide futuros accesos con esa cuenta.
    await auth.deleteUser(uid)
    await Promise.all([
      firestore.collection("users").doc(uid).delete(),
      firestore.collection("directory").doc(uid).delete(),
      firestore.collection("progress").doc(uid).delete(),
    ])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error al eliminar cuenta", error)
    return NextResponse.json({ error: "No se pudo completar la eliminación. Comprueba Authentication y Firestore." }, { status: 500 })
  }
}
