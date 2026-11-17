"use client"
import dynamic from "next/dynamic"
import Link from "next/link"
import {useEffect,useState} from "react"
import {ArrowLeft,Play,Save,RotateCcw,Eye,EyeOff,Copy,Lightbulb} from "lucide-react"
import type {RelacionInteractiva} from "@/lib/relaciones-interactivas"
const Editor=dynamic(()=>import("@monaco-editor/react"),{ssr:false})
let completionsRegistered=false
function registerJavaCompletions(monaco: typeof import("monaco-editor")) {
 if(completionsRegistered)return
 completionsRegistered=true
 monaco.languages.registerCompletionItemProvider("java",{
  triggerCharacters:[".","S"],
  provideCompletionItems:(model,position)=>{
   const range={startLineNumber:position.lineNumber,endLineNumber:position.lineNumber,startColumn:model.getWordUntilPosition(position).startColumn,endColumn:model.getWordUntilPosition(position).endColumn}
   const snippets=[
    ["sout","System.out.println(${1:mensaje});","Imprimir en consola"],
    ["scanner","Scanner ${1:teclado} = new Scanner(System.in);","Leer datos por teclado"],
    ["main","public static void main(String[] args) {\n    ${1:// código}\n}","Método principal"],
    ["for","for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3:// código}\n}","Bucle for"],
    ["if","if (${1:condicion}) {\n    ${2:// código}\n}","Condicional"],
    ["while","while (${1:condicion}) {\n    ${2:// código}\n}","Bucle while"],
    ["trycatch","try {\n    ${1:// código}\n} catch (Exception e) {\n    System.out.println(e.getMessage());\n}","Manejo de excepciones"],
   ]
   return {suggestions:snippets.map(([label,insertText,documentation])=>({label,kind:monaco.languages.CompletionItemKind.Snippet,insertText,insertTextRules:monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,documentation,range}))}
  }
 })
}
const solucionesEjemplo:Record<string,string>={
 "rel-1":"// 0: int; -90.234: double; -90: int; -90.0: double;\n// 'A': char; \"Almería\": String; falso: no es literal Java (false sí).\n// \"falso\" y \"-90\": String.",
 "rel-2":"// XYZ y _xyz: válidos; 'valor': inválido (comillas);\n// 56vértice: inválido (empieza por número); indice28 y año: válidos;\n// año&actual: inválido (&); año_actual y ZZZZ: válidos.",
 "rel-3":"int auxiliar = a;\na = b;\nb = auxiliar;",
 "rel-4":"int auxiliar = a;\na = c;\nc = b;\nb = auxiliar;"
}
const base=`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Escribe aquí tu solución
    }
}
`
export function RelacionWorkspace({ejercicio}:{ejercicio:RelacionInteractiva}){
 const [code,setCode]=useState(base),[input,setInput]=useState(""),[output,setOutput]=useState(""),[busy,setBusy]=useState(false),[showGuide,setShowGuide]=useState(false),[showSolution,setShowSolution]=useState(false),[done,setDone]=useState(false)
 const key=`damacademy-relacion-${ejercicio.id}`
 useEffect(()=>{try{setCode(localStorage.getItem(key)??base);setDone(localStorage.getItem(key+"-done")==="true")}catch{}},[key])
 function change(v:string|undefined){const n=v??"";setCode(n);try{localStorage.setItem(key,n)}catch{}}
 async function run(){setBusy(true);setOutput("Compilando y ejecutando…");try{const response=await fetch("/api/ejecutar-java",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code,input})});const data=await response.json();setOutput(data.output||data.error||"Sin salida") }catch{setOutput("No se pudo contactar con el servicio de ejecución.")}finally{setBusy(false)}}
 function toggle(){const n=!done;setDone(n);try{localStorage.setItem(key+"-done",String(n))}catch{}}
 return <main className="rel-page"><div className="rel-top"><Link href="/?section=Ejercicios"><ArrowLeft size={17}/> Volver a ejercicios</Link><span>{ejercicio.topic} · Relaciones de ejercicios</span></div><div className="rel-heading"><div><span className="rel-kicker">{ejercicio.category}</span><h1>{ejercicio.title}</h1><p>Enunciado extraído de la relación de clase · página {ejercicio.sourcePage}</p></div><button className="rel-done" onClick={toggle}>{done?"✓ Completado":"Marcar completado"}</button></div><div className="rel-layout"><div className="rel-main"><section className="rel-card"><h2>Enunciado</h2><pre className="rel-statement">{ejercicio.prompt}</pre></section><section className="rel-card rel-code"><div className="rel-code-head"><h2>Tu solución en Java</h2><div><button onClick={()=>change(base)}><RotateCcw size={15}/> Reiniciar</button><button onClick={()=>navigator.clipboard.writeText(code)}><Copy size={15}/> Copiar</button></div></div><Editor height="440px" language="java" theme="vs-dark" beforeMount={registerJavaCompletions} value={code} onChange={change} options={{minimap:{enabled:false},fontSize:16,wordWrap:"on",automaticLayout:true,quickSuggestions:true,suggestOnTriggerCharacters:true,tabCompletion:"on",wordBasedSuggestions:"currentDocument",bracketPairColorization:{enabled:true},formatOnPaste:true}}/><div className="rel-saved"><Save size={14}/> Guardado automático · Pulsa Ctrl + Espacio para autocompletar · Tab para aceptar</div></section><section className="rel-card"><h2>Ejecutar código</h2><p className="rel-muted">Introduce los datos que leería Scanner, uno por línea si hace falta.</p><textarea className="rel-input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Entrada estándar (opcional)" rows={3}/><button className="rel-run" onClick={run} disabled={busy}><Play size={16}/>{busy?"Ejecutando…":"Ejecutar Java"}</button><h3>Consola</h3><pre className="rel-console">{output||"La salida aparecerá aquí."}</pre></section></div><aside className="rel-side"><section className="rel-card"><h2>Ayuda para resolverlo</h2><p>Lee el enunciado, identifica las entradas, calcula el resultado y muéstralo con System.out.println. Si el ejercicio es teórico, puedes usar el editor para comprobar tus hipótesis.</p><button className="rel-guide" onClick={()=>setShowGuide(!showGuide)}>{showGuide?<EyeOff size={15}/>:<Eye size={15}/>} {showGuide?"Ocultar orientación":"Ver orientación"}</button>{showGuide&&<div className="rel-guidance"><strong>Cómo abordarlo</strong><p>1. Identifica qué pide exactamente el enunciado.</p><p>2. Decide si necesitas Scanner, variables, condiciones o bucles.</p><p>3. Escribe el programa y prueba casos límite.</p><p>4. Comprueba que la salida coincide con lo solicitado.</p><small>Esta orientación no es una solución oficial del profesor. No se ha inventado código resuelto para ejercicios sin solución verificada.</small></div>}</section><section className="rel-card"><h2><Lightbulb size={17}/> Ver solución</h2><p>Consulta una solución orientativa después de intentarlo.</p><button className="rel-guide" onClick={()=>setShowSolution(!showSolution)}>{showSolution?<EyeOff size={15}/>:<Eye size={15}/>} {showSolution?"Ocultar solución":"Ver solución"}</button>{showSolution&&(solucionesEjemplo[ejercicio.id]?<><p className="rel-muted">Ejemplo didáctico, no solución oficial del profesor.</p><pre className="rel-solution">{solucionesEjemplo[ejercicio.id]}</pre></>:<p className="rel-guidance">Este ejercicio todavía no tiene una solución revisada. No mostraremos código ficticio como si resolviera el enunciado.</p>)}</section><section className="rel-card"><h2>Sobre la ejecución</h2><p>La ejecución requiere un servicio externo de Java configurado en Vercel. Si no está configurado, el botón indicará cómo habilitarlo.</p><p>Evita introducir contraseñas o datos privados en el editor.</p></section></aside></div></main>
}
