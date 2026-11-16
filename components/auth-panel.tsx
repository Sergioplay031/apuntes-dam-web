"use client"
import { useState } from "react"
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, type User } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db, firebaseReady } from "@/lib/firebase"

export function AuthPanel({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"login" | "register" | "reset">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!auth || !db) return
    setBusy(true); setMessage("")
    try {
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email)
        setMessage("Si la cuenta existe, recibirás instrucciones para recuperar el acceso.")
      } else if (mode === "register") {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name.trim() })
        await setDoc(doc(db, "users", result.user.uid), { nombre: name.trim(), email: result.user.email, role: "student" })
        setOpen(false)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        setOpen(false)
      }
    } catch (error) {
      const code = (error as {code?: string}).code
      setMessage(code === "auth/email-already-in-use" ? "Ese correo ya está registrado." : code === "auth/weak-password" ? "La contraseña debe tener al menos 6 caracteres." : code === "auth/invalid-email" ? "Introduce un correo válido." : code === "auth/invalid-credential" ? "Correo o contraseña incorrectos." : "No se pudo completar la operación. Comprueba los datos y vuelve a intentarlo.")
    } finally { setBusy(false) }
  }
  if (!firebaseReady) return <span style={{fontSize:12}}>Configura Firebase en Vercel</span>
  return <div style={{display:"flex",alignItems:"center",gap:8}}>
    {user ? <><span style={{fontSize:12}}>{user.displayName || user.email}</span><button className="subtle-button" onClick={() => auth && signOut(auth)}>Salir</button></> : <button className="primary-button" onClick={() => {setMode("login");setMessage("");setOpen(true)}}>Entrar / Registrarse</button>}
    {open && <div role="dialog" aria-modal="true" aria-label="Acceso a DamAcademy" style={{position:"fixed",inset:0,zIndex:9999,background:"#000b",display:"grid",placeItems:"center",padding:16}}>
      <div style={{background:"#171b2b",color:"#fff",border:"1px solid #50566b",borderRadius:18,padding:26,width:"min(420px,100%)",boxShadow:"0 12px 60px #0009"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{fontSize:22}}>{mode === "login" ? "Iniciar sesión" : mode === "register" ? "Crear cuenta" : "Recuperar contraseña"}</h2><button onClick={() => setOpen(false)} aria-label="Cerrar" style={{fontSize:24}}>×</button></div>
        <form onSubmit={submit} style={{display:"grid",gap:12,marginTop:18}}>
          {mode === "register" && <label>Nombre<input required minLength={2} maxLength={80} value={name} onChange={e => setName(e.target.value)} style={field}/></label>}
          <label>Correo electrónico<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={field}/></label>
          {mode !== "reset" && <label>Contraseña<input type="password" required minLength={6} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} style={field}/></label>}
          {message && <p role="status" style={{fontSize:13}}>{message}</p>}
          <button disabled={busy} type="submit" className="primary-button">{busy ? "Procesando..." : mode === "login" ? "Entrar" : mode === "register" ? "Registrarme" : "Enviar correo"}</button>
        </form>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:18}}>{mode !== "login" && <button onClick={() => {setMode("login");setMessage("")}}>Ya tengo cuenta</button>}{mode !== "register" && <button onClick={() => {setMode("register");setMessage("")}}>Crear cuenta</button>}{mode !== "reset" && <button onClick={() => {setMode("reset");setMessage("")}}>Olvidé mi contraseña</button>}</div>
      </div>
    </div>}
  </div>
}
const field: React.CSSProperties = {display:"block",width:"100%",marginTop:5,padding:11,borderRadius:8,background:"#242a3e",color:"white",border:"1px solid #646a7d"}
