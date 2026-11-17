export type ExamQuestion = { id: string; unit: number; topic: string; prompt: string; options: string[]; correct: number[]; explanation: string }
export const examQuestions: ExamQuestion[] = [
  {
    "id": "u1-01",
    "unit": 1,
    "topic": "Algoritmos",
    "prompt": "¿Qué propiedades debe cumplir un algoritmo?",
    "options": [
      "Ser finito",
      "Ser preciso",
      "Depender obligatoriamente de Java",
      "Ser definido"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "Un algoritmo es preciso, definido y finito; no depende del lenguaje."
  },
  {
    "id": "u1-02",
    "unit": 1,
    "topic": "Sistemas de numeración",
    "prompt": "¿Qué valores equivalen al binario 10110?",
    "options": [
      "22 en decimal",
      "26 en decimal",
      "16 en hexadecimal",
      "26 en octal"
    ],
    "correct": [
      0,
      2
    ],
    "explanation": "10110₂ = 22₁₀ = 16₁₆."
  },
  {
    "id": "u1-03",
    "unit": 1,
    "topic": "Sistemas de numeración",
    "prompt": "¿Cuáles son sistemas posicionales estudiados en la unidad?",
    "options": [
      "Binario",
      "Octal",
      "Hexadecimal",
      "ASCII como base numérica"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "Binario, octal y hexadecimal son sistemas de numeración; ASCII es una codificación."
  },
  {
    "id": "u1-04",
    "unit": 1,
    "topic": "ASCII",
    "prompt": "¿Qué afirmaciones son correctas sobre ASCII según el temario?",
    "options": [
      "A mayúscula corresponde al decimal 65",
      "a minúscula corresponde al decimal 97",
      "A y a tienen el mismo código",
      "Se utiliza para representar caracteres"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "A y a tienen códigos distintos; ASCII representa caracteres."
  },
  {
    "id": "u1-05",
    "unit": 1,
    "topic": "Ciclo de vida",
    "prompt": "¿Qué tareas corresponden a la fase de análisis?",
    "options": [
      "Determinar qué problema hay que resolver",
      "Identificar requisitos",
      "Elegir colores de la interfaz obligatoriamente",
      "Entender los datos necesarios"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "El análisis determina el qué, los requisitos y la información implicada."
  },
  {
    "id": "u1-06",
    "unit": 1,
    "topic": "Ciclo de vida",
    "prompt": "En el diseño de soluciones, ¿qué se pretende?",
    "options": [
      "Definir cómo resolver el problema",
      "Descomponerlo en partes más pequeñas",
      "Corregir exclusivamente errores en producción",
      "Proponer un algoritmo"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "El diseño responde al cómo y puede aplicar divide y vencerás."
  },
  {
    "id": "u1-07",
    "unit": 1,
    "topic": "Java y JVM",
    "prompt": "¿Qué afirmaciones son correctas?",
    "options": [
      "javac compila código fuente Java",
      "La JVM ejecuta bytecode",
      "El JDK incluye herramientas de desarrollo",
      "El archivo .java es bytecode ejecutable"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "El código fuente .java se compila; el bytecode se ejecuta en la JVM."
  },
  {
    "id": "u1-08",
    "unit": 1,
    "topic": "Tipos primitivos",
    "prompt": "¿Cuáles son declaraciones válidas en Java?",
    "options": [
      "int edad = 18;",
      "boolean activo = true;",
      "char inicial = 'A';",
      "double precio = \"9.99\";"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "double necesita un valor numérico, no una cadena."
  },
  {
    "id": "u1-09",
    "unit": 1,
    "topic": "Tipos primitivos",
    "prompt": "¿Qué afirmaciones sobre tipos son correctas?",
    "options": [
      "int almacena enteros",
      "boolean solo puede ser true o false",
      "char representa un carácter",
      "String es un tipo primitivo"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "String es una clase, no un tipo primitivo."
  },
  {
    "id": "u1-10",
    "unit": 1,
    "topic": "Operadores",
    "prompt": "Con int a = 17; int b = 5; ¿qué expresiones son verdaderas?",
    "options": [
      "a / b == 3",
      "a % b == 2",
      "a / b == 3.4",
      "a > b && b > 0"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "La división de enteros trunca la parte decimal y % devuelve el resto."
  },
  {
    "id": "u1-11",
    "unit": 1,
    "topic": "Operadores",
    "prompt": "¿Cuáles son operadores lógicos de Java?",
    "options": [
      "&&",
      "||",
      "!",
      "%"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "% es el operador resto, no lógico."
  },
  {
    "id": "u1-12",
    "unit": 1,
    "topic": "Casting",
    "prompt": "Con double d = 8.9; int n = (int) d; ¿qué ocurre?",
    "options": [
      "n vale 8",
      "Se descarta la parte decimal",
      "n vale 9 por redondeo",
      "Es una conversión explícita"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "El casting de double a int trunca la parte decimal."
  },
  {
    "id": "u1-13",
    "unit": 1,
    "topic": "Variables",
    "prompt": "¿Qué identificadores son válidos?",
    "options": [
      "numeroIntentos",
      "_contador",
      "2numero",
      "class"
    ],
    "correct": [
      0,
      1
    ],
    "explanation": "No pueden comenzar por dígitos ni coincidir con palabras reservadas."
  },
  {
    "id": "u1-14",
    "unit": 1,
    "topic": "Constantes",
    "prompt": "¿Qué opciones describen correctamente final?",
    "options": [
      "Impide reasignar una variable una vez inicializada",
      "Puede emplearse para declarar constantes",
      "Convierte automáticamente int en String",
      "final double IVA = 0.21; es válido"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "final evita reasignaciones; no convierte tipos."
  },
  {
    "id": "u1-15",
    "unit": 1,
    "topic": "Scanner",
    "prompt": "¿Qué instrucciones son adecuadas para leer un entero con Scanner?",
    "options": [
      "import java.util.Scanner;",
      "Scanner sc = new Scanner(System.in);",
      "int n = sc.nextInt();",
      "int n = sc.nextBoolean();"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "nextInt() lee un entero; nextBoolean() lee booleanos."
  },
  {
    "id": "u1-16",
    "unit": 1,
    "topic": "Ámbito y comentarios",
    "prompt": "¿Qué afirmaciones son correctas?",
    "options": [
      "Una variable local solo está disponible en su ámbito",
      "// introduce un comentario de línea",
      "/* ... */ delimita un comentario de bloque",
      "Los comentarios cambian el resultado de las operaciones"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "Los comentarios no alteran la lógica ejecutada."
  },
  {
    "id": "u1-17",
    "unit": 1,
    "topic": "Operadores",
    "prompt": "Con int x = 4; ¿qué expresiones dan como resultado true?",
    "options": [
      "x >= 4",
      "x != 5",
      "x < 3",
      "x == 4"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "4 es mayor o igual que 4, distinto de 5 e igual a 4."
  },
  {
    "id": "u1-18",
    "unit": 1,
    "topic": "Conversión",
    "prompt": "¿Qué conversiones son implícitas y seguras en estos ejemplos?",
    "options": [
      "int a = 4; double b = a;",
      "byte a = 5; int b = a;",
      "double a = 3.5; int b = a;",
      "int a = 7; long b = a;"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "Convertir double a int exige casting explícito."
  },
  {
    "id": "u2-01",
    "unit": 2,
    "topic": "Estructuras de control",
    "prompt": "¿Cuáles son las tres estructuras fundamentales de la programación estructurada?",
    "options": [
      "Secuencial",
      "Selectiva",
      "Repetitiva",
      "Herencia"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "Herencia pertenece a la programación orientada a objetos."
  },
  {
    "id": "u2-02",
    "unit": 2,
    "topic": "Condicionales",
    "prompt": "Con int edad = 18; ¿qué condiciones son verdaderas?",
    "options": [
      "edad >= 18",
      "edad > 18",
      "edad == 18",
      "edad != 17"
    ],
    "correct": [
      0,
      2,
      3
    ],
    "explanation": "18 cumple >= 18, == 18 y != 17."
  },
  {
    "id": "u2-03",
    "unit": 2,
    "topic": "Condicionales",
    "prompt": "¿Qué afirmaciones sobre if / else if son correctas?",
    "options": [
      "Se evalúan las condiciones de arriba abajo",
      "Solo se ejecuta la primera rama verdadera",
      "Siempre se ejecutan todas las ramas",
      "El else final es opcional"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "En una cadena else if se toma como máximo una rama."
  },
  {
    "id": "u2-04",
    "unit": 2,
    "topic": "Ternario",
    "prompt": "¿Cuáles son usos correctos del operador ternario?",
    "options": [
      "int mayor = a > b ? a : b;",
      "String s = nota >= 5 ? \"Apto\" : \"No apto\";",
      "El ternario devuelve un valor",
      "El ternario sustituye siempre a cualquier bucle"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "El ternario selecciona entre dos valores según una condición."
  },
  {
    "id": "u2-05",
    "unit": 2,
    "topic": "Bucles",
    "prompt": "¿Qué afirmaciones son correctas sobre do-while?",
    "options": [
      "Ejecuta el cuerpo al menos una vez",
      "Comprueba la condición después del cuerpo",
      "Nunca puede repetir",
      "Es útil para menús repetitivos"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "do-while evalúa al final y garantiza una primera iteración."
  },
  {
    "id": "u2-06",
    "unit": 2,
    "topic": "Bucles",
    "prompt": "¿Cuántas veces se ejecuta for (int i = 1; i <= 4; i++)?",
    "options": [
      "3",
      "4",
      "5",
      "Infinitas"
    ],
    "correct": [
      1
    ],
    "explanation": "i toma los valores 1, 2, 3 y 4."
  },
  {
    "id": "u2-07",
    "unit": 2,
    "topic": "Bucles",
    "prompt": "¿Qué fragmentos pueden generar un bucle infinito?",
    "options": [
      "while (true) { }",
      "for (;;) { }",
      "for (int i=0; i<3; i++) { }",
      "while (false) { }"
    ],
    "correct": [
      0,
      1
    ],
    "explanation": "Ambos bucles carecen de una condición de finalización por sí mismos."
  },
  {
    "id": "u2-08",
    "unit": 2,
    "topic": "Contadores y acumuladores",
    "prompt": "¿Qué afirmaciones son correctas?",
    "options": [
      "contador++ incrementa una variable",
      "suma += n puede acumular valores",
      "boolean encontrado puede actuar como bandera",
      "Un acumulador solo puede almacenar String"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "Contadores, acumuladores y banderas tienen distintas funciones."
  },
  {
    "id": "u2-09",
    "unit": 2,
    "topic": "Saltos",
    "prompt": "¿Qué efectos tienen estas instrucciones?",
    "options": [
      "break puede salir de un bucle",
      "continue pasa a la siguiente iteración",
      "return finaliza la ejecución de un método",
      "break finaliza siempre toda la aplicación"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "break no implica finalizar toda la aplicación."
  },
  {
    "id": "u2-10",
    "unit": 2,
    "topic": "Cláusulas guardián",
    "prompt": "¿Qué ventajas ofrece una cláusula guardián?",
    "options": [
      "Detectar entradas inválidas al comienzo",
      "Reducir anidamientos innecesarios",
      "Terminar pronto un método con return",
      "Evitar toda comprobación de datos"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "Una cláusula guardián valida y sale pronto cuando no se cumplen precondiciones."
  },
  {
    "id": "u2-11",
    "unit": 2,
    "topic": "Excepciones",
    "prompt": "¿Qué afirmaciones sobre try-catch-finally son correctas?",
    "options": [
      "catch puede tratar excepciones",
      "finally se ejecuta normalmente tanto si hay excepción como si no",
      "try delimita código que puede fallar",
      "finally reemplaza siempre a catch"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "finally no sustituye la gestión de excepciones con catch."
  },
  {
    "id": "u2-12",
    "unit": 2,
    "topic": "Excepciones",
    "prompt": "¿Qué situaciones pueden lanzar estas excepciones?",
    "options": [
      "Dividir enteros entre cero: ArithmeticException",
      "nextInt() con texto no numérico: InputMismatchException",
      "Dividir double entre cero: siempre ArithmeticException",
      "Lanzar una excepción con throw"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "La división flotante entre cero no produce ArithmeticException como la entera."
  },
  {
    "id": "u2-13",
    "unit": 2,
    "topic": "Excepciones",
    "prompt": "¿Qué instrucciones están relacionadas con excepciones?",
    "options": [
      "throw",
      "throws",
      "catch",
      "continue"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "continue controla iteraciones, no declara ni lanza excepciones."
  },
  {
    "id": "u2-14",
    "unit": 2,
    "topic": "Pruebas",
    "prompt": "¿Qué afirmaciones son correctas?",
    "options": [
      "La validación comprueba si el producto satisface necesidades",
      "La verificación comprueba si cumple especificaciones",
      "Las pruebas de caja negra consideran entradas y salidas",
      "Las pruebas eliminan la necesidad de depurar"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "Las pruebas ayudan a detectar defectos, no eliminan la depuración."
  },
  {
    "id": "u2-15",
    "unit": 2,
    "topic": "Depuración",
    "prompt": "¿Qué permite hacer un depurador?",
    "options": [
      "Colocar puntos de ruptura",
      "Inspeccionar variables",
      "Avanzar paso a paso",
      "Garantizar que nunca habrá errores"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "Un depurador permite analizar el comportamiento, no garantiza ausencia de errores."
  },
  {
    "id": "u2-16",
    "unit": 2,
    "topic": "Estilo",
    "prompt": "¿Qué prácticas mejoran la calidad del código?",
    "options": [
      "Nombres descriptivos",
      "Sangría consistente",
      "Documentación con Javadoc",
      "Una sola línea para todo el programa"
    ],
    "correct": [
      0,
      1,
      2
    ],
    "explanation": "La legibilidad mejora con nombres claros, formato y documentación."
  },
  {
    "id": "u2-17",
    "unit": 2,
    "topic": "Bucles anidados",
    "prompt": "Un for exterior recorre 3 semanas y otro interior 5 días. ¿Qué afirmaciones son correctas?",
    "options": [
      "El cuerpo interior se ejecuta 15 veces",
      "El exterior se ejecuta 3 veces",
      "El interior se ejecuta solo 5 veces en total",
      "Cada semana recorre 5 días"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "3 × 5 = 15 iteraciones interiores."
  },
  {
    "id": "u2-18",
    "unit": 2,
    "topic": "Aserciones",
    "prompt": "¿Qué afirmaciones son correctas sobre assert?",
    "options": [
      "Puede comprobar suposiciones durante el desarrollo",
      "Puede requerir activación al ejecutar Java",
      "Sustituye toda validación de datos del usuario",
      "Puede ayudar a detectar errores lógicos"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "Las aserciones apoyan las pruebas, pero no sustituyen la validación normal."
  },
  {
    "id": "u2-19",
    "unit": 2,
    "topic": "Métodos",
    "prompt": "¿Qué afirmaciones sobre return son correctas?",
    "options": [
      "Devuelve un valor en métodos no void",
      "Puede salir anticipadamente de un método void",
      "Es lo mismo que continue",
      "Termina la ejecución del método actual"
    ],
    "correct": [
      0,
      1,
      3
    ],
    "explanation": "return finaliza el método, a diferencia de continue."
  }
]
