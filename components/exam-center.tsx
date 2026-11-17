"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, BookOpen, Trophy, AlertCircle } from "lucide-react"
import { examQuestions, type ExamQuestion } from "@/lib/exam-questions"

type Answers = Record<string, number[]>
const PER_EXAM = 10
function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
function exact(a: number[], b: number[]) {
  return a.length === b.length && a.every((x) => b.includes(x))
}
export function ExamCenter() {
  const [unit, setUnit] = useState<1 | 2 | null>(null)
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [history, setHistory] = useState<Record<string, number>>({})
  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem("damacademy-exam-best-v1") || "{}")) } catch { /* sin historial */ }
  }, [])
  const current = questions[index]
  const score = useMemo(() => questions.reduce((sum, q) => sum + (exact(answers[q.id] || [], q.correct) ? 1 : 0), 0), [questions, answers])
  const answered = questions.filter(q => (answers[q.id] || []).length > 0).length
  function start(chosen: 1 | 2) {
    const pool = examQuestions.filter(q => q.unit === chosen)
    // Diversidad temática: primero una pregunta de cada bloque, luego se completa al azar.
    const topics = shuffle([...new Set(pool.map(q => q.topic))])
    const chosenQuestions: ExamQuestion[] = []
    for (const topic of topics) {
      const pick = shuffle(pool.filter(q => q.topic === topic))[0]
      if (pick && chosenQuestions.length < PER_EXAM) chosenQuestions.push(pick)
    }
    for (const q of shuffle(pool.filter(q => !chosenQuestions.some(x => x.id === q.id)))) {
      if (chosenQuestions.length >= PER_EXAM) break
      chosenQuestions.push(q)
    }
    setQuestions(shuffle(chosenQuestions)); setUnit(chosen); setAnswers({}); setIndex(0); setFinished(false)
  }
  function toggle(option: number) {
    if (!current || finished) return
    const selected = answers[current.id] || []
    setAnswers(prev => ({ ...prev, [current.id]: selected.includes(option) ? selected.filter(x => x !== option) : [...selected, option] }))
  }
  function submit() {
    if (!unit || answered !== questions.length) return
    setFinished(true)
    const key = String(unit)
    const next = { ...history, [key]: Math.max(history[key] || 0, score) }
    setHistory(next)
    try { localStorage.setItem("damacademy-exam-best-v1", JSON.stringify(next)) } catch { /* navegador sin almacenamiento */ }
  }
  if (!unit) return <section className="exam-page">
    <div className="eyebrow">EVALÚA TUS CONOCIMIENTOS</div><h1>Exámenes por unidad</h1>
    <p className="page-description">Practica con preguntas de nivel medio basadas en tus apuntes. Cada intento mezcla preguntas nuevas, con una o varias respuestas correctas.</p>
    <div className="exam-unit-grid">
      {([1,2] as const).map(u => <article className="exam-unit-card" key={u}>
        <div className="exam-unit-top"><span className="exam-unit-number">0{u}</span><span className="exam-level">Nivel medio</span></div>
        <h2>Unidad {u}</h2><p>{u === 1 ? "Introducción a la programación con Java" : "Estructuras de control y calidad del software"}</p>
        <div className="exam-unit-meta"><span><BookOpen size={15}/> {PER_EXAM} preguntas aleatorias</span><span><Trophy size={15}/> Mejor nota: {history[String(u)] === undefined ? "Sin intentos" : `${history[String(u)]}/10`}</span></div>
        <button className="exam-primary" onClick={() => start(u)}>Comenzar examen <ArrowRight size={17}/></button>
      </article>)}
    </div>
    <p className="exam-footnote">La nota se guarda en este navegador. No modifica las calificaciones oficiales ni el progreso de Firebase.</p>
  </section>
  if (finished) return <section className="exam-page">
    <button className="back-link" onClick={() => setUnit(null)}><ArrowLeft size={16}/> Volver a exámenes</button>
    <div className="exam-results"><Trophy size={34}/><div className="eyebrow">RESULTADOS · UNIDAD {unit}</div><h1>{score} / {questions.length}</h1><p>{score >= 7 ? "¡Buen trabajo! Sigue reforzando los detalles." : score >= 5 ? "Vas por buen camino. Repasa los errores." : "Repasa la unidad y vuelve a intentarlo."}</p><strong>{Math.round(score / questions.length * 100)}% de aciertos</strong></div>
    <div className="exam-review">{questions.map((q, i) => { const ok = exact(answers[q.id] || [], q.correct); return <article className="exam-review-card" key={q.id}><div className="exam-review-heading"><span>{i + 1}. {q.topic}</span><span className={ok ? "exam-ok" : "exam-wrong"}>{ok ? "Correcta" : "Incorrecta"}</span></div><h3>{q.prompt}</h3><p><strong>Respuesta correcta:</strong> {q.correct.map(n => q.options[n]).join(" · ")}</p><p>{q.explanation}</p></article> })}</div>
    <div className="exam-actions"><button className="exam-secondary" onClick={() => setUnit(null)}>Elegir unidad</button><button className="exam-primary" onClick={() => start(unit)}><RotateCcw size={16}/> Nuevo examen aleatorio</button></div>
  </section>
  return <section className="exam-page">
    <button className="back-link" onClick={() => setUnit(null)}><ArrowLeft size={16}/> Volver a exámenes</button>
    <div className="exam-heading"><div><div className="eyebrow">UNIDAD {unit} · NIVEL MEDIO</div><h1>Examen de Java</h1><p>Marca todas las respuestas que consideres correctas. Algunas preguntas tienen varias.</p></div><span className="exam-counter">{index + 1} / {questions.length}</span></div>
    <div className="exam-progress"><span style={{ width: `${answered / questions.length * 100}%` }}/></div>
    <div className="exam-number-nav" aria-label="Navegar entre preguntas">{questions.map((q,i) => <button key={q.id} onClick={() => setIndex(i)} className={`${i === index ? "active" : ""} ${(answers[q.id] || []).length ? "answered" : ""}`} aria-label={`Pregunta ${i+1}`}>{i+1}</button>)}</div>
    <article className="exam-question"><div className="exam-question-meta"><span>{current.topic}</span><span>Selección múltiple</span></div><h2>{current.prompt}</h2><p className="exam-help"><AlertCircle size={15}/> Puede haber una o varias respuestas correctas.</p>
      <div className="exam-options">{current.options.map((opt,i) => <button type="button" key={i} onClick={() => toggle(i)} className={`exam-option ${(answers[current.id] || []).includes(i) ? "selected" : ""}`} aria-pressed={(answers[current.id] || []).includes(i)}><span className="exam-option-check">{(answers[current.id] || []).includes(i) ? "✓" : ""}</span><span>{opt}</span></button>)}</div>
    </article>
    <div className="exam-actions"><button className="exam-secondary" disabled={index === 0} onClick={() => setIndex(i => Math.max(0,i-1))}><ArrowLeft size={16}/> Anterior</button><span>{answered} de {questions.length} respondidas</span>{index < questions.length - 1 ? <button className="exam-primary" onClick={() => setIndex(i => Math.min(questions.length-1,i+1))}>Siguiente <ArrowRight size={16}/></button> : <button className="exam-primary" disabled={answered !== questions.length} onClick={submit}><CheckCircle2 size={16}/> Corregir examen</button>}</div>
    {index !== questions.length - 1 && answered === questions.length && <button className="exam-finish-early" onClick={submit}>Corregir las {questions.length} respuestas</button>}
  </section>
}
