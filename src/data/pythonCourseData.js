export const pythonCourseData = {
    title: "Programación Orientada a Objetos con Python",
    description: "Domina los fundamentos de programación y los conceptos avanzados de POO utilizando Python. Diseñado para principiantes y programadores intermedios.",
    color: "bg-blue-100", // Python colors
    modules: [
        {
            title: "Módulo 1: Fundamentos de Python",
            order: 1,
            lessons: [
                {
                    title: "Introducción y Variables",
                    content: `
# Objetivos de Aprendizaje
- Comprender qué es Python y por qué se usa.
- Dominar el uso de variables y tipos de datos básicos (int, float, str, bool).
- Utilizar funciones de entrada y salida (print, input).

## Conceptos Clave (Agnóstico)
En cualquier lenguaje de programación, una **variable** es un contenedor para almacenar datos. Los datos tienen un **tipo** que define qué operaciones se pueden realizar con ellos.

## Implementación en Python
Python es un lenguaje de tipado dinámico, lo que significa que no necesitas declarar el tipo de variable explícitamente.

\`\`\`python
# Ejemplo de Variables
nombre = "Santiago"  # String (str)
edad = 25            # Integer (int)
altura = 1.75        # Float (float)
es_estudiante = True # Boolean (bool)

print(f"Hola, soy {nombre} y tengo {edad} años.")
\`\`\`

## Errores Comunes
- **Case Sensitivity**: \`Nombre\` y \`nombre\` son variables diferentes.
- **Tipos incompatibles**: Intentar sumar un texto con un número sin convertirlo (casting) causa error.

## Ejercicio Guiado
Crea un script que pregunte el nombre y año de nacimiento, y calcule la edad actual.
`,
                    order: 1
                },
                {
                    title: "Control de Flujo: Condicionales y Ciclos",
                    content: `
# Objetivos
- Controlar el flujo del programa con \`if\`, \`elif\`, \`else\`.
- Iterar sobre datos usando \`for\` y \`while\`.

## Conceptos
El control de flujo permite que el programa tome decisiones o repita acciones.

## Python Code
\`\`\`python
edad = 18

if edad >= 18:
    print("Eres mayor de edad")
else:
    print("Eres menor de edad")

# Ciclo For
frutas = ["manzana", "banana", "cereza"]
for fruta in frutas:
    print(fruta)
\`\`\`

## Tarea Independiente
Crea un programa que imprima los números pares del 1 al 100.
`,
                    order: 2
                }
            ],
            assignments: [
                {
                    title: "Calculadora Básica",
                    description: "Crea un programa que pida dos números al usuario y una operación (+, -, *, /) e imprima el resultado. Maneja la división por cero.",
                    dueDateOffset: 7, // days from now
                    type: "task"
                }
            ],
            quiz: null
        },
        {
            title: "Módulo 2: Funciones y Estructuras",
            order: 2,
            lessons: [
                {
                    title: "Definiendo Funciones",
                    content: `
# Objetivos
- Modularizar código usando funciones.
- Entender parámetros y valores de retorno.

## Conceptos
Las funciones son bloques de código reutilizables. Evitan la repetición (concepto DRY - Don't Repeat Yourself).

## Python Code
\`\`\`python
def saludar(nombre, saludo="Hola"):
    return f"{saludo}, {nombre}!"

mensaje = saludar("Maria", "Buenos días")
print(mensaje)
\`\`\`
`,
                    order: 1
                },
                {
                    title: "Listas y Diccionarios",
                    content: `
# Objetivos
- Manejar estructuras de datos complejas.

## Diccionarios
Almacenan pares clave-valor, similares a objetos JSON.

\`\`\`python
estudiante = {
    "nombre": "Ana",
    "curso": "Python",
    "notas": [90, 85, 92]
}

print(estudiante["nombre"])
\`\`\`
`,
                    order: 2
                }
            ],
            assignments: [],
            quiz: {
                title: "Quiz: Funciones",
                description: "Evalúa tu conocimiento sobre funciones y alcance de variables.",
                questions: [
                    {
                        type: "multiple",
                        text: "¿Qué palabra clave se usa para definir una función en Python?",
                        options: ["func", "def", "function", "define"],
                        correctAnswer: 1
                    },
                    {
                        type: "code",
                        text: "¿Cuál es el output de: def suma(a, b): return a + b; print(suma(2, 3))?",
                        correctAnswer: "5"
                    }
                ]
            }
        },
        {
            title: "Módulo 3: Programación Orientada a Objetos",
            order: 3,
            lessons: [
                {
                    title: "Clases y Objetos",
                    content: `
# Objetivos
- Entender el paradigma POO.
- Crear Clases e Instancias.

## Conceptos
- **Clase**: El plano o molde (ej. Plano de una casa).
- **Objeto**: La instancia concreta (ej. La casa construida).

## Python Code
\`\`\`python
class Perro:
    # Constructor
    def __init__(self, nombre, raza):
        self.nombre = nombre
        self.raza = raza

    def ladrar(self):
        return "Guau!"

# Instanciación
mi_perro = Perro("Firulais", "Labrador")
print(mi_perro.ladrar())
\`\`\`
`,
                    order: 1
                },
                {
                    title: "Herencia y Polimorfismo",
                    content: `
# Objetivos
- Reutilizar código mediante Herencia.
- Sobrescribir métodos.

## Python Code
\`\`\`python
class Animal:
    def sonido(self):
        pass

class Gato(Animal):
    def sonido(self):
        return "Miau"

class Vaca(Animal):
    def sonido(self):
        return "Muu"
\`\`\`
`,
                    order: 2
                }
            ],
            assignments: [
                {
                    title: "Proyecto Final: Sistema de Gestión Escolar",
                    description: "Diseña un sistema de clases para una escuela. Debe tener clases para `Persona`, `Estudiante` (hereda de Persona), `Profesor` (hereda de Persona) y `Curso`. Implementa métodos para inscribir estudiantes y asignar notas.",
                    dueDateOffset: 14,
                    type: "project"
                }
            ],
            quiz: {
                title: "Examen Final POO",
                description: "Evaluación completa de conceptos de objetos.",
                questions: [
                    {
                        type: "multiple",
                        text: "¿Qué método se ejecuta automáticamente al crear un objeto?",
                        options: ["__start__", "__init__", "__create__", "construction"],
                        correctAnswer: 1
                    }
                ]
            }
        }
    ]
};
