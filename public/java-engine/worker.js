/* Ejecución aislada en Web Worker para no bloquear la interfaz */
importScripts('/java-engine/interprete-java.js');
self.onmessage = function(event) {
  const {code,input} = event.data || {};
  try {
    const result = self.JavaI.run(String(code || ''), {input: String(input || ''), maxSteps: 150000});
    const parts = [];
    if (result.out) parts.push(result.out);
    if (result.err) parts.push(result.err);
    if (result.compile) parts.push('Error de compilación (línea ' + result.compile.line + '): ' + result.compile.msg);
    if (result.exception) parts.push('Excepción: ' + result.exception);
    if (result.halted) parts.push(result.halted);
    if (result.waiting) parts.push('Faltan datos de entrada para Scanner. Añádelos en el campo de entrada y vuelve a ejecutar.');
    if (!parts.length) parts.push('Programa terminado sin salida.');
    self.postMessage({output: parts.join('\n').slice(0,16000)});
  } catch (err) { self.postMessage({error: 'El intérprete no admite esta construcción: ' + String(err && err.message || err)}); }
};
