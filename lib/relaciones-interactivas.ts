export type RelacionInteractiva = {id:string;topic:string;category:string;title:string;prompt:string;sourcePage:number}
export const relacionesInteractivas: RelacionInteractiva[] = [
  {
    "id": "rel-1",
    "topic": "Tema 1",
    "category": "1. Tipos de datos",
    "title": "1. Tipos de datos",
    "prompt": "¿A qué tipo pertenecen los siguientes datos?\n1. 0\n2. -90.234\n3. -90\n4. -90.0\n5. 'A'\n6. \"Almería\"\n7. falso\n8. \"falso\"\n9. \"-90\"",
    "sourcePage": 3
  },
  {
    "id": "rel-2",
    "topic": "Tema 1",
    "category": "1. Tipos de datos",
    "title": "2. Identificadores de variable",
    "prompt": "¿Cuáles de los siguientes identificadores de variable no son correctos y por qué?\n1. XYZ\n2. _xyz\n3. 'valor'\n4. 56vértice\n5. indice28\n6. año\n7. año&actual\n8. año_actual\n9. ZZZZ",
    "sourcePage": 4
  },
  {
    "id": "rel-3",
    "topic": "Tema 1",
    "category": "1. Tipos de datos",
    "title": "3. Intercambio de valores",
    "prompt": "Se tienen dos variables, a y b . Escribe las asignaciones necesarias para intercambiar sus\nvalores, sean cuales sean.",
    "sourcePage": 5
  },
  {
    "id": "rel-4",
    "topic": "Tema 1",
    "category": "1. Tipos de datos",
    "title": "4. Intercambio de valores a tres bandas",
    "prompt": "Se tienen tres variables, a , b y c . Escribe las asignaciones necesarias para intercambiar\nsus valores, sean cuales sean, de manera que:\nb tome el valor de a\nc tome el valor de b\na tome el valor de c",
    "sourcePage": 6
  },
  {
    "id": "rel-5",
    "topic": "Tema 1",
    "category": "2. Operadores y expresiones",
    "title": "1. Calcular expresiones",
    "prompt": "9.3.5. ¿Y las operaciones más complejas?\nCalcula el valor de estas expresiones, sabiendo que a = 2 , b = 5 y c = 8 :\n1. 4 / 2 * 3 / 6 + 6 / 2 / 1 / 4 * 2\n2. 3 * a - 4 * b / Math.pow(c, 2)\n3. b * a - Math.pow(b, 2 * 4 / c)\n4. (((b + c) / 2 * a + 10) * 3 * b) - 6\n5. 7 / 2 * v\n6. 7 % 2\n7. 0 % 5\n8. 7 * 10 - 50 % 3 * 4 + 9\n9. (7 * (10 - 5) % 3) * 4 + 9\n10. 7 % 5 % 3\n11. Math.sqrt(Math.pow(b,2))\n12. Math.sqrt(b*b)\n13. Math.round(81.4) + Math.round(81.6)\n14. Math.round(Math.sqrt(c)) > Math.abs(-(a^2))",
    "sourcePage": 3
  },
  {
    "id": "rel-6",
    "topic": "Tema 1",
    "category": "2. Operadores y expresiones",
    "title": "2. Convertir expresiones",
    "prompt": "complejas?\nConvierte estas expresiones algebraicas a su notación informática en lenguaje Java:\n𝑀\n1.                 𝑁+ 𝑃\n𝑁\n2.                𝑀+ 𝑃−𝑄+ 𝑃\n𝑥+ 𝑦\n3.\n𝑎−𝑏\n𝑠𝑒𝑛(𝑥) + 𝑐𝑜𝑠(𝑥)\n4.                                2\n𝑡𝑎𝑛(𝑥)\n𝑚+ 𝑛𝑝\n5.\n𝑞−𝑟𝑠\n−𝑏+ √𝑏2 −4𝑎𝑐\n6.\n2𝑎",
    "sourcePage": 4
  },
  {
    "id": "rel-7",
    "topic": "Tema 1",
    "category": "2. Operadores y expresiones",
    "title": "3. Ejecuta de cabeza",
    "prompt": "¿Puedes adivinar qué salida por pantalla produce este programa antes de ejecutarlo?\nPista\nNecesitarás buscar primero qué significan los operadores += y %= .\nclass Adivinanza {\npublic static void main (String[] args) {\nint num = 5;\nnum += num - 1 * 4 + 1;\nSystem.out.println(num);\nnum = 4; num %= 7 * num % 3 * 7;\nSystem.out.println(num);\n}\n}",
    "sourcePage": 5
  },
  {
    "id": "rel-8",
    "topic": "Tema 1",
    "category": "3. Conversiones de tipo",
    "title": "1. Asignaciones sospechosas",
    "prompt": "asignación\nSe tienen las siguientes variables: a y b de tipo entero; c y d de tipo real; e y f de tipo\ncarácter; y g de tipo lógico. Señala cuáles de las siguientes asignaciones no son válidas y\npor qué:\n1. a = 20;\n2. b = 12;\n3. f = '0';\n4. b = 5500;\n5. c = 0;\n6. d = c;\n7. e = 'f';\n8. e = f;\n9. a = 12.56;\n10. g = verdadero;\n11. g = 'falso';\n12. f = g;",
    "sourcePage": 3
  },
  {
    "id": "rel-9",
    "topic": "Tema 1",
    "category": "3. Conversiones de tipo",
    "title": "2. Asignaciones liosas",
    "prompt": "aritméticas\n¿Cuál es la salida por pantalla de cada una de estas secuencias de asignaciones?\n1.\nint a, b, c;\na = 3;\nb = 4;\nc = a + 2 * b;\nc = c + b;\nb = c - a;\na = b * c;\nSystem.out.println(a + b + c);\n2.\nfloat x;\nx = 2.0;\nx = Math.pow((x + x), 2);\nx = Math.sqrt(x + Math.sqrt(x) + 5);\nSystem.out.println(x);\n3.\nint x, y;\nboolean z;\nx = 5;\ny = x - 2;\nx = y * y + 1;\nz = (x > (y + 5));\nSystem.out.println(x + y + z);\n4.\nint a, b;\na = 10;\nb = 5;\na = b;\nb = a;\nSystem.out.println(a + b);",
    "sourcePage": 4
  },
  {
    "id": "rel-10",
    "topic": "Tema 1",
    "category": "3. Conversiones de tipo",
    "title": "3. Generador de letras",
    "prompt": "Teclea y ejecuta este programa. ¿Qué es lo que ocurre? ¿Qué son esos caracteres que\naparecen en la consola al ejecutarlo?\nInfo\nNo olvides que el nombre del archivo debe coincidir con el de la clase, pero en\nminúsculas. Es decir, el archivo con el código debe llamarse generaletras.java\nclass GeneraLetras {\npublic static char getLetra() {\nreturn (char) (Math.random() * 26 + 'a');\n}\npublic static void main(String[] args) {\nSystem.out.println(getLetra());\nSystem.out.println(getLetra());\nSystem.out.println(getLetra());\nSystem.out.println(getLetra());\n}\n}",
    "sourcePage": 6
  },
  {
    "id": "rel-11",
    "topic": "Tema 1",
    "category": "4. La clase Math",
    "title": "1. Aleatorio entre 0 y N",
    "prompt": "9.2.2. Conversiones de tipo (casting)\n9.3.5. ¿Y las operaciones más complejas?\n1. Escribe un programa en Java que genere e imprima por pantalla un número entero\naleatorio entre 0 (incluido) y 50 (excluido). Esto significa que el número más alto\nposible es 49.\n2. Haz el mismo ejercicio, pero incluyendo tanto el 0 como el 50.",
    "sourcePage": 3
  },
  {
    "id": "rel-12",
    "topic": "Tema 1",
    "category": "4. La clase Math",
    "title": "2. Lanza los dados",
    "prompt": "9.2.2. Conversiones de tipo (casting)\n9.3.5. ¿Y las operaciones más complejas?\nSimula el lanzamiento de un dado de 6 caras. Escribe un programa que genere e imprima\nun número entero aleatorio entre 1 y 6 (ambos incluidos).",
    "sourcePage": 4
  },
  {
    "id": "rel-13",
    "topic": "Tema 1",
    "category": "4. La clase Math",
    "title": "3. Canal de televisión",
    "prompt": "9.2.2. Conversiones de tipo (casting)\n9.3.5. ¿Y las operaciones más complejas?\nEscribe un programa que simule la selección de un canal de televisión. El programa debe\ngenerar e imprimir un número de canal aleatorio entre 10 (inclusive) y 99 (inclusive).\nPara saber más…\nSi bien Math.random() es perfecto para empezar a introducirse en los métodos para\ngenerar números aleatorios, en la actualidad hay otras alternativas más modernas y\neficientes.\nLa API de Java incluye también la clase java.util.Random (disponible desde la primera\nversión) y, a partir de Java 7, java.util.concurrent.ThreadLocalRandom .\nEl uso de la clase Random (java.util.Random) se verá en unidades posteriores y el de\nThreadLocalRandom (java.util.concurrent.ThreadLocalRandom) en el siguiente curso, en el\nmódulo de Programación de Servicios y Procesos.\nReferencias\nAula Informática. (2022, 12 de abril). Programación Java – La clase Math [Vídeo].\nYouTube. https://www.youtube.com/watch?v=W4CFmH7J47k",
    "sourcePage": 5
  },
  {
    "id": "rel-14",
    "topic": "Tema 1",
    "category": "5. Programas completos y depuración",
    "title": "1. ¿Funciona o no funciona?",
    "prompt": "booleanas)\nA continuación te presentamos varios fragmentos de código. Se trata de que, para cada\nuno de ellos, intentes averiguar sin probarlo si ese código funcionaría o no funcionaría una\nvez tecleado. En caso de que no funcione, explica por qué. Y, en caso de que funcione,\nintenta predecir cuál será la salida por consola. Luego puedes probarlo en el compilador de\njava para ver si estabas en lo cierto o no.\n1.\nint a = 'a';\nSystem.out.println(a);\n2.\nint pi = 3.14;\nSystem.out.println(pi);\n3.\ndouble pi = 3,14;\nSystem.out.println(pi);\n4.\nboolean adivina = (1 == 4);\nSystem.out.println(adivina);\n5.\nboolean adivina = (1 == 'a' == 1);\nSystem.out.println(adivina);\n6.\nboolean adivina = (97 == 'a' == 97);\nSystem.out.println(adivina);\n7.\nboolean adivina = ((97 == 'a') && true);\nSystem.out.println(adivina);\n8.\nint a = 1;\nint b == a > 1;\nSystem.out.println(b);\n9.\nbyte a = 200;\nSystem.out.println(a);",
    "sourcePage": 3
  },
  {
    "id": "rel-15",
    "topic": "Tema 1",
    "category": "5. Programas completos y depuración",
    "title": "2. Programa misterioso",
    "prompt": "¿Qué mostrará el siguiente programa por pantalla, y por qué?\nPista\nNecesitarás averiguar qué significa el prefijo 0x escrito delante de un número, y para\nqué sirve el operador >>> .\npublic class Incognita {\npublic static void main(String[] args) {\nint i = 0x100;\ni = i >>> 1;\nSystem.out.println(i);\n}\n}",
    "sourcePage": 5
  },
  {
    "id": "rel-16",
    "topic": "Tema 1",
    "category": "5. Programas completos y depuración",
    "title": "3. Corrige los errores",
    "prompt": "asignación\nLos siguientes programas contienen uno o varios errores que hacen que no compilen.\nModíficalos hasta que funcionen correctamente.\n1.\nclass Suma {\nstatic int n1 = 50;\npublic static void main (String[] args) {\nint n2 = 30, suma = 0, n3;\nsuma = n1 + n2;\nSystem.out.println(\"La suma es: \" + suma);\nsuma = suma + n3;\nSystem.out.println(suma);\n}\n}\n2.\nclass Suma {\npublic static void main (String[] args) {\nint n1 = 5, n2 = 6;\nboolean suma = 0;\nsuma = n1 + n2;\nSystem.out.println(La suma es = suma);\n}\n}\n3.\nclass Cuadrado {\npublic static void main (String[] args) {\nint n = 8;\ncuad = n * n;\nSystem.out.println(\"El cuadrado de \" + N + \" es: \" + cuad);\n}\n}",
    "sourcePage": 6
  },
  {
    "id": "rel-17",
    "topic": "Tema 1",
    "category": "5. Programas completos y depuración",
    "title": "4. Mi primer programa (de verdad)",
    "prompt": "asignación\nEscribe un programa que calcule el área y la circunferencia de un círculo cuyo radio estará\nalmacenado en una variable entera llamada r . Tal vez necesites buscar las fórmulas para\ncalcular ambas magnitudes. Comprueba que el programa funciona correctamente para\ncualquier valor de r . La salida del programa, para r = 5 , debería ser algo parecido a\nesto:\nRadio: 5\nLongitud de circunferencia: 31,42\nÁrea de círculo: 78,54",
    "sourcePage": 8
  },
  {
    "id": "rel-18",
    "topic": "Tema 1",
    "category": "5. Programas completos y depuración",
    "title": "5. Mi segundo programa (ejercicio de dificultad",
    "prompt": "elevada)\ncomplejas?\nEscribe un programa en Java que genere cinco caracteres al azar. Cuando lo hayas\nconseguido, modifícalo para que genere únicamente vocales al azar.\nMás ejercicios con números aleatorios\nEncontrarás más ejercicios con Math.random() en 4. La clase Math.",
    "sourcePage": 9
  },
  {
    "id": "rel-19",
    "topic": "Tema 1",
    "category": "6. Configuración del entorno y uso del IDE",
    "title": "1. Instalación de NetBeans",
    "prompt": "En 0. Entorno y primer programa instalaste el JDK y compilaste y ejecutaste un programa\ndesde el terminal. Ahora harás lo mismo con un entorno integrado de desarrollo (IDE):\nApache NetBeans. Necesitas tener instalado el JDK (ejercicio 1 de esa nota).\nDescarga e instala la última versión de Apache NetBeans. Al abrirlo por primera vez,\ncomprueba en Tools → Java Platforms que reconoce el JDK que instalaste.\nIncluye un pantallazo de esa ventana.",
    "sourcePage": 3
  },
  {
    "id": "rel-20",
    "topic": "Tema 1",
    "category": "6. Configuración del entorno y uso del IDE",
    "title": "2. Mi primer proyecto",
    "prompt": "en NetBeans\n1. Crea un proyecto nuevo con File → New Project → Java with Maven → Java\nApplication. Llámalo HolaNetBeans y guárdalo en tu directorio de trabajo.\n2. Observa la ventana Projects y la estructura de carpetas que ha creado NetBeans en el\ndisco. ¿Para qué crees que sirven src/main/java y el fichero pom.xml ?\n3. Abre la clase principal que se ha generado y haz que muestre Hola, NetBeans! por\npantalla.\n4. Ejecuta el proyecto con Run → Run Project ( F6 ). ¿Dónde aparece la salida del\nprograma?\n5. Vuelve a mirar las carpetas del proyecto en el disco. ¿Qué carpeta nueva ha aparecido y\nqué contiene? Relaciónalo con lo que ocurrió al compilar con javac en el terminal.",
    "sourcePage": 4
  },
  {
    "id": "rel-21",
    "topic": "Tema 1",
    "category": "6. Configuración del entorno y uso del IDE",
    "title": "3. El editor trabaja para ti",
    "prompt": "En el mismo proyecto, crea una clase nueva llamada Ayudas (File → New File → Java →\nJava Class) y prueba estas ayudas del editor. Describe qué hace cada una:\n1. Escribe main y pulsa Tab .\n2. Dentro del método main , escribe sout y pulsa Tab .\n3. Escribe System.out. y pulsa Ctrl + Espacio .\n4. Borra el punto y coma de una línea. ¿Qué indica el editor antes de que compiles? Pasa\nel ratón por encima del aviso.\n5. Escribe int numero = \"cinco\"; . ¿Qué error muestra NetBeans? Corrígelo.\n6. Selecciona todo el código y pulsa Alt + Shift + F (formatear).\nEjecuta solo esta clase con Run → Run File ( Shift + F6 ). ¿En qué se diferencia de Run\nProject?",
    "sourcePage": 5
  },
  {
    "id": "rel-22",
    "topic": "Tema 1",
    "category": "6. Configuración del entorno y uso del IDE",
    "title": "4. Importar un proyecto existente",
    "prompt": "(casting)\nDescarga el proyecto SorteoPrimitiva.zip del aula virtual, descomprímelo en tu\ndirectorio de trabajo y ábrelo con File → Open Project.\n1. Observa el proyecto en las ventanas Projects y Files. ¿Cuál es su groupId ? ¿En qué\npaquete está la clase principal? ¿Qué versión de Java usa? (Pista: mira el pom.xml ).\n2. Intenta ejecutarlo con Run Project ( F6 ). ¿Qué ocurre? ¿Cómo te avisaba NetBeans del\nproblema antes de ejecutar?\n3. Lee el mensaje de error, explica qué significa y corrígelo.\n4. Ejecuta el programa varias veces y explica qué hace. ¿Por qué cambia el resultado en\ncada ejecución?\nCuidado\nEl programa tiene un fallo. ¿Por qué ocurre? Corrígelo y prueba a ejecutarlo.",
    "sourcePage": 6
  },
  {
    "id": "rel-23",
    "topic": "Tema 1",
    "category": "6. Configuración del entorno y uso del IDE",
    "title": "5. Primer contacto con el depurador (opcional)",
    "prompt": "En la clase Ayudas , escribe este código dentro de main :\nint a = 3;\nint b = 4;\nint c = a + 2 * b;\nSystem.out.println(c);\n1. Haz clic sobre el número de la primera línea para poner un punto de ruptura\n(breakpoint).\n2. Ejecuta con Debug → Debug File ( Ctrl + Shift + F5 ).\n3. Avanza línea a línea con Step Over ( F8 ) y observa la ventana Variables. ¿Cómo\ncambian los valores?\nEntrega\nSi aún no la tienes, crea en tu Google Drive una carpeta con el nombre del módulo:\nProgramación.\n1. Dale permisos de Editor al profesorado sobre esa carpeta.\n2. Después envíale por correo el enlace a ella.\n3. Dentro de la carpeta Programación crea la carpeta Unidad 01 y, a su vez, dentro\nde esa crea otra carpeta con el nombre de esta actividad.\nResponde a las preguntas en un documento de Google Documentos (no se aceptarán\nficheros de Word, LibreOffice Writer, etc.), con los pantallazos que se piden.\nSiempre que el ejercicio solicite pantallazos, deben mostrar de alguna forma que\neres tú. Por ejemplo, un pantallazo donde se vea detrás la ventana de Moodle abierta\ncon tus datos de usuario:\nComprime el documento y la carpeta del proyecto HolaNetBeans en un fichero .zip\ncon el formato Apellido1_Apellido2_Nombre.zip . Por ejemplo:\nSanchez_Perez_Anselmo.zip .",
    "sourcePage": 7
  },
  {
    "id": "rel-24",
    "topic": "Tema 1",
    "category": "ud01 - Funciones de Math - Relación de ejercicios",
    "title": "Funciones de Math — relación de ejercicios",
    "prompt": "UD 01 - Introducción                                             IES Celia Viñas\nFunciones de la clase Math\nIntroducción\nElobjetivoespracticarlafórmulabásicaparaobtenernúmerosenterosaleatoriosapartirdel\nmétodo Math.random(), que siempre devuelve un valor de punto flotante(double)enel\nrango[0.0, 1.0)(0.0 incluido, 1.0 excluido).\nLa clave de la progresión será dominar el ajuste de este rango mediante:\n●  Multiplicación: para expandir el rango.\n●  Casting((int)): para convertir a entero (truncandodecimales).\n●  Suma(Offset): para desplazar el punto inicial delrango.\nLa fórmula general para un entero aleatorio en el rango[min, max](ambos inclusive) es:\nint resultado = (int) (Math.random() * (max - min + 1)) + min;\n1.Aleatorio entre 0 y N (excluido)\nEscribeunprogramaenJavaquegenereeimprimaporpantallaunnúmeroenteroaleatorio\nentre 0 (incluido) y 50 (excluido). Esto significa que el número más alto posible es 49.\n2.Aleatorio entre 1 y N (incluido)\nSimulaellanzamientodeundadode6caras.Escribeunprogramaquegenereeimprimaun\nnúmero entero aleatorio entre 1 y 6 (ambos incluidos).\n3.Aleatorio entre min y max (incluido)\nEscribe un programa que simule la selección de un canal de televisión. El programa debe\ngenerar e imprimir un número de canal aleatorio entre 10 (inclusive) y 99 (inclusive).\n1\nUD 01 - Introducción                                             IES Celia Viñas\nPara saber más…\nSibienMath.random()esperfectoparaempezaraintroducirseenlosmétodosparagenerar\nnúmeros aleatorios, hay otras formas más modernas y eficientes de hacerlo.\nA partir de Java 7 se añadieron a  la API de Java las clases java.util.Randomy\njava.util.concurrent.ThreadLocalRandom.\nEl uso de la clase Random(java.util.Random) se verá enunidadesposterioresyelde\nThreadLocalRandom (java.util.concurrent.ThreadLocalRandom) en  el siguiente\ncurso, en el módulo de Programación de Servicios y Procesos.\nReferencias\n●  Aula Informática. (2022, 12 abril). Programación Java  - La clase Math [Vídeo].\nYouTube.https://www.youtube.com/watch?v=W4CFmH7J47k\n2",
    "sourcePage": 1
  },
  {
    "id": "rel-25",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "Ahora sí empiezan los bucles. Los ejercicios están ordenados, más o menos, de menor a\nmayor dificultad. Antes de escribir código, decide qué bucle te conviene: while , do-\nwhile o for .",
    "sourcePage": 3
  },
  {
    "id": "rel-26",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "1. Pares\nMuestra todos los números pares entre A y B, dos números introducidos por teclado. A\ndebe ser menor que B; si no lo es, el programa debe avisar (con cariño).",
    "sourcePage": 4
  },
  {
    "id": "rel-27",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "2. Impares\nMuestra todos los números impares entre A y B. Esta vez cualquiera de los dos puede ser\nel mayor, así que primero tendrás que averiguar cuál es para saber desde dónde empezar.",
    "sourcePage": 5
  },
  {
    "id": "rel-28",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "3. Pares o nones\nPregunta al usuario si quiere ver los números pares o los impares y, según la respuesta,\nmuéstralos entre A y B (cualquiera de los dos puede ser el mayor). Es una mezcla de los dos\nanteriores: reutiliza todo el código que puedas.",
    "sourcePage": 6
  },
  {
    "id": "rel-29",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "4. Tabla de multiplicar\nEl usuario teclea un número y el programa muestra su tabla de multiplicar, bien\npresentada:\n8 x 1 = 8\n8 x 2 = 16\n8 x 3 = 24\n...",
    "sourcePage": 7
  },
  {
    "id": "rel-30",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "5. Dibujando con asteriscos\nDibuja estas figuras con bucles (nada de escribir las líneas a mano). Después, añade alguna\nde tu cosecha.\n*          *            *\n***        ***          ***\n*****      *****          *\n*******    *******        ***\n*****        *****\n***        *******\n*            *\n***\n*****\n*******\n*********\n***\n***\nLa última, por si queda alguna duda, es un árbol de Navidad.",
    "sourcePage": 8
  },
  {
    "id": "rel-31",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "6. Acumulador simple\nCalcula la suma de todos los números pares entre 1 y 1000, es decir, 2 + 4 + 6 + … + 998 +\n1000.",
    "sourcePage": 9
  },
  {
    "id": "rel-32",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "7. Acumulador interactivo\nacumuladores, conmutadores\nCalcula la media de una serie de números enteros positivos introducidos por teclado. Para\nterminar, el usuario teclea un número negativo, que no cuenta para la media.\n¿Qué debe hacer el programa si el primer número ya es negativo?",
    "sourcePage": 10
  },
  {
    "id": "rel-33",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "8. Estadística básica\nLee 10 números por teclado y muestra el mayor. Después, completa el programa para que\nmuestre también el menor y la media.",
    "sourcePage": 11
  },
  {
    "id": "rel-34",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "9. Notas de clase\nUn profesor introduce, una a una, las notas de sus 30 alumnos. El programa debe decir\ncuántos aprobados y cuántos suspensos hay. Las notas van de 1 a 10: si se introduce un\nvalor fuera de ese rango, el programa debe rechazarlo y volver a pedirlo.",
    "sourcePage": 12
  },
  {
    "id": "rel-35",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "10. Factorial\nCalcula el factorial de un número entero N, que es el producto de N por todos los enteros\npositivos menores que él. Por ejemplo, 5! = 5 × 4 × 3 × 2 × 1 = 120.\nCuando funcione, prueba con números cada vez más grandes (20, 21, 30…). ¿Qué ocurre?\n¿Por qué? (Pista: recuerda los rangos de los tipos de la Unidad 01).",
    "sourcePage": 13
  },
  {
    "id": "rel-36",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "11. Sucesión de Fibonacci\nLa sucesión de Fibonacci empieza así:\n0, 1, 1, 2, 3, 5, 8, 13, 21, 34, …\nCada término es la suma de los dos anteriores, salvo los dos primeros, que son 0 y 1 por\ndefinición. Curiosamente, estos números aparecen en muchas estructuras naturales, como\nla disposición de las pipas de un girasol o de las escamas de una piña.\nMuestra los N primeros términos de la sucesión, siendo N un número introducido por el\nusuario.",
    "sourcePage": 14
  },
  {
    "id": "rel-37",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "12. Número de la suerte\nEl «número de la suerte» se obtiene sumando día, mes y año de la fecha de nacimiento y,\ndespués, sumando las cifras del resultado hasta quedarse con una sola. Por ejemplo, para\nel 15-10-1974:\n15 + 10 + 1974 = 1999\n1 + 9 + 9 + 9 = 28\n2 + 8 = 10\n1 + 0 = 1\nCalcula el número de la suerte de una fecha de nacimiento introducida por teclado.",
    "sourcePage": 15
  },
  {
    "id": "rel-38",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "13. Primo\nDetermina si un número N introducido por teclado es primo, es decir, si solo es divisible\npor sí mismo y por la unidad.",
    "sourcePage": 16
  },
  {
    "id": "rel-39",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "14. Primos hasta 1000\nGeneraliza el ejercicio anterior para mostrar todos los números primos entre 2 y 1000.\nNecesitarás un bucle dentro de otro (bucles anidados).",
    "sourcePage": 17
  },
  {
    "id": "rel-40",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "15. Omirps\nUn omirp es un número primo que, al invertir sus cifras, sigue siendo primo. Por ejemplo,\n7951 es primo y, al darle la vuelta, 1597 también lo es: 7951 es un omirp.\n1. Di si un número introducido por teclado es un omirp.\n2. Más difícil todavía: muestra todos los omirps entre 0 y N, siendo N un número\nintroducido por el usuario.",
    "sourcePage": 18
  },
  {
    "id": "rel-41",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "16. Contar cifras pares e impares\nPide un número entero y di cuántas de sus cifras son pares y cuántas impares. Por ejemplo,\npara 78532 la salida debe ser:\nEse número tiene 3 cifras impares y 2 cifras pares",
    "sourcePage": 19
  },
  {
    "id": "rel-42",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "17. Lotería primitiva\nGenera al azar una combinación de la lotería primitiva: 6 números entre 1 y 49. Usa\nMath.random() (ejercicio 4. La clase Math de la Unidad 01). Por ahora no te preocupes si\nse repite algún número.",
    "sourcePage": 20
  },
  {
    "id": "rel-43",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "18. Quiniela\nGenera al azar una quiniela: 14 resultados, cada uno de ellos 1 , X o 2 . Por ejemplo:\n1 - X - X - 2 - 1 - 1 - 1 - 2 - 2 - X - 1 - X - X - 2",
    "sourcePage": 21
  },
  {
    "id": "rel-44",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "19. Calculadora repetitiva\nAmplía la calculadora del ejercicio 9 de 1. Estructuras de selección para que siga pidiendo\nnúmeros y operaciones hasta que el usuario decida terminar. Usa un valor centinela (por\nejemplo, el operador q ).",
    "sourcePage": 22
  },
  {
    "id": "rel-45",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "20. Juego del número secreto\nEl ordenador elige un número al azar entre 1 y 100. El usuario va probando números y el\nordenador le da pistas («mi número es mayor» o «mi número es menor») hasta que acierta.\nAl final, le felicita y le dice cuántos intentos ha necesitado, sin humillarlo si han sido\nmuchos.",
    "sourcePage": 23
  },
  {
    "id": "rel-46",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "21. Vocales\n3. Estructura selectiva (condicional)\n4. Estructura repetitiva (bucles)\n5. Instrucciones de salto\nCrea un programa que vaya generando letras mayúsculas al azar. Y lo hará hasta que\nencuentre una vocal.\nRealiza el programa en dos versiones: con y sin instrucciones de salto.\nInfo\nEn la tabla ASCII, las letras mayúsculas A - Z van desde el 65 al 90 respectivamente.\nLas vocales son la A (65), E (69), I (73), O (79) y U (85).",
    "sourcePage": 24
  },
  {
    "id": "rel-47",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "22. Conversor de mayúsculas a minúsculas y viceversa.\n3. Estructura selectiva (condicional)\n4. Estructura repetitiva (bucles)\n5. Instrucciones de salto\nCrea un programa que pida un carácter al usuario. Si el carácter está en mayúscula, debe\nmostrar al usuario por consola su equivalente en minúscula. Y si se introduce un carácter\nen minúscula, se mostrará su equivalente en mayúscula.\nInfo\nEn la tabla ASCII, las letras mayúsculas A - Z van desde el 65 al 90 respectivamente y\nlas minúsculas a - z en el rango de 97 al 122.",
    "sourcePage": 25
  },
  {
    "id": "rel-48",
    "topic": "Tema 2",
    "category": "ud02 - Ejercicios - Estructuras de repetición - RA3, CE a), b)",
    "title": "2. Estructuras de repetición",
    "prompt": "Entrega\nComprime las carpetas de los proyectos en un fichero .zip con el formato\nApellido1_Apellido2_Nombre.zip . Por ejemplo: Sanchez_Perez_Anselmo.zip .\nPrepárate para explicar tu código: el profesor te pedirá que lo defiendas en clase.\n⬅️ Anterior: 1. La programación estructurada | 🏠 Unidad: Unidad 02 - Estructuras de\ncontrol. Calidad del software | Siguiente: 3. Estructura selectiva (condicional) ➡️",
    "sourcePage": 26
  },
  {
    "id": "rel-49",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "1. Positivo y negativo",
    "prompt": "Lee un número por teclado y di si es positivo o negativo. La salida puede ser algo así: El\nnúmero -7 es negativo .\n¿Qué hace tu programa si el número es 0? Corrígelo para que lo trate aparte.",
    "sourcePage": 3
  },
  {
    "id": "rel-50",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "2. Raíz cuadrada",
    "prompt": "Calcula la raíz cuadrada de un número introducido por teclado. Antes, comprueba que el\nnúmero no sea negativo; si lo es, muestra un aviso en lugar del resultado.",
    "sourcePage": 4
  },
  {
    "id": "rel-51",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "3. Restar",
    "prompt": "Lee dos números, A y B, y muestra la resta del mayor menos el menor. Por ejemplo, si A = 8\ny B = 3, el resultado es A − B = 5; pero si A = 4 y B = 7, el resultado es B − A = 3.",
    "sourcePage": 5
  },
  {
    "id": "rel-52",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "4. Año bisiesto",
    "prompt": "Determina si un año es bisiesto. La regla tiene trampa:\nUn año es bisiesto si es divisible entre 4 (usa el operador módulo, % )…\n…salvo que sea divisible entre 100…\n…aunque, si también es divisible entre 400, sí es bisiesto.\nComprueba tu programa con 2024 (bisiesto), 2023 (no), 1900 (no) y 2000 (sí).",
    "sourcePage": 6
  },
  {
    "id": "rel-53",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "5. Parte decimal",
    "prompt": "Averigua si un número real introducido por teclado tiene parte decimal. Puedes usar\nMath.round() (ejercicio 4. La clase Math de la Unidad 01).",
    "sourcePage": 7
  },
  {
    "id": "rel-54",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "6. Números ordenados",
    "prompt": "Lee tres números, X, Y y Z, y di si están ordenados de menor a mayor. Después, amplía el\nprograma para que diga también si, además de ordenados, son consecutivos (por ejemplo,\n4, 5 y 6).",
    "sourcePage": 8
  },
  {
    "id": "rel-55",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "7. Contar cifras",
    "prompt": "Determina cuántas cifras tiene un número entero de hasta 5 cifras, que puede ser\nnegativo. Por ejemplo, para 5342 la respuesta es 4, y para −250, 3. Los ceros a la izquierda\nno cuentan.\nResuélvelo sin bucles, solo con condiciones.",
    "sourcePage": 9
  },
  {
    "id": "rel-56",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "8. Mayor, menor y mediano",
    "prompt": "Dados tres números enteros, A, B y C, determina cuál es el mayor, cuál el menor y cuál el\nmediano. Es un ejercicio de lógica: no uses bucles ni arrays.",
    "sourcePage": 10
  },
  {
    "id": "rel-57",
    "topic": "Tema 2",
    "category": "1. Estructuras de selección",
    "title": "9. Calculadora sencilla",
    "prompt": "Lee dos números, A y B, y un operador ( + , - , * o / ) en una variable de tipo char .\nMuestra el resultado de operar A y B. Por ejemplo, si A = 5, B = 2 y el operador es + , el\nresultado es 7.\n1. Resuélvelo con if-else encadenados.\n2. Resuélvelo con switch .\n3. ¿Qué ocurre si el operador no es ninguno de los cuatro? ¿Y si es una división y B vale 0?\nHaz que el programa avise en los dos casos.\nEntrega\nComprime las carpetas de los proyectos en un fichero .zip con el formato\nApellido1_Apellido2_Nombre.zip . Por ejemplo: Sanchez_Perez_Anselmo.zip .\nPrepárate para explicar tu código: el profesor te pedirá que lo defiendas en clase.\n🏠 Unidad: Unidad 02 - Estructuras de control. Calidad del software | Siguiente: 2.\nEstructura secuencial ➡️",
    "sourcePage": 11
  },
  {
    "id": "rel-58",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "1. Nóminas",
    "prompt": "necesitamos?\nPide las horas que ha trabajado una persona en una semana y lo que cobra por hora.\nCalcula:\n1. El salario semanal. Las horas que pasan de 40 son horas extra y se pagan a 1,5 veces la\ntarifa normal.\n2. El salario bruto mensual (supón 4 semanas iguales). Ahora las 5 primeras horas extra\nde cada semana se pagan a 1,5 veces la tarifa, y las demás, al doble.\n3. Los impuestos: un 10 % si el bruto mensual es menor de 1000 €, y un 15 % en otro\ncaso.\n4. El salario neto, después de descontar los impuestos.",
    "sourcePage": 3
  },
  {
    "id": "rel-59",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "2. Polígonos",
    "prompt": "En un polígono regular, conociendo el número de lados, la longitud del lado y la apotema\n(la distancia del centro al punto medio de un lado), se calculan:\n𝑛.º 𝑙𝑎𝑑𝑜𝑠⋅𝑙𝑎𝑑𝑜⋅𝑎𝑝𝑜𝑡𝑒𝑚𝑎\nÁ rea =                           Perí metro = 𝑛.º 𝑙𝑎𝑑𝑜𝑠⋅𝑙𝑎𝑑𝑜\n2\nPide esos tres datos, calcula el área y el perímetro, y escribe el nombre del polígono\n(triángulo, cuadrado, pentágono, hexágono… hasta el dodecágono, de 12 lados).",
    "sourcePage": 4
  },
  {
    "id": "rel-60",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "3. Máquina expendedora",
    "prompt": "Simula la devolución de monedas de una máquina expendedora. El programa pide una\ncantidad en euros y calcula qué monedas debe devolver, usando siempre las de mayor\nvalor posible. Por ejemplo, para 1,45 €: una moneda de 1 €, dos de 20 céntimos y una de 5\ncéntimos.\nTip\nTrabaja en céntimos con un int (145 en lugar de 1,45). ¿Por qué crees que es mejor\nque usar double ?",
    "sourcePage": 5
  },
  {
    "id": "rel-61",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "4. Predicción meteorológica",
    "prompt": "El usuario indica la presión atmosférica y la humedad relativa, cada una de ellas alta ,\nmedia o baja . El programa calcula la probabilidad de lluvia, de sol y de frío según estas\ntablas:\nPresión      Humedad   Lluvia\nBaja             Alta    Muy alta\nBaja          Media      Alta\nBaja            Baja     Media\nMedia         Media    Media\nCualquier otro caso                Baja\nPresión      Humedad   Sol\nBaja             Alta      Baja\nBaja          Media   Media\nBaja            Baja    Media\nMedia         Media   Media\nCualquier otro caso               Alta\nPresión      Humedad   Frío\nBaja             Alta      Alta\nBaja          Media     Alta\nMedia            Alta      Alta\nMedia         Media   Media\nCualquier otro caso               Baja",
    "sourcePage": 6
  },
  {
    "id": "rel-62",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "5. Calculadora de edad",
    "prompt": "Pide la fecha de nacimiento (día, mes y año) y la fecha de hoy, y calcula la edad en años. No\nes tan fácil como parece: ¿qué pasa si todavía no ha llegado el cumpleaños de este año?\nPara valientes: calcula la edad en años, meses y días.",
    "sourcePage": 7
  },
  {
    "id": "rel-63",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "6. Contar días",
    "prompt": "Calcula cuántos días han pasado desde el 1 de enero del año en curso hasta hoy (incluido) y\ncuántos faltan desde mañana hasta el 31 de diciembre. Ten en cuenta si el año es bisiesto:\npuedes reutilizar el ejercicio 4 de 1. Estructuras de selección.",
    "sourcePage": 8
  },
  {
    "id": "rel-64",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "7. TPV ultramegasimplificado",
    "prompt": "Una tienda aplica un 15 % de descuento a los clientes mayores de 65 años y un 10 % a los\nmenores de 25. Para cada venta, el programa pide el precio del artículo y la fecha de\nnacimiento del cliente, calcula su edad (reutiliza el ejercicio 5) y muestra el precio final.\nEl programa se repite hasta que se introduce un precio negativo.",
    "sourcePage": 9
  },
  {
    "id": "rel-65",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "8. Número a letra",
    "prompt": "Lee un número de hasta 5 cifras y escríbelo con letra. Por ejemplo, para 1980 la salida es\n«mil novecientos ochenta».\nDespués, diseña una batería de casos de prueba basada en clases de equivalencia y\ncompruébalos con tu programa. Prepárate para descubrir unos cuantos errores.",
    "sourcePage": 10
  },
  {
    "id": "rel-66",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "9. Atracción gravitatoria",
    "prompt": "La gravedad terrestre vale unos 9,8 m/s² al nivel del mar, pero disminuye con la altura. A\nuna altura ℎ (en metros):\n𝑅2\n𝑔(ℎ) = 9,8 ⋅\n(𝑅+ ℎ)2\ndonde 𝑅 es el radio de la Tierra, unos 6 370 000 m.\nMuestra una tabla con la gravedad cada 100 km, hasta la altura que indique el usuario. Para\n400 km:\nAltitud (km)   Gravedad (m/s2)\n------------   ---------------\n0            9,80\n100            9,50\n200            9,21\n300            8,94\n400            8,68",
    "sourcePage": 11
  },
  {
    "id": "rel-67",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "10. Conjetura de Goldbach",
    "prompt": "La conjetura de Goldbach (siglo XVIII) dice que todo número par mayor que 4 es la suma\nde dos números primos impares, no necesariamente distintos. Por ejemplo: 20 = 13 + 7, 8 =\n5 + 3 y 14 = 7 + 7. Nadie ha conseguido demostrarla, pero tampoco se ha encontrado\nningún número que no la cumpla.\nPide un número N par y mayor que 4, y muestra dos primos que sumados den N.",
    "sourcePage": 12
  },
  {
    "id": "rel-68",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "11. Ruleta",
    "prompt": "Juega a la ruleta contra el ordenador. La ruleta tiene 20 números rojos y 20 negros. El\njugador empieza con una cantidad de dinero y, en cada jugada, apuesta (como mucho, lo\nque le queda) a un número y un color. El ordenador gira la ruleta con Math.random() : si el\njugador acierta, gana 10 veces lo apostado; si no, lo pierde.\nEl juego sigue hasta que el jugador se retira o se queda sin dinero.",
    "sourcePage": 13
  },
  {
    "id": "rel-69",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "12. Dados",
    "prompt": "Juega a los dados contra el ordenador:\nEl jugador empieza con una cantidad de dinero que introduce por teclado.\nEn cada jugada apuesta una cantidad (como mucho, lo que le queda) y se tiran tres\ndados con Math.random() .\nSi salen tres iguales, la apuesta se multiplica por 5 si son seises, y por 3 en otro caso.\nSi salen dos iguales, la apuesta se multiplica por 2.\nEn cualquier otro caso, se pierde lo apostado.\nEl juego sigue hasta que el jugador se retira o se queda sin dinero.",
    "sourcePage": 14
  },
  {
    "id": "rel-70",
    "topic": "Tema 2",
    "category": "3. Programas completos",
    "title": "13. Tragaperras",
    "prompt": "WHILE)\nSimula una máquina tragaperras:\n1. El programa pregunta con cuánto dinero se quiere jugar: entre 1 y 50 €.\n2. Cada jugada cuesta 0,50 €, que se descuentan del saldo.\n3. En cada jugada salen tres frutas al azar entre seis: manzana, naranja, fresa, cereza,\nlimón y sandía.\n4. Premios:\nCombinación     Premio\nTres cerezas      30 €\nTres sandías      20 €\nTres fresas       10 €\nOtras tres iguales  5 €\nDos cerezas       3 €\nDos sandías       2 €\nOtras dos iguales  1 €\nTres distintas     Nada\n5. Tras cada jugada, la máquina muestra la combinación, el premio y el saldo, y pregunta\nsi se quiere seguir. Si el saldo no llega para otra jugada, el juego termina sin preguntar.\nEjemplo de ejecución:\n*** BIENVENIDO AL JUEGO DE LA TRAGAPERRAS ***\n¿Con cuánto dinero desea empezar (de 1 a 50 euros)? 60\nCantidad incorrecta\n¿Con cuánto dinero desea empezar (de 1 a 50 euros)? 20\nCOMIENZA EL JUEGO...\nLa combinación de esta jugada es: NARANJA - CEREZA - SANDÍA\nLo siento, no ha obtenido ningún premio\nSu saldo actual es de 19,5 euros.\n¿Desea jugar otra vez (S/N)? S\nLa combinación de esta jugada es: SANDÍA - SANDÍA - LIMÓN\n¡Enhorabuena! Ha ganado 2 euros.\nSu saldo actual es de 21,0 euros.\n¿Desea jugar otra vez (S/N)? N\n¡Hasta la próxima!\nRetos\nEstos dos juegos son más difíciles de lo que parecen con lo que sabes ahora. Guárdalos: los\nresolverás mucho mejor cuando veas los arrays (Unidad 05 - Estructuras de\nalmacenamiento).\nJuego de memoria\nAl empezar, el jugador elige el nivel: fácil, medio o difícil.\nEl ordenador muestra una serie de números al azar (solo 1, 2 o 3) durante un tiempo,\nque es menor cuanto más difícil es el nivel. La primera serie tiene un número; la\nsiguiente, dos, y así hasta diez.\nDespués borra la serie y el jugador debe repetirla. Si acierta, pasa a la siguiente; si falla,\npierde. Si completa la serie de diez, gana.\nTres en raya\nJuega a las tres en raya contra el ordenador en un tablero de 3 × 3. El jugador usa O y el\nordenador, X . Empieza uno de los dos al azar y se alternan los turnos hasta que alguien\nforma una línea (horizontal, vertical o diagonal) o el tablero se llena (tablas).\nEntrega\nComprime las carpetas de los proyectos en un fichero .zip con el formato\nApellido1_Apellido2_Nombre.zip . Por ejemplo: Sanchez_Perez_Anselmo.zip .\nPrepárate para explicar tu código: el profesor te pedirá que lo defiendas en clase.\n⬅️ Anterior: 2. Estructura secuencial | 🏠 Unidad: Unidad 02 - Estructuras de control.\nCalidad del software | Siguiente: 4. Estructura repetitiva (bucles) ➡️",
    "sourcePage": 15
  },
  {
    "id": "rel-71",
    "topic": "Tema 2",
    "category": "4. Sentencias de salto",
    "title": "1. ¿Qué muestra?",
    "prompt": "Sin ejecutarlos, escribe qué muestra cada fragmento. Después, compruébalo en NetBeans\ny explica las diferencias, si las hay.\n// a)\nfor (int i = 1; i <= 10; i++) {\nif (i == 5) {\nbreak;\n}\nSystem.out.print(i + \" \");\n}\n// b)\nfor (int i = 1; i <= 10; i++) {\nif (i % 3 == 0) {\ncontinue;\n}\nSystem.out.print(i + \" \");\n}\n// c)\nfor (int i = 1; i <= 3; i++) {\nfor (int j = 1; j <= 3; j++) {\nif (j == 2) {\nbreak;\n}\nSystem.out.print(i + \"-\" + j + \" \");\n}\n}\nEn el fragmento c), ¿de qué bucle sale el break : del interior o del exterior?",
    "sourcePage": 3
  },
  {
    "id": "rel-72",
    "topic": "Tema 2",
    "category": "4. Sentencias de salto",
    "title": "2. Primer múltiplo",
    "prompt": "Pide dos números, A y B, y muestra el primer múltiplo de 7 que haya entre ellos. En cuanto\nlo encuentres, deja de buscar con break . Si no hay ninguno, el programa debe decirlo.\nDespués, reescribe el programa sin break , usando una variable booleana en la condición\ndel bucle. ¿Qué versión te parece más clara?",
    "sourcePage": 4
  },
  {
    "id": "rel-73",
    "topic": "Tema 2",
    "category": "4. Sentencias de salto",
    "title": "3. Suma de positivos",
    "prompt": "Pide 10 números y suma solo los positivos. Usa continue para saltarte los negativos y el\ncero.\nDespués, reescribe el programa sin continue . ¿Qué cambia?",
    "sourcePage": 5
  },
  {
    "id": "rel-74",
    "topic": "Tema 2",
    "category": "4. Sentencias de salto",
    "title": "4. Menú",
    "prompt": "Escribe un programa que muestre este menú una y otra vez hasta que el usuario elija salir:\n1. Saludar\n2. Mostrar la hora del sistema\n3. Salir\nElige una opción:\nUsa un switch para las opciones.\n1. ¿Qué hace el break dentro de cada case ? ¿Qué ocurre si quitas uno?\n2. ¿Puedes salir del bucle con el break del case 3 ? ¿Por qué? ¿Cómo lo resuelves?\nTip\nPara la hora del sistema puedes usar java.time.LocalTime.now() .\nEntrega\nResponde a las preguntas en un documento (Word, LibreOffice Writer, etc.).\nComprime el documento y las carpetas de los proyectos en un fichero .zip con el\nformato Apellido1_Apellido2_Nombre.zip . Por ejemplo:\nSanchez_Perez_Anselmo.zip .\n⬅️ Anterior: 3. Estructura selectiva (condicional) | 🏠 Unidad: Unidad 02 - Estructuras de\ncontrol. Calidad del software | Siguiente: 5. Instrucciones de salto ➡️",
    "sourcePage": 6
  },
  {
    "id": "rel-75",
    "topic": "Tema 2",
    "category": "5. Excepciones",
    "title": "1. División segura",
    "prompt": "instrucciones de entrada\nPide al usuario dos números enteros y divide el primero entre el segundo. El programa\ndebe capturar estos errores:\nSi el segundo número es cero, una excepción de error aritmético.\nSi el usuario introduce un valor que no es un número entero (un texto, un número con\ndecimales…), una excepción de entrada incorrecta.\nEn ambos casos, muestra un mensaje claro y termina el programa sin que se vea la traza\ndel error.",
    "sourcePage": 3
  },
  {
    "id": "rel-76",
    "topic": "Tema 2",
    "category": "5. Excepciones",
    "title": "2. Pedir un entero hasta que sea válido",
    "prompt": "Bucle «Hacer… mientras» (DO-WHILE)\nPide por teclado un número entero. Si el usuario introduce algo que no es un entero,\navísale y vuelve a pedírselo, tantas veces como haga falta.\nCuando por fin tengas un entero válido, di si es par o impar.\nTip\nSi nextInt() falla, el texto incorrecto se queda en el Scanner . ¿Qué pasa si no lo\nretiras antes de volver a leer?",
    "sourcePage": 4
  },
  {
    "id": "rel-77",
    "topic": "Tema 2",
    "category": "5. Excepciones",
    "title": "3. Notas con excepción propia",
    "prompt": "1. Crea la excepción NotaInvalidaException , siguiendo la plantilla de los apuntes.\n2. Escribe un método static void comprobarNota(double nota) que lance\nNotaInvalidaException , con un mensaje que incluya la nota, si esta no está entre 0 y\n10.\n3. En el main , pide notas hasta que el usuario introduzca un número negativo. Para cada\nnota, llama a comprobarNota y muestra «Nota correcta» o el mensaje de la excepción.\nTip\nCon el idioma del sistema en español, nextDouble() espera los decimales con coma\n( 7,5 ). Si escribes 7.5 , lanzará InputMismatchException .\nDespués, responde:\n¿Qué ocurre si no pones throws NotaInvalidaException en la cabecera de\ncomprobarNota ? ¿Por qué?\n¿Y si NotaInvalidaException extendiera de RuntimeException en lugar de\nException ?\nEntrega\nResponde a las preguntas en un documento (Word, LibreOffice Writer, etc.).\nComprime el documento y las carpetas de los proyectos en un fichero .zip con el\nformato Apellido1_Apellido2_Nombre.zip . Por ejemplo:\nSanchez_Perez_Anselmo.zip .\n⬅️ Anterior: 4. Estructura repetitiva (bucles) | 🏠 Unidad: Unidad 02 - Estructuras de\ncontrol. Calidad del software | Siguiente: 6. Reglas de estilo ➡️",
    "sourcePage": 5
  },
  {
    "id": "rel-78",
    "topic": "Tema 2",
    "category": "6. Documentación, pruebas y depuración",
    "title": "1. Encuentra el error con el depurador",
    "prompt": "Este programa debería contar los números pares entre 1 y N y sumarlos. Para N = 10\ntendría que mostrar Hay 5 pares y suman 30 , pero muestra Hay 5 pares y suman 9 :\nimport java.util. Scanner;\npublic class Pares {\npublic static void main(String[] args) {\nScanner sc = new Scanner(System.in);\nSystem.out.print(\"N: \");\nint n = sc.nextInt();\nint suma = 0;\nint contador = 0;\nfor (int i = 1; i <= n; i++) {\nif (i % 2 == 1) {\nsuma = i;\ncontador++;\n}\n}\nSystem.out.println(\"Hay \" + contador + \" pares y suman \" + suma);\n}\n}\n1. Pon un punto de ruptura dentro del if y avanza con Continue ( F5 ). Anota en una\ntabla los valores de i , suma y contador en cada parada.\n2. ¿Por qué contador sale bien aunque el programa esté mal?\n3. Hay dos errores. Encuéntralos, explica cada uno y corrígelos.\n4. Adjunta una captura de la ventana Variables en la que se vea uno de los errores.",
    "sourcePage": 3
  },
  {
    "id": "rel-79",
    "topic": "Tema 2",
    "category": "6. Documentación, pruebas y depuración",
    "title": "2. Pruebas de caja negra",
    "prompt": "Elige el ejercicio 4 (año bisiesto) o el 9 (calculadora) de 1. Estructuras de selección.\n1. Diseña sus clases de equivalencia, válidas y no válidas.\n2. Escribe una tabla de casos de prueba, con al menos uno por clase y los valores límite:\nN.º    Entrada  Resultado esperado  Resultado obtenido  ¿Correcto?\n1\n3. Ejecuta las pruebas y completa la tabla. Si alguna falla, corrige el programa y vuelve a\nprobar.",
    "sourcePage": 4
  },
  {
    "id": "rel-80",
    "topic": "Tema 2",
    "category": "6. Documentación, pruebas y depuración",
    "title": "3. Aserciones",
    "prompt": "1. Activa las aserciones en NetBeans (opción -ea ) y comprueba que funcionan con\nassert false : \"Las aserciones están activas\"; .\n2. En el ejercicio 10 (factorial) de 2. Estructuras de repetición, añade:\nUna aserción antes del cálculo que compruebe que N no es negativo.\nUna aserción después que compruebe que el resultado es mayor que 0.\n3. Prueba con N = −3 y con N = 17 (usando int ). ¿Qué aserción falla en cada caso? ¿Qué\nerror del programa ha descubierto la segunda?\n4. Prueba ahora con N = 13. Ninguna aserción falla, pero el resultado es incorrecto (13! =\n6 227 020 800). ¿Por qué no lo detecta la aserción? ¿Qué te dice esto sobre las\naserciones como herramienta de prueba?\n5. Desactiva las aserciones y repite las pruebas. ¿Qué cambia? ¿Por qué las aserciones no\nsustituyen a la validación de los datos del usuario?",
    "sourcePage": 5
  },
  {
    "id": "rel-81",
    "topic": "Tema 2",
    "category": "6. Documentación, pruebas y depuración",
    "title": "4. Documenta tu código",
    "prompt": "Elige uno de tus programas de 3. Programas completos.\n1. Revisa que cumple las reglas de estilo: sangrías, llaves, una instrucción por línea,\nespacios y nombres de identificadores.\n2. Añade un comentario javadoc a la clase (descripción, @author , @version ) y\ncomentarios de línea en las partes difíciles. Comenta por qué haces las cosas, no qué\nhace cada línea.\n3. Genera la documentación con NetBeans (Run → Generate Javadoc) y adjunta una\ncaptura de la página generada.",
    "sourcePage": 6
  },
  {
    "id": "rel-82",
    "topic": "Tema 2",
    "category": "6. Documentación, pruebas y depuración",
    "title": "5. ¿Aserción o excepción?",
    "prompt": "Para cada situación, indica si la comprobarías con una aserción ( assert ) o con control de\nerrores (un if que avisa al usuario o una excepción), y justifica por qué en una frase:\nN.º    Situación                                           ¿ assert o        ¿Por\ncontrol de        qué?\nerrores?\n1       El usuario escribe una nota de 12 cuando el rango\nválido es de 0 a 10.\n2     Después de ordenar un array con tu propio\nalgoritmo, cada elemento debe ser menor o igual\nque el siguiente.\n3       El fichero de configuración que el programa\nnecesita abrir no existe.\n4     En un método, calculas int medio = (inicio +\nfin) / 2; y medio debe quedar siempre entre\ninicio y fin .\n5      Tras aplicar un descuento, el precio final nunca\npuede ser mayor que el original.\n6       El usuario escribe «hola» cuando el programa le\npide un número.\n7     En un bucle de intentos, el contador nunca debe\nsuperar el máximo de intentos.\n8       El servidor del que el programa descarga los datos\nno responde.",
    "sourcePage": 7
  },
  {
    "id": "rel-83",
    "topic": "Tema 2",
    "category": "6. Documentación, pruebas y depuración",
    "title": "6. Una aserción dentro del bucle",
    "prompt": "Este programa aplica una lista de movimientos a una cuenta que empieza con 0 €. Los\npositivos son ingresos y los negativos, gastos. Un gasto solo se aplica si hay saldo\nsuficiente; si no, se rechaza:\npublic class Cuenta {\npublic static void main(String[] args) {\nint[] movimientos = {100, -30, -50, 20, -60, -40, 10};\nint saldo = 0;\nint rechazados = 0;\nfor (int i = 0; i < movimientos.length; i++) {\nint movimiento = movimientos[i];\nif (movimiento > 0 || saldo >= movimiento) {\nsaldo += movimiento;\n} else {\nrechazados++;\n}\n}\nSystem.out.println(\"Saldo final: \" + saldo + \" €. Movimientos\nrechazados: \" + rechazados);\n}\n}\n1. Calcula a mano, sin ejecutar el programa, el saldo final y el número de movimientos\nrechazados que debería mostrar.\n2. Ejecútalo. ¿Coincide con lo que has calculado?\n3. Hay una condición que debe cumplirse siempre después de cada movimiento, sean\ncuales sean los datos. ¿Cuál es? Añade una aserción dentro del bucle que la compruebe,\ncon un mensaje que indique el número de movimiento y el saldo.\n4. Ejecuta con -ea . ¿En qué movimiento falla la aserción? Corrige el error y comprueba\nque ya no falla.\n5. ¿Por qué aquí es adecuado un assert y no un if que muestre un mensaje al usuario?\nEntrega\nResponde a las preguntas en un documento (Word, LibreOffice Writer, etc.), con las\ntablas y los pantallazos que se piden.\nComprime el documento y las carpetas de los proyectos en un fichero .zip con el\nformato Apellido1_Apellido2_Nombre.zip . Por ejemplo:\nSanchez_Perez_Anselmo.zip .\nRúbrica\nRúbrica para el calificador de Moodle: una fila por CE y cuatro niveles. Los puntos máximos\nde cada CE son proporcionales a su peso en el RA 3 (f: 5 %; g e i: 10 %; los ejercicios\nevalúan un bloque del 25 %).\nCE (RA 3)    Se         Nivel 0      Nivel 1        Nivel 2            Nivel 3\nevalúa                                              (máximo)\nen\nf) Probar y     Ejercicios  0 · No se     0,8 · Se usa     1,4 · Se localiza y   2 · La tabla d\ndepurar los   1 y 2      hacen o      el depurador   corrige uno de      depuración\nprogramas             no se usa   o se diseñan    los dos errores, y    refleja los\nel           casos de        los casos de        valores reale\ndepurador   prueba, pero   prueba cubren     se explican y\nni se          sin localizar     casi todas las       corrigen los\ndiseñan      los errores o    clases, sin todos    dos errores,\npruebas.     sin cubrir las    los valores límite.    las pruebas\nclases de                        cubren todas\nequivalencia.                          las clases de\nequivalencia\nlos valores\nlímite.\ng)              Ejercicio   0 · No se     1,6 · Hay       2,8 · Javadoc de    4 · Estilo\nComentar y   4           hace.        comentarios,   la clase con         correcto,\ndocumentar                        pero sin        descripción,        javadoc\nel código                             javadoc o      @author y         completo,\ncomentando   @version , y       comentarios\nqué hace        estilo correcto;    que explican\ncada línea; el   faltan             porqué y\nestilo tiene    comentarios        captura de la\nbastantes       útiles o la         documentac\nfallos.        documentación     generada.\ngenerada.\ni) Usar         Ejercicios  0 · No se     1,6 · Se         2,8 · Aserciones    4 · Asercione\naserciones     3, 5 y 6    hacen o     añaden        correctas y         bien situada\nno se        aserciones,     ejercicio 5 casi     con mensaje\nactivan las   pero mal      todo bien, pero     se explica qu\naserciones.  situadas o      falta explicar qué   detectan y q\nsin mensaje,   no detectan        no, se\no se           (desbordamiento,   distingue co\nconfunden     -ea                  criterio entre\ncon el         desactivado) o no   assert y\ncontrol de     se corrige el error   control de\nerrores en la   del bucle.           errores, y se\nmayoría de                         corrige el er\nlas                                del bucle.\nsituaciones\ndel ejercicio\n5.\nTotal: 10\nCE del RA 3 que no evalúan estos ejercicios\na) a e) y h): se trabajan en 1. Estructuras de selección a 5. Excepciones.\n⬅️ Anterior: 5. Instrucciones de salto | 🏠 Unidad: Unidad 02 - Estructuras de control.\nCalidad del software | Siguiente: 7. Excepciones ➡️",
    "sourcePage": 8
  }
]
export function getRelacion(id:string){return relacionesInteractivas.find(r=>r.id===id)}
