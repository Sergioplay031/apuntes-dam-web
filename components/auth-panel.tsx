"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { createPortal } from "react-dom"
import { createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile, type User } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db, firebaseReady } from "@/lib/firebase"

export function AuthPanel({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"login" | "register" | "reset">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  async function sendVerification(userToVerify: User) {
    try {
      const token = await userToVerify.getIdToken()
      const response = await fetch("/api/mail/verify", { method: "POST", headers: { Authorization: `Bearer ${token}` } })
      const data = await response.json()
      if (data.ok) return
    } catch { /* Firebase enviará el correo predeterminado como respaldo. */ }
    await sendEmailVerification(userToVerify)
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!auth || !db) return
    setBusy(true); setMessage("")
    try {
      if (mode === "reset") {
        let useFirebase = true
        try {
          const response = await fetch("/api/mail/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
          const data = await response.json()
          useFirebase = Boolean(data.useFirebase) || !response.ok
        } catch { /* Usar Firebase como respaldo. */ }
        if (useFirebase) await sendPasswordResetEmail(auth, email)
        setMessage("Si la cuenta existe, recibirás instrucciones para recuperar el acceso.")
      } else if (mode === "register") {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name.trim() })
        await setDoc(doc(db, "users", result.user.uid), { nombre: name.trim(), email: result.user.email, role: "student" })
        await setDoc(doc(db, "directory", result.user.uid), { nombre: name.trim() })
        try { await sendVerification(result.user) } catch { /* Puede solicitarse de nuevo desde la cuenta. */ }
        setOpen(false)
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password)
        if (db && result.user.displayName) await setDoc(doc(db, "directory", result.user.uid), { nombre: result.user.displayName }, { merge: true })
        if (db && result.user.email) await setDoc(doc(db, "users", result.user.uid), { email: result.user.email }, { merge: true })
        setOpen(false)
      }
    } catch (error) {
      const code = (error as {code?: string}).code
      setMessage(code === "auth/email-already-in-use" ? "Ese correo ya está registrado." : code === "auth/weak-password" ? "La contraseña debe tener al menos 6 caracteres." : code === "auth/invalid-email" ? "Introduce un correo válido." : code === "auth/invalid-credential" ? "Correo o contraseña incorrectos." : "No se pudo completar la operación. Comprueba los datos y vuelve a intentarlo.")
    } finally { setBusy(false) }
  }
  if (!firebaseReady) return <span style={{fontSize:12}}>Configura Firebase en Vercel</span>
  return <div style={{display:"flex",alignItems:"center",gap:8}}>
    {user ? <><span style={{fontSize:12}}>{user.displayName || user.email}</span>{!user.emailVerified && <button className="subtle-button" disabled={busy} onClick={async () => { setBusy(true); try { await sendVerification(user); alert("Revisa tu correo. Si ya lo verificaste, actualiza la página.") } catch { alert("No se pudo enviar la verificación. Inténtalo más tarde.") } finally { setBusy(false) } }}>Reenviar verificación</button>}<button className="subtle-button" onClick={() => auth && signOut(auth)}>Salir</button></> : <button className="primary-button" onClick={() => {setMode("login");setMessage("");setOpen(true)}}>Entrar / Registrarse</button>}
    {open && createPortal(<div role="dialog" aria-modal="true" aria-label="Acceso a DamAcademy" style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(4,6,18,.76)",backdropFilter:"blur(9px)",display:"grid",placeItems:"center",padding:16}}>
      <div style={{background:"#171b2b",color:"#fff",border:"1px solid #50566b",borderRadius:18,padding:26,width:"min(420px,100%)",boxShadow:"0 24px 90px #000b",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{fontSize:22}}>{mode === "login" ? "Iniciar sesión" : mode === "register" ? "Crear cuenta" : "Recuperar contraseña"}</h2><button onClick={() => setOpen(false)} aria-label="Cerrar" style={{fontSize:24}}>×</button></div>
        <form onSubmit={submit} style={{display:"grid",gap:12,marginTop:18}}>
          {mode === "register" && <label>Nombre<input required minLength={2} maxLength={80} value={name} onChange={e => setName(e.target.value)} style={field}/></label>}
          <label>Correo electrónico<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={field}/></label>
          {mode !== "reset" && <label>Contraseña<div style={{position:"relative",marginTop:5}}><input type={showPassword ? "text" : "password"} required minLength={6} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} style={{...field,marginTop:0,paddingRight:48}}/><button type="button" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword} onClick={() => setShowPassword(v => !v)} style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",background:"transparent",border:0,color:"#c4b5fd",cursor:"pointer",padding:"6px 4px",display:"flex",alignItems:"center"}}>{showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}</button></div></label>}
          {message && <p role="status" style={{fontSize:13}}>{message}</p>}
          <button disabled={busy} type="submit" className="primary-button">{busy ? "Procesando..." : mode === "login" ? "Entrar" : mode === "register" ? "Registrarme" : "Enviar correo"}</button>
        </form>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:18}}>{mode !== "login" && <button onClick={() => {setMode("login");setMessage("")}}>Ya tengo cuenta</button>}{mode !== "register" && <button onClick={() => {setMode("register");setMessage("")}}>Crear cuenta</button>}{mode !== "reset" && <button onClick={() => {setMode("reset");setMessage("")}}>Olvidé mi contraseña</button>}</div>
      </div>
    </div>, document.body)}
  </div>
}
const field: React.CSSProperties = {display:"block",width:"100%",marginTop:5,padding:11,borderRadius:8,background:"#242a3e",color:"white",border:"1px solid #646a7d"}
