/** Ejecuta el subconjunto educativo de Java en un Worker local, sin API externa. */
export function ejecutarJavaLocal(code: string, input: string): Promise<string> {
  return new Promise((resolve) => {
    const worker = new Worker('/java-engine/worker.js');
    let finished = false;
    const finish = (message: string) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(message);
    };
    const timer = setTimeout(() => finish('La ejecución ha superado el límite de 5 segundos.'), 5000);
    worker.onmessage = (event: MessageEvent<{output?:string;error?:string}>) => finish(event.data.output || event.data.error || 'Sin salida');
    worker.onerror = () => finish('No se ha podido cargar el intérprete Java local.');
    worker.postMessage({code, input});
  });
}
