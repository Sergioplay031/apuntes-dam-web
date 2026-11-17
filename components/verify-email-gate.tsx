"use client"
import { useState } from "react"
import { sendEmailVerification, signOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function VerifyEmailGate({ user, onVerified }: { user: User; onVerified: () => void }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  async function check() {
    setBusy(true); setMessage("")
    try {
      await user.reload()
      if (user.emailVerified) {
        await user.getIdToken(true)
        onVerified()
      } else setMessage("Tu correo aún no está verificado. Abre el enlace recibido y vuelve a comprobarlo.")
    } catch { setMessage("No se pudo comprobar el estado. Inténtalo de nuevo.") }
    finally { setBusy(false) }
  }
  async function resend() {
    setBusy(true); setMessage("")
    try {
      const token = await user.getIdToken()
      const response = await fetch("/api/mail/verify", { method: "POST", headers: { Authorization: `Bearer ${token}` } })
      const data = await response.json()
      if (data.verified) { await check(); return }
      if (data.rateLimited) { setMessage("Espera un minuto antes de solicitar otro correo."); return }
      if (data.useFirebase) await sendEmailVerification(user)
      else if (!response.ok) throw new Error("No se pudo enviar")
      setMessage("Si no has recibido el correo, comprueba también la carpeta de spam.")
    } catch (error) {
      setMessage("No se pudo reenviar el correo. Espera unos minutos e inténtalo de nuevo.")
    } finally { setBusy(false) }
  }
  return <main style={{minHeight:"100vh",background:"#0b0d19",color:"#f8f8ff",display:"grid",placeItems:"center",padding:24,fontFamily:"Arial,sans-serif"}}>
    <section style={{maxWidth:510,width:"100%",padding:32,background:"#171b2d",border:"1px solid #343954",borderRadius:18,textAlign:"center"}}>
      <h1 style={{color:"#a99bff",fontSize:29,marginBottom:24}}>DamAcademy</h1>
      <h2 style={{fontSize:24,marginBottom:14}}>Verifica tu correo electrónico</h2>
      <p style={{color:"#c4c9db",lineHeight:1.7}}>Te hemos enviado un enlace de verificación a <strong>{user.email}</strong>. Confirma tu dirección para acceder a tu cuenta.</p>
      <button disabled={busy} onClick={check} style={{width:"100%",background:"#7964f5",color:"white",padding:14,border:0,borderRadius:9,marginTop:20,cursor:"pointer",fontWeight:700}}>Ya he verificado mi correo</button>
      <button disabled={busy} onClick={resend} style={{width:"100%",background:"transparent",color:"#c4b9ff",padding:13,border:"1px solid #7964f5",borderRadius:9,marginTop:12,cursor:"pointer"}}>Reenviar correo de verificación</button>
      <button disabled={busy} onClick={() => auth && signOut(auth)} style={{marginTop:18,color:"#c4c9db",background:"none",border:0,cursor:"pointer"}}>Cerrar sesión</button>
      {message && <p role="status" style={{color:"#ddd5ff",fontSize:14,lineHeight:1.5}}>{message}</p>}
    </section>
  </main>
}
