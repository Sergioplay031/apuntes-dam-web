'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 350)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <button
      type="button"
      aria-label="Volver arriba"
      title="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-violet-400/40 bg-violet-600 text-white shadow-lg shadow-violet-950/40 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:bottom-8 sm:right-8 ${visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <ArrowUp aria-hidden="true" className="h-6 w-6" strokeWidth={2.5} />
    </button>
  )
}
