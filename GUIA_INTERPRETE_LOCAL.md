# Motor Java local para DamAcademy

Se ha mantenido la estructura original de DamAcademy. Únicamente se añade ejecución a las páginas de **Relaciones de ejercicios** y **Ejercicios para practicar**.

El motor procede del proyecto que facilitaste `ims1607Clase/programacion-dam`, archivo `js/motor/interprete-java.js`. No se ha sustituido el diseño, los ejercicios, Firebase ni la navegación. **Comprueba los permisos de reutilización del código del autor antes de publicar la adaptación**: el ZIP facilitado no incluye un archivo LICENSE.

El motor interpreta un **subconjunto educativo** de Java en el navegador. No compila Java real con JDK y no soporta arrays, bibliotecas arbitrarias ni todas las características de Java. Incluye un límite de pasos y un Web Worker con límite de 5 segundos. No hace falta `JAVA_RUNNER_URL` para estos dos editores.

## Instalación

Copia el proyecto en tu repositorio, sin incluir `node_modules` ni `.git`. Ejecuta `npm install` y `npm run build`. Sube los cambios a GitHub para que Vercel despliegue. No se necesita ninguna variable adicional de Firebase.

## Comprobaciones recomendadas

- `System.out.println("Hola");`
- `Scanner` con entrada en el campo correspondiente.
- Bucles `for`, `while`, condicionales, métodos y excepciones básicos.
- Comportamiento ante código no soportado o bucles infinitos.

El archivo `/api/ejecutar-java` anterior permanece en el proyecto, pero los dos editores ahora ejecutan localmente y no lo llaman.
