/* Ejecución aislada: límite de pasos en el intérprete y límite temporal desde el cliente. */
importScripts('/java-engine/interprete-java.js');
self.onmessage = function(event) {
  const {code,input} = event.data || {};
  try {
    const result = self.JavaI.run(String(code || ''), {input: String(input || ''), maxSteps: 150000, interactive: true});
    const parts = [];
    if (result.segs && result.segs.length) parts.push(result.segs.map(function(seg) { return seg.s; }).join(''));
    else if (result.out) parts.push(result.out);
    if (result.err) parts.push(result.err);
    if (result.compile) parts.push('Error de compilación (línea ' + result.compile.line + '): ' + result.compile.msg);
    if (result.exception) parts.push('Excepción: ' + result.exception);
    if (result.halted) parts.push(result.halted);
    self.postMessage({output: parts.join('\n').slice(0,16000), waiting: Boolean(result.waiting)});
  } catch (err) { self.postMessage({error: 'El intérprete no admite esta construcción: ' + String(err && err.message || err), waiting:false}); }
};
