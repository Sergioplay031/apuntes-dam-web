"use client"

import { useEffect, useRef, useState } from "react"
import { Play, RotateCcw, Terminal, CornerDownLeft, CircleCheck, LoaderCircle } from "lucide-react"
import { ejecutarJavaInteractivo } from "@/lib/java-browser-runner"

type Props = { code: string }

/** La consola acepta stdin línea a línea y reinterpreta desde el principio con las entradas acumuladas.
 * El intérprete no permite pausar/reanudar su estado: el código se vuelve a ejecutar con cada línea. */
export function JavaTerminal({ code }: Props) {
  const [input, setInput] = useState("")
  const [lines, setLines] = useState<string[]>([])
  const [waiting, setWaiting] = useState(false)
  const [running, setRunning] = useState(false)
  const [started, setStarted] = useState(false)
  const [typed, setTyped] = useState("")
  const [status, setStatus] = useState<"ready" | "waiting" | "finished" | "error">("ready")
  const request = useRef(0)
  const end = useRef<HTMLDivElement>(null)
  const entry = useRef<HTMLInputElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }) }, [lines, waiting])
  useEffect(() => { if (waiting && !running) entry.current?.focus() }, [waiting, running])

  async function execute(stdin: string) {
    const id = ++request.current
    setRunning(true)
    setWaiting(false)
    setStatus("ready")
    try {
      const result = await ejecutarJavaInteractivo(code, stdin)
      if (id !== request.current) return
      const output = result.output.trimEnd()
      // Se conserva la salida completa para no duplicar mensajes al introducir Scanner.
      setLines(output ? output.split("\n") : [])
      setWaiting(result.waiting)
      setStatus(result.waiting ? "waiting" : /^(Error|Excepción|El intérprete|La ejecución)/m.test(output) ? "error" : "finished")
    } catch {
      if (id === request.current) { setLines(["No se pudo iniciar el intérprete."]); setStatus("error") }
    } finally { if (id === request.current) setRunning(false) }
  }

  function start() {
    setInput("")
    setTyped("")
    setStarted(true)
    setLines([])
    void execute("")
  }
  function send() {
    if (!waiting || running) return
    const next = input + typed + "\n"
    setInput(next)
    setTyped("")
    void execute(next)
  }
  function clear() {
    request.current++
    setInput("")
    setTyped("")
    setLines([])
    setWaiting(false)
    setRunning(false)
    setStarted(false)
    setStatus("ready")
  }

  return <section className="dam-terminal-panel" aria-label="Consola Java interactiva">
    <div className="dam-terminal-toolbar">
      <div className="dam-terminal-heading"><span className="dam-terminal-logo"><Terminal size={18}/></span><div><strong>Consola Java</strong><small>Ejecuta tu código e introduce los datos aquí mismo</small></div></div>
      <div className="dam-terminal-buttons">
        <button type="button" className="dam-terminal-clear" onClick={clear} aria-label="Limpiar consola"><RotateCcw size={15}/> Limpiar</button>
        <button type="button" className="dam-terminal-run" onClick={start} disabled={running}><Play size={15} fill="currentColor"/>{running ? "Ejecutando…" : started ? "Volver a ejecutar" : "Ejecutar Java"}</button>
      </div>
    </div>
    <div className="dam-terminal-screen" role="log" aria-live="polite" onClick={() => { if (waiting) entry.current?.focus() }}>
      {!started && <div className="dam-terminal-placeholder"><span>&gt;_</span> Pulsa «Ejecutar Java» para iniciar tu programa.</div>}
      {lines.map((line, i) => <div className="dam-terminal-line" key={i}>{line || "\u00a0"}</div>)}
      {running && <div className="dam-terminal-working"><LoaderCircle size={14}/> Ejecutando…</div>}
      {waiting && !running && <div className="dam-terminal-entry"><span className="dam-terminal-prompt">❯</span><input ref={entry} aria-label="Escribe un dato para Scanner" autoComplete="off" spellCheck={false} value={typed} onChange={e => setTyped(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send() } }} placeholder="Escribe un dato y pulsa Enter…"/><button type="button" onClick={send} aria-label="Enviar dato"><CornerDownLeft size={16}/></button></div>}
      <div ref={end}/>
    </div>
    <div className="dam-terminal-footer"><span className={`dam-terminal-status status-${status}`}>{status === "waiting" ? "● Esperando entrada de Scanner" : status === "finished" ? <><CircleCheck size={13}/> Ejecución terminada</> : status === "error" ? "● Error de ejecución" : "● Preparado"}</span><span>Intérprete educativo · Java básico</span></div>
  </section>
}
