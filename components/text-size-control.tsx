"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

type TextSize = "normal" | "large" | "very-large"
type TextSizeContextValue = { size: TextSize; scale: number; setSize: (size: TextSize) => void }

const sizeOptions: { value: TextSize; label: string; pixels: number; sample: string }[] = [
  { value: "normal", label: "Normal", pixels: 16, sample: "A" },
  { value: "large", label: "Grande", pixels: 18, sample: "Aa" },
  { value: "very-large", label: "Muy grande", pixels: 20, sample: "Aa" },
]

const TextSizeContext = createContext<TextSizeContextValue | null>(null)
const storageKey = "dam-academy-text-size"

export function TextSizeProvider({ children }: { children: React.ReactNode }) {
  const [size, setSizeState] = useState<TextSize>("normal")
  const [loaded, setLoaded] = useState(false)
  const option = sizeOptions.find((item) => item.value === size) ?? sizeOptions[0]
  const scale = option.pixels / 16

  useEffect(() => {
    try {
      const savedSize = localStorage.getItem(storageKey) as TextSize | null
      if (savedSize && sizeOptions.some((item) => item.value === savedSize)) setSizeState(savedSize)
    } catch {
      // El control sigue funcionando aunque el almacenamiento del navegador esté desactivado.
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty("--text-scale", String(scale))
    if (loaded) {
      try {
        localStorage.setItem(storageKey, size)
      } catch {
        // La preferencia se mantiene durante esta sesión aunque no pueda persistirse.
      }
    }
  }, [loaded, scale, size])

  const value = useMemo(() => ({ size, scale, setSize: setSizeState }), [size, scale])
  return <TextSizeContext.Provider value={value}>{children}</TextSizeContext.Provider>
}

export function useTextSize() {
  const context = useContext(TextSizeContext)
  if (!context) throw new Error("useTextSize debe usarse dentro de TextSizeProvider")
  return context
}

export function TextSizeControl() {
  const { size, setSize } = useTextSize()
  const [open, setOpen] = useState(false)
  const current = sizeOptions.find((item) => item.value === size) ?? sizeOptions[0]

  return <div className="text-size-menu">
    <button className="text-size-trigger" type="button" aria-label="Cambiar tamaño del texto" aria-expanded={open} onClick={() => setOpen(!open)}><span aria-hidden="true">Aa</span><span className="text-size-trigger-label">Texto</span><ChevronDown size={14}/></button>
    {open && <div className="text-size-popover" role="group" aria-label="Tamaño del texto">{sizeOptions.map((option) => <button className={`text-size-option ${size === option.value ? "selected" : ""}`} type="button" key={option.value} aria-pressed={size === option.value} onClick={() => { setSize(option.value); setOpen(false) }}><span className="text-size-sample" aria-hidden="true">{option.sample}</span><span><strong>{option.label}</strong><small>{option.pixels} px</small></span>{size === option.value && <Check size={15}/>}</button>)}</div>}
    <span className="sr-only" aria-live="polite">Tamaño actual: {current.label}, {current.pixels} píxeles</span>
  </div>
}
