"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Code2, Copy, Eye, EyeOff, Lightbulb, Maximize2, Minimize2, PanelTop, RotateCcw, Save, Sparkles, Terminal } from "lucide-react"
import { Exercise, exercises } from "@/lib/exercise-content"
import { TextSizeControl, useTextSize } from "@/components/text-size-control"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="monaco-loading"><Code2 size={20}/> Preparando el editor Java…</div>,
})

export function ExerciseWorkspace({ exercise }: { exercise: Exercise }) {
  const { scale } = useTextSize()
  const [code, setCode] = useState(exercise.starter)
  const [ready, setReady] = useState(false)
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [focus, setFocus] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [savedAt, setSavedAt] = useState("")

  const currentIndex = exercises.findIndex((item) => item.id === exercise.id)
  const previous = exercises[(currentIndex - 1 + exercises.length) % exercises.length]
  const next = exercises[(currentIndex + 1) % exercises.length]
  const storageKey = useMemo(() => `dam-academy-exercise-${exercise.id}`, [exercise.id])

  useEffect(() => {
    setReady(false)
    setSolutionVisible(false)
    setFocus(false)
    try {
      const draft = localStorage.getItem(storageKey)
      setCode(draft ?? exercise.starter)
      const progress = JSON.parse(localStorage.getItem("dam-academy-progress") || "{}")
      setCompleted((progress.exercises || []).includes(exercise.id))
      setSavedAt(draft ? "Borrador recuperado" : "")
    } catch {
      setCode(exercise.starter)
      setCompleted(false)
    } finally {
      setReady(true)
    }
  }, [exercise.id, exercise.starter, storageKey])

  function updateCode(value: string | undefined) {
    const nextCode = value ?? ""
    setCode(nextCode)
    try {
      localStorage.setItem(storageKey, nextCode)
      setSavedAt("Guardado en este dispositivo")
    } catch {
      setSavedAt("No se pudo guardar el borrador")
    }
  }

  function toggleCompleted() {
    setCompleted((wasCompleted) => {
      const nextCompleted = !wasCompleted
      try {
        const progress = JSON.parse(localStorage.getItem("dam-academy-progress") || "{}")
        const ids: string[] = progress.exercises || []
        const exercisesDone = nextCompleted ? [...new Set([...ids, exercise.id])] : ids.filter((id) => id !== exercise.id)
        localStorage.setItem("dam-academy-progress", JSON.stringify({ ...progress, exercises: exercisesDone }))
      } catch {
        setSavedAt("No se pudo guardar el progreso")
      }
      return nextCompleted
    })
  }

  async function copyCode(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setSavedAt("No se pudo acceder al portapapeles")
    }
  }

  return <main className={`exercise-workspace ${focus ? "editor-focus" : ""}`}>
    <header className="exercise-topbar">
      <Link className="exercise-back" href="/?section=Ejercicios"><ArrowLeft size={17}/><span>Volver a ejercicios</span></Link>
      <div className="exercise-breadcrumb"><span>DAM Academy</span><ChevronRight size={14}/><span>Ejercicios</span><ChevronRight size={14}/><strong>{exercise.title}</strong></div>
      <div className="exercise-top-actions"><TextSizeControl/><span className="exercise-id">{exercise.id} / {String(exercises.length).padStart(2, "0")}</span><button className={`exercise-done-top ${completed ? "is-complete" : ""}`} onClick={toggleCompleted}><Check size={15}/>{completed ? "Completado" : "Marcar completado"}</button></div>
    </header>

    <div className="exercise-workspace-body">
      <section className="exercise-intro-block">
        <div className="exercise-intro-meta"><span className="exercise-topic-pill">{exercise.topic}</span><span className={`exercise-level ${exercise.difficulty === "Fácil" ? "level-easy" : exercise.difficulty === "Difícil" ? "level-hard" : ""}`}>{exercise.difficulty}</span><span className="exercise-concept-pill">{exercise.concept}</span><span className="exercise-time"><Clock3 size={14}/> 15–25 min</span></div>
        <div className="exercise-heading-row"><div><h1>{exercise.title}</h1><p className="exercise-goal"><Sparkles size={16}/>{exercise.goal}</p></div><div className="exercise-heading-progress"><span>{completed ? "RETO COMPLETADO" : "TU ESPACIO DE PRÁCTICA"}</span><div className="exercise-progress-track"><i style={{ width: completed ? "100%" : "35%" }}/></div></div></div>
      </section>

      <div className="exercise-main-grid">
        <section className="problem-and-editor">
          <article className="problem-panel"><div className="panel-heading"><span className="panel-heading-icon"><PanelTop size={16}/></span><div><h2>Enunciado</h2><small>Lee el reto antes de empezar a programar</small></div></div><p className="problem-statement">{exercise.prompt}</p><div className="problem-specs"><div><span>ENTRADA DE EJEMPLO</span><pre>{exercise.input}</pre></div><div><span>RESULTADO ESPERADO</span><pre>{exercise.expected}</pre></div></div></article>

          <section className="monaco-panel"><div className="monaco-toolbar"><div className="monaco-file"><span className="java-file">J</span><span>Solucion.java</span><span className="monaco-language">Java</span></div><div className="monaco-actions"><span className="autosave-state"><Save size={13}/>{savedAt || "Borrador local"}</span><button className="editor-icon-action" onClick={() => updateCode(exercise.starter)} title="Restablecer plantilla" aria-label="Restablecer plantilla"><RotateCcw size={15}/></button><button className="editor-icon-action" onClick={() => setFocus(!focus)} title={focus ? "Salir del modo enfoque" : "Abrir editor en modo enfoque"} aria-label={focus ? "Salir del modo enfoque" : "Abrir editor en modo enfoque"}>{focus ? <Minimize2 size={15}/> : <Maximize2 size={15}/>}</button><button className="editor-copy-action" onClick={() => copyCode(code)}><Copy size={14}/>{copied ? "Copiado" : "Copiar"}</button></div></div><div className="monaco-editor-frame"><MonacoEditor height={focus ? "calc(100vh - 112px)" : "560px"} language="java" theme="vs-dark" value={code} onChange={updateCode} options={{ automaticLayout: true, minimap: { enabled: false }, fontSize: Math.round(18 * scale), lineHeight: Math.round(28 * scale), fontFamily: "'Geist Mono', 'SFMono-Regular', Consolas, monospace", padding: { top: 18, bottom: 18 }, scrollBeyondLastLine: false, smoothScrolling: true, tabSize: 4, insertSpaces: true, wordWrap: "on", renderLineHighlight: "all", accessibilitySupport: "auto", ariaLabel: `Editor Java para el ejercicio ${exercise.title}` }} />{!ready && <div className="monaco-restoring">Recuperando tu borrador…</div>}</div><div className="monaco-footer"><span><i className="status-dot"/>Java · edición local</span><span>El editor no ejecuta Java. Copia tu solución a NetBeans para compilarla.</span></div></section>
        </section>

        <aside className="exercise-study-rail">
          <article className="study-card"><div className="study-card-title"><span className="study-card-icon"><CircleHelp size={17}/></span><div><h2>Objetivo de aprendizaje</h2><small>{exercise.concept}</small></div></div><p>{exercise.goal}</p></article>
          <article className="study-card hint-card"><div className="study-card-title"><span className="study-card-icon hint-icon"><Lightbulb size={17}/></span><div><h2>Pistas</h2><small>Ábrelas solo cuando te hagan falta</small></div></div>{exercise.hints.map((hint, index) => <details className="exercise-hint" key={hint}><summary><span><i>{String(index + 1).padStart(2, "0")}</i>Pista {index + 1}</span><ChevronDown size={15}/></summary><p>{hint}</p></details>)}</article>
          <article className="study-card solution-card"><div className="study-card-title"><span className="study-card-icon solution-icon"><Code2 size={17}/></span><div><h2>Solución explicada</h2><small>Primero intenta resolverlo por tu cuenta</small></div></div><p className="solution-warning">La solución está oculta. Revelarla no marca el ejercicio como completado.</p><button className="solution-toggle" aria-expanded={solutionVisible} onClick={() => setSolutionVisible(!solutionVisible)}>{solutionVisible ? <EyeOff size={15}/> : <Eye size={15}/>} {solutionVisible ? "Ocultar solución" : "Revelar solución"}<ChevronDown size={14}/></button>{solutionVisible && <div className="revealed-solution"><div className="solution-code-head"><span>Solucion.java</span><button onClick={() => copyCode(exercise.solution)}><Copy size={13}/>{copied ? "Copiado" : "Copiar"}</button></div><pre className="exercise-solution-code"><code>{exercise.solution}</code></pre><h3>Explicación línea por línea</h3><div className="solution-line-notes">{exercise.lineNotes.map((note, index) => <div className="solution-note" key={`${exercise.id}-${index}`}><code><span>{String(index + 1).padStart(2, "0")}</span>{exercise.solution.split("\n")[index]}</code><p>{note}</p></div>)}</div><div className="solution-output"><h3><Terminal size={14}/> Salida de referencia</h3><pre>{exercise.expected}</pre></div><p className="solution-note-disclaimer">La salida anterior resume el caso de ejemplo; en ejercicios interactivos con Scanner, escribe los datos de entrada indicados para reproducirla.</p></div>}</article>
          <button className={`mark-exercise-complete ${completed ? "is-complete" : ""}`} onClick={toggleCompleted}><Check size={16}/>{completed ? "Ejercicio completado" : "Marcar como completado"}</button>
        </aside>
      </div>

      <footer className="exercise-pager"><Link href={`/?section=Ejercicios`}><ArrowLeft size={15}/> Lista de ejercicios</Link><Link href={`/ejercicios/${previous.id}`} className="pager-prev"><ChevronLeft size={15}/><span><small>EJERCICIO ANTERIOR</small>{previous.title}</span></Link><Link href={`/ejercicios/${next.id}`} className="pager-next"><span><small>SIGUIENTE EJERCICIO</small>{next.title}</span><ChevronRight size={15}/></Link></footer><footer className="site-footer">Diseñado por Sergio Bravo Huete</footer>
    </div>
  </main>
}
