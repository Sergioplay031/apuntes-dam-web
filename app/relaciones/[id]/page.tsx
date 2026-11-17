import { notFound } from "next/navigation"
import { getRelacion } from "@/lib/relaciones-interactivas"
import { RelacionWorkspace } from "@/components/relacion-workspace"
export default async function Page({params}:{params:Promise<{id:string}>}) {
 const {id}=await params
 const ejercicio=getRelacion(id)
 if(!ejercicio) notFound()
 return <RelacionWorkspace ejercicio={ejercicio}/>
}
