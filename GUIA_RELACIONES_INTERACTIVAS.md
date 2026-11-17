# Relaciones interactivas — DamAcademy

Se han convertido los apartados identificados en los PDF adjuntos a tarjetas interactivas de Tema 1 y Tema 2. Cada apartado incluye su enunciado, editor Monaco, guardado local, entrada estándar y consola. Los enunciados se extrajeron automáticamente: revisa los símbolos y fórmulas del material original, porque algunas fórmulas de PDF pueden perder formato.

## Ejecución de Java

**No funciona sin un servicio de ejecución externo.** Para habilitarla, configura en Vercel la variable de servidor `JAVA_RUNNER_URL` apuntando a un endpoint `/api/v2/execute` de un proveedor Piston compatible. Opcionalmente `JAVA_RUNNER_TOKEN` y `JAVA_RUNNER_VERSION`. El proveedor debe admitir compilación y ejecución de Java. No incluyas tokens en variables `NEXT_PUBLIC_`. Antes de activar un ejecutor para usuarios públicos, aplica autenticación y limitación de peticiones; el endpoint incluido solo valida tamaños y no constituye una solución antiabuso.

## Soluciones

Los PDF contienen enunciados, no soluciones verificadas para todos los ejercicios. Para evitar inventar respuestas, se incluye orientación de resolución, no una solución Java falsamente atribuida al profesorado. Los ejercicios originales de "Ejercicios para practicar" conservan sus soluciones.

## Publicación

Sube la carpeta del proyecto al repositorio y despliega en Vercel. Los borradores de relaciones se guardan en el navegador (localStorage), no se sincronizan con Firestore.
