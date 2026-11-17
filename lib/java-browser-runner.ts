/** Intérprete didáctico en Web Worker: no ejecuta un JDK completo. */
export type JavaRunResult = { output: string; waiting: boolean }
export function ejecutarJavaInteractivo(code: string, input: string): Promise<JavaRunResult> {
  return new Promise((resolve) => {
    const worker = new Worker('/java-engine/worker.js')
    let finished = false
    const finish = (result: JavaRunResult) => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      worker.terminate()
      resolve(result)
    }
    const timer = setTimeout(() => finish({ output: 'La ejecución ha superado el límite de 5 segundos.', waiting: false }), 5000)
    worker.onmessage = (event: MessageEvent<{ output?: string; error?: string; waiting?: boolean }>) => {
      finish({ output: event.data.output ?? event.data.error ?? '', waiting: Boolean(event.data.waiting) })
    }
    worker.onerror = () => finish({ output: 'No se ha podido cargar el intérprete Java local.', waiting: false })
    worker.postMessage({ code, input })
  })
}
/** Compatibilidad con componentes existentes. */
export async function ejecutarJavaLocal(code: string, input: string): Promise<string> {
  const result = await ejecutarJavaInteractivo(code, input)
  return result.output || (result.waiting ? 'Esperando datos de Scanner.' : 'Programa terminado sin salida.')
}
