import { NextRequest, NextResponse } from "next/server"
import { adminServices } from "@/lib/firebase-admin"

export const runtime = "nodejs"
const escapeHtml = (value:string) => value.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c] || c)

export async function POST(request:NextRequest){
 try {
  const token=request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1]
  if(!token)return NextResponse.json({error:"Sesión requerida"},{status:401})
  const {auth,firestore}=adminServices()
  const caller=await auth.verifyIdToken(token,true)
  const {ticketId}=await request.json()
  if(typeof ticketId!=="string"||!/^[a-zA-Z0-9]{10,40}$/.test(ticketId))return NextResponse.json({error:"Ticket inválido"},{status:400})
  const ref=firestore.collection("tickets").doc(ticketId)
  const snap=await ref.get()
  if(!snap.exists||snap.data()?.ownerId!==caller.uid)return NextResponse.json({error:"No autorizado"},{status:403})
  // Transacción: evita que el mismo ticket provoque envíos repetidos.
  const reserved=await firestore.runTransaction(async tx=>{
   const current=await tx.get(ref)
   if(!current.exists||current.data()?.ownerId!==caller.uid||current.data()?.notificationAttempted)return false
   tx.update(ref,{notificationAttempted:true})
   return true
  })
  if(!reserved)return NextResponse.json({ok:true,alreadyProcessed:true})
  const key=process.env.RESEND_API_KEY,from=process.env.RESEND_FROM_EMAIL
  if(!key||!from)return NextResponse.json({ok:true,notification:"not-configured"})
  const users=await firestore.collection("users").where("role","in",["admin","superadmin"]).get()
  const testRecipient=process.env.RESEND_TEST_RECIPIENT?.trim().toLowerCase()
  const testing=from.includes("onboarding@resend.dev")
  const emails=[...new Set(users.docs.map(d=>String(d.data().email||"").trim().toLowerCase()).filter(email=>email.includes("@")&&(!testing||email===testRecipient)))]
  const subject=String(snap.data()?.subject||"Consulta de soporte").slice(0,120)
  let sent=0
  for(const email of emails){
   const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[email],subject:"Nueva consulta de soporte | DamAcademy",html:`<div style="font-family:Arial,sans-serif;background:#0b0d19;color:#fff;padding:28px"><div style="background:#171b2d;border-radius:12px;padding:24px"><h2 style="color:#a99bff">DamAcademy · Soporte</h2><p>Hay una nueva consulta pendiente.</p><p><strong>Asunto:</strong> ${escapeHtml(subject)}</p><p>Entra en DamAcademy → Mi espacio → Soporte para atenderla.</p></div></div>`,text:`Nueva consulta de soporte en DamAcademy. Asunto: ${subject}. Accede al panel de soporte.`}),cache:"no-store"})
   if(response.ok)sent++;else console.error("Error Resend soporte",response.status)
  }
  return NextResponse.json({ok:true,notificationsSent:sent})
 }catch(error){console.error("Error notificando soporte",error instanceof Error?error.message:"Error");return NextResponse.json({error:"No se pudo notificar"},{status:500})}
}
