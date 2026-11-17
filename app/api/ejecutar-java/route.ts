import {NextResponse} from "next/server"
export const runtime="nodejs"
export async function POST(request:Request){
 const url=process.env.JAVA_RUNNER_URL
 if(!url)return NextResponse.json({error:"Para ejecutar Java, configura JAVA_RUNNER_URL en Vercel con un servicio compatible con la API Piston. El editor y los borradores sí funcionan sin él."},{status:503})
 let body:{code?:string;input?:string}
 try{body=await request.json()}catch{return NextResponse.json({error:"Solicitud inválida"},{status:400})}
 if(typeof body.code!=="string"||body.code.length>16000||typeof body.input!=="string"||body.input.length>4000)return NextResponse.json({error:"Código o entrada demasiado largos"},{status:400})
 try{
  const headers:Record<string,string>={"Content-Type":"application/json"}
  if(process.env.JAVA_RUNNER_TOKEN)headers.Authorization=`Bearer ${process.env.JAVA_RUNNER_TOKEN}`
  const res=await fetch(url,{method:"POST",headers,body:JSON.stringify({language:"java",version:process.env.JAVA_RUNNER_VERSION||"15.0.2",files:[{name:"Main.java",content:body.code}],stdin:body.input,compile_timeout:10000,run_timeout:5000}),signal:AbortSignal.timeout(16000),cache:"no-store"})
  if(!res.ok)return NextResponse.json({error:`Servicio de ejecución no disponible (${res.status}). Comprueba la configuración del proveedor.`},{status:502})
  const data=await res.json();const output=[data.compile?.output,data.run?.output].filter(Boolean).join("\n")
  return NextResponse.json({output:String(output||"El programa terminó sin imprimir resultados.").slice(0,16000)})
 }catch{return NextResponse.json({error:"No se pudo ejecutar Java. Comprueba el servicio externo y sus límites."},{status:502})}
}
