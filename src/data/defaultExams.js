export const DIAGNOSTIC_EXAM = {
    title: "PRUEBA DIAGNÓSTICA DE PROGRAMACIÓN",
    description: "Evaluación diagnóstica para estudiantes de segundo semestre de Ingeniería de Sistemas – Universidad de los Andes. Este examen no tiene nota punitiva, su objetivo es identificar fortalezas y áreas de mejora.",
    settings: {
        showGradeImmediate: true // Feedback inmediato para el estudiante
    },
    questions: [
        // --- SELECCIÓN MÚLTIPLE ---
        {
            id: "q1",
            type: "multiple_choice",
            text: "¿Qué es un algoritmo?",
            options: [
                "Un programa escrito en un lenguaje",
                "Una secuencia finita y ordenada de pasos para resolver un problema",
                "Un software de programación",
                "Una instrucción del computador"
            ],
            correctAnswer: "Una secuencia finita y ordenada de pasos para resolver un problema",
            points: 10
        },
        {
            id: "q2",
            type: "multiple_choice",
            text: "¿Cuál es la diferencia principal entre algoritmo y programa?",
            options: [
                "El algoritmo solo existe en pseudocódigo",
                "El programa es la implementación del algoritmo en un lenguaje ejecutable",
                "El algoritmo depende del hardware",
                "No hay diferencia"
            ],
            correctAnswer: "El programa es la implementación del algoritmo en un lenguaje ejecutable",
            points: 10
        },
        {
            id: "q3",
            type: "multiple_choice",
            text: "¿Cuál NO es un tipo de dato primitivo común?",
            options: [
                "Entero",
                "Booleano",
                "Arreglo",
                "Real"
            ],
            correctAnswer: "Arreglo",
            points: 10
        },
        {
            id: "q4",
            type: "multiple_choice",
            text: "Dado: x = 10, y = 3, resultado = x / y. ¿Qué representa conceptualmente resultado?",
            options: [
                "Entero",
                "Real",
                "Booleano",
                "Error"
            ],
            correctAnswer: "Real",
            points: 10
        },
        {
            id: "q5",
            type: "multiple_choice",
            text: "¿Cuándo es más apropiado usar un ciclo while?",
            options: [
                "Número de repeticiones fijo",
                "Recorrer un arreglo",
                "Cuando no se conoce la condición de parada",
                "Cuando se ejecuta al menos una vez"
            ],
            correctAnswer: "Cuando no se conoce la condición de parada",
            points: 10
        },
        {
            id: "q6",
            type: "multiple_choice",
            text: "¿Cuál es el propósito principal de una estructura condicional?",
            options: [
                "Repetir instrucciones",
                "Comparar valores",
                "Tomar decisiones basadas en condiciones",
                "Almacenar datos"
            ],
            correctAnswer: "Tomar decisiones basadas en condiciones",
            points: 10
        },
        {
            id: "q7",
            type: "multiple_choice",
            text: "¿Para qué sirve una función o método?",
            options: [
                "Reducir memoria",
                "Organizar y reutilizar código",
                "Aumentar velocidad",
                "Evitar errores"
            ],
            correctAnswer: "Organizar y reutilizar código",
            points: 10
        },
        {
            id: "q8",
            type: "multiple_choice",
            text: "En Programación Orientada a Objetos, ¿qué es una clase?",
            options: [
                "Un objeto",
                "Un bloque que se ejecuta una vez",
                "Un molde para crear objetos",
                "Un tipo de variable"
            ],
            correctAnswer: "Un molde para crear objetos",
            points: 10
        },
        {
            id: "q9",
            type: "multiple_choice",
            text: "¿Cuál concepto pertenece a POO?",
            options: [
                "Iteración",
                "Compilación",
                "Encapsulamiento",
                "Recursión"
            ],
            correctAnswer: "Encapsulamiento",
            points: 10
        },
        {
            id: "q10",
            type: "multiple_choice",
            text: "¿Cuál es el objetivo del debugging?",
            options: [
                "Escribir más rápido",
                "Mejorar el diseño",
                "Identificar y corregir errores",
                "Traducir código"
            ],
            correctAnswer: "Identificar y corregir errores",
            points: 10
        },
        // --- PREGUNTAS ABIERTAS ---
        {
            id: "q11",
            type: "open",
            text: "Explique la diferencia entre variable y constante. Incluya un ejemplo.",
            points: 10
        },
        {
            id: "q12",
            type: "open",
            text: "Describa paso a paso cómo resolvería este problema (sin código): 'Dado un conjunto de calificaciones, determinar cuántas están por encima del promedio.'",
            points: 10
        },
        {
            id: "q13",
            type: "open",
            text: "¿Qué significa para usted 'pensar como programador'? Use un ejemplo cotidiano.",
            points: 10
        },
        {
            id: "q14",
            type: "open",
            text: "Un programa funciona pero da resultados incorrectos. ¿Qué pasos seguiría para encontrar el error?",
            points: 10
        },
        {
            id: "q15",
            type: "open",
            text: "¿Qué temas de programación considera que domina mejor y cuáles necesita reforzar?",
            points: 10
        }
    ]
};
