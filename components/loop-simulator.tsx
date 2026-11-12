"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ChevronLeft, ChevronRight, CircleDot, RotateCcw, Terminal } from "lucide-react"
import { simulateJavaLoop } from "@/lib/loop-simulator"

export function LoopSimulator({ code }: { code: string }) {
  const events = useMemo(() => simulateJavaLoop(code), [code])
  const [step, setStep] = useState(-1)
  const active = step >= 0 ? events[step] : undefined
  const currentVariables = active?.variables ?? {}
  const currentOutput = active?.output ?? []

  return <section className="learn-block loop-simulator" aria-labelledby="loop-simulator-title">
    <div className="section-kicker"><span>F</span> SIMULADOR DE EJECUCIÓN</div>
    <div className="loop-simulator-heading"><div><h2 id="loop-simulator-title">Recorre el código paso a paso</h2><p>La traza se genera a partir del mismo código Java que aparece en esta lección. Cada avance comprueba la condición, actualiza las variables o añade una línea a consola.</p></div><span className="loop-event-count">{events.length} pasos</span></div>

    <div className="loop-simulator-grid">
      <section className="loop-code-panel" aria-label="Código Java con línea activa">
        <div className="loop-code-header"><span><i className="java-file">J</i> Código de la lección</span><span>Java</span></div>
        <pre className="loop-source-code">{code.split("\n").map((line, index) => <code className={active?.line === index + 1 ? "loop-active-line" : ""} key={`${index}-${line}`}><span>{String(index + 1).padStart(2, "0")}</span>{line || " "}</code>)}</pre>
      </section>

      <div className="loop-inspector">
        <section className="loop-state-card"><div className="loop-state-title"><CircleDot size={15}/> PASO ACTUAL</div><strong>{active ? `${step + 1} / ${events.length}` : "Listo para iniciar"}</strong><p>{active?.description ?? "Avanza para ver qué instrucción ejecuta Java primero."}</p>{active?.kind === "condition" && <div className={`loop-condition ${active.conditionResult ? "condition-true" : "condition-false"}`}><code>{active.condition}</code><span>{active.conditionResult ? "VERDADERA · entra al cuerpo" : "FALSA · sale del bucle"}</span></div>}</section>

        <section className="loop-state-card"><div className="loop-state-title"><ArrowDown size={15}/> VALORES DE VARIABLES</div>{Object.keys(currentVariables).length ? <div className="loop-variable-list">{Object.entries(currentVariables).map(([name, value]) => <div key={name}><code>{name}</code><strong>{value}</strong></div>)}</div> : <p className="loop-empty-state">Las variables aparecerán al iniciar.</p>}</section>

        <section className="loop-state-card loop-output-card"><div className="loop-state-title"><Terminal size={15}/> SALIDA ACUMULADA</div><pre>{currentOutput.length ? currentOutput.join("\n") : "La consola aún está vacía."}</pre></section>
      </div>
    </div>

    <div className="loop-controls" role="group" aria-label="Controles de simulación">
      <button className="loop-control-secondary" disabled={step <= 0} onClick={() => setStep((value) => Math.max(-1, value - 1))}><ChevronLeft size={15}/> Paso anterior</button>
      <button className="loop-control-primary" disabled={step >= events.length - 1} onClick={() => setStep((value) => Math.min(events.length - 1, value + 1))}>{step < 0 ? "Iniciar simulación" : "Siguiente paso"}<ChevronRight size={15}/></button>
      <button className="loop-control-secondary" disabled={step < 0} onClick={() => setStep(-1)}><RotateCcw size={14}/> Reiniciar</button>
    </div>

    <div className="loop-trace-heading"><div><strong>Historial de ejecución</strong><span>Las filas registran el estado después de cada instrucción.</span></div><span>{Math.max(0, step + 1)} de {events.length}</span></div>
    <div className="sim-table-wrap loop-trace-wrap"><table className="sim-table"><thead><tr><th>Paso</th><th>Línea</th><th>Tipo</th><th>Variables</th><th>Condición / efecto</th></tr></thead><tbody>{events.slice(0, step + 1).map((event, index) => <tr className={index === step ? "current-row" : ""} key={`${event.line}-${index}`}><td>{index + 1}</td><td><code>{event.line}</code></td><td>{event.kind === "initialization" ? "Inicialización" : event.kind === "condition" ? "Condición" : event.kind === "update" ? "Actualización" : event.kind === "output" ? "Salida" : "Instrucción"}</td><td><code>{Object.entries(event.variables).map(([name, value]) => `${name}=${value}`).join(", ") || "—"}</code></td><td>{event.kind === "condition" ? <><code>{event.condition}</code> → <strong className={event.conditionResult ? "condition-text-true" : "condition-text-false"}>{String(event.conditionResult)}</strong></> : event.description}</td></tr>)}</tbody></table>{step < 0 && <div className="table-empty">Pulsa «Iniciar simulación» para comenzar la traza.</div>}</div>
  </section>
}
