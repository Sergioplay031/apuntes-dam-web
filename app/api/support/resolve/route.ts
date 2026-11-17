import { NextRequest, NextResponse } from "next/server"
import { adminServices } from "@/lib/firebase-admin"
export const runtime="nodejs"
export async function POST(request:NextRequest){
 try{
  const token=request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1]
  if(!token)return NextResponse.json({error:"Sesión requerida"},{status:401})
  const {auth,firestore}=adminServices()
  const caller=await auth.verifyIdToken(token,true)
  const roleSnap=await firestore.collection("users").doc(caller.uid).get()
  if(!["admin","superadmin"].includes(String(roleSnap.data()?.role)))return NextResponse.json({error:"No autorizado"},{status:403})
  const {ticketId}=await request.json()
  if(typeof ticketId!=="string"||!/^[a-zA-Z0-9]{10,40}$/.test(ticketId))return NextResponse.json({error:"Ticket inválido"},{status:400})
  const ref=firestore.collection("tickets").doc(ticketId)
  if(!(await ref.get()).exists)return NextResponse.json({error:"Ticket no encontrado"},{status:404})
  // Elimina también todos los mensajes de la subcolección.
  await firestore.recursiveDelete(ref)
  return NextResponse.json({ok:true})
 }catch(error){console.error("Error cerrando soporte",error instanceof Error?error.message:"Error");return NextResponse.json({error:"No se pudo resolver"},{status:500})}
}
