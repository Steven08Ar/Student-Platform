export const oopFundamentalsCourseData = {
    title: "Fundamentos de Programación Orientada a Objetos (POO)",
    description: "Curso completo y exhaustivo sobre POO. Aprende los conceptos fundamentales, pilares, patrones de diseño y mejores prácticas. Incluye ejemplos en múltiples lenguajes de programación.",
    color: "bg-purple-100",
    modules: [
        {
            title: "Módulo 1: Introducción a la Programación Orientada a Objetos",
            order: 1,
            lessons: [
                {
                    title: "¿Qué es la Programación Orientada a Objetos?",
                    content: `
# 🎯 Objetivos de Aprendizaje
- Comprender qué es la POO y su historia
- Diferenciar entre paradigmas de programación
- Entender por qué POO es importante en el desarrollo moderno

## 💡 ¿Qué es POO?

> La **Programación Orientada a Objetos** (POO u OOP por sus siglas en inglés) es un **paradigma de programación** que organiza el código alrededor de "objetos" en lugar de funciones y lógica.

Un objeto es una entidad que combina:
- **Datos** (atributos/propiedades)
- **Comportamiento** (métodos/funciones)

### 🚗 Analogía del Mundo Real

> Piensa en un **automóvil**:
> - **Atributos**: color, marca, modelo, velocidad actual
> - **Métodos**: acelerar(), frenar(), encender(), apagar()

En POO, modelamos entidades del mundo real como objetos en código.

## 📜 Historia de POO

| Año | Hito |
|-----|------|
| 1960s | Simula (primer lenguaje OOP) |
| 1970s | Smalltalk populariza POO |
| 1980s | C++ lleva POO al mainstream |
| 1990s | Java y Python adoptan POO |
| 2000s+ | POO se convierte en estándar |

## Paradigmas de Programación

### 1. Programación Imperativa
Describe **cómo** hacer algo paso a paso.

\`\`\`python
# Imperativo
total = 0
for i in range(1, 6):
    total += i
print(total)  # 15
\`\`\`

### 2. Programación Funcional
Se enfoca en **funciones puras** y evita estado mutable.

\`\`\`javascript
// Funcional
const sum = [1,2,3,4,5].reduce((acc, n) => acc + n, 0);
console.log(sum); // 15
\`\`\`

### 3. Programación Orientada a Objetos
Organiza código en **objetos** que encapsulan datos y comportamiento.

\`\`\`java
// POO
class Calculator {
    public int sum(int[] numbers) {
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }
}

Calculator calc = new Calculator();
System.out.println(calc.sum(new int[]{1,2,3,4,5})); // 15
\`\`\`

## ¿Por qué usar POO?

### Ventajas
✅ **Modularidad**: Código organizado en componentes reutilizables  
✅ **Mantenibilidad**: Cambios localizados, menor impacto  
✅ **Escalabilidad**: Fácil agregar nuevas funcionalidades  
✅ **Reutilización**: Herencia y composición permiten reusar código  
✅ **Abstracción**: Oculta complejidad, expone interfaces simples  

### Desventajas
❌ Curva de aprendizaje inicial  
❌ Puede ser excesivo para programas pequeños  
❌ Overhead de rendimiento en algunos casos  

## Lenguajes que Soportan POO

### Puramente Orientados a Objetos
- **Java**: Todo es un objeto (excepto primitivos)
- **Smalltalk**: El lenguaje OOP más puro
- **Ruby**: "Todo es un objeto", incluso números
- **C#**: Diseñado para POO desde el inicio

### Multi-Paradigma (Soportan POO)
- **Python**: OOP + Funcional + Imperativo
- **JavaScript**: OOP basado en prototipos
- **C++**: OOP + Imperativo + Genérico
- **PHP**: OOP + Imperativo
- **Swift**: OOP + Funcional + Protocolo
- **Kotlin**: OOP + Funcional
- **TypeScript**: OOP + Funcional (superset de JS)
- **Scala**: OOP + Funcional
- **Go**: Tiene estructuras y métodos (no clases tradicionales)
- **Rust**: OOP mediante traits y structs

### Lenguajes sin OOP Clásico
- **C**: Estructuras, pero sin clases ni herencia
- **Haskell**: Puramente funcional
- **Erlang**: Orientado a procesos

## Conceptos Clave

Antes de profundizar, familiarízate con estos términos:

| Término | Definición |
|---------|-----------|
| **Clase** | Plantilla o molde para crear objetos |
| **Objeto** | Instancia concreta de una clase |
| **Atributo** | Variable que pertenece a un objeto |
| **Método** | Función que pertenece a un objeto |
| **Instancia** | Un objeto específico creado de una clase |

## Ejercicio de Reflexión

**Pregunta**: Identifica 3 objetos del mundo real y lista sus posibles atributos y métodos.

**Ejemplo**:
- **Objeto**: Cuenta Bancaria
  - Atributos: número de cuenta, saldo, titular
  - Métodos: depositar(), retirar(), consultarSaldo()
`,
                    order: 1
                },
                {
                    title: "Clases y Objetos: Los Fundamentos",
                    content: `
# Objetivos
- Definir qué es una clase y un objeto
- Crear clases en diferentes lenguajes
- Instanciar objetos y acceder a sus miembros

## Clase vs Objeto

### Clase
Es el **plano** o **molde**. Define la estructura y comportamiento.

**Analogía**: El plano arquitectónico de una casa.

### Objeto
Es la **instancia concreta** creada a partir de una clase.

**Analogía**: La casa construida siguiendo el plano.

## Sintaxis en Diferentes Lenguajes

### Python

\`\`\`python
class Perro:
    # Constructor
    def __init__(self, nombre, raza):
        self.nombre = nombre  # Atributo de instancia
        self.raza = raza
    
    # Método
    def ladrar(self):
        return f"{self.nombre} dice: ¡Guau!"

# Crear objeto (instanciar)
mi_perro = Perro("Firulais", "Labrador")
print(mi_perro.ladrar())  # Firulais dice: ¡Guau!
print(mi_perro.nombre)     # Firulais
\`\`\`

### Java

\`\`\`java
public class Perro {
    // Atributos
    private String nombre;
    private String raza;
    
    // Constructor
    public Perro(String nombre, String raza) {
        this.nombre = nombre;
        this.raza = raza;
    }
    
    // Método
    public String ladrar() {
        return this.nombre + " dice: ¡Guau!";
    }
    
    // Getters
    public String getNombre() {
        return nombre;
    }
}

// Uso
Perro miPerro = new Perro("Firulais", "Labrador");
System.out.println(miPerro.ladrar());
\`\`\`

### JavaScript (ES6+)

\`\`\`javascript
class Perro {
    // Constructor
    constructor(nombre, raza) {
        this.nombre = nombre;
        this.raza = raza;
    }
    
    // Método
    ladrar() {
        return \`\${this.nombre} dice: ¡Guau!\`;
    }
}

// Crear objeto
const miPerro = new Perro("Firulais", "Labrador");
console.log(miPerro.ladrar());  // Firulais dice: ¡Guau!
\`\`\`

### C++

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

class Perro {
private:
    string nombre;
    string raza;
    
public:
    // Constructor
    Perro(string n, string r) : nombre(n), raza(r) {}
    
    // Método
    string ladrar() {
        return nombre + " dice: ¡Guau!";
    }
    
    string getNombre() {
        return nombre;
    }
};

int main() {
    Perro miPerro("Firulais", "Labrador");
    cout << miPerro.ladrar() << endl;
    return 0;
}
\`\`\`

### C#

\`\`\`csharp
public class Perro
{
    // Propiedades
    public string Nombre { get; set; }
    public string Raza { get; set; }
    
    // Constructor
    public Perro(string nombre, string raza)
    {
        Nombre = nombre;
        Raza = raza;
    }
    
    // Método
    public string Ladrar()
    {
        return $"{Nombre} dice: ¡Guau!";
    }
}

// Uso
Perro miPerro = new Perro("Firulais", "Labrador");
Console.WriteLine(miPerro.Ladrar());
\`\`\`

### Ruby

\`\`\`ruby
class Perro
  # Constructor
  def initialize(nombre, raza)
    @nombre = nombre
    @raza = raza
  end
  
  # Método
  def ladrar
    "#{@nombre} dice: ¡Guau!"
  end
  
  # Getter
  attr_reader :nombre
end

# Crear objeto
mi_perro = Perro.new("Firulais", "Labrador")
puts mi_perro.ladrar
\`\`\`

### PHP

\`\`\`php
<?php
class Perro {
    private $nombre;
    private $raza;
    
    // Constructor
    public function __construct($nombre, $raza) {
        $this->nombre = $nombre;
        $this->raza = $raza;
    }
    
    // Método
    public function ladrar() {
        return "{$this->nombre} dice: ¡Guau!";
    }
}

$miPerro = new Perro("Firulais", "Labrador");
echo $miPerro->ladrar();
?>
\`\`\`

### Swift

\`\`\`swift
class Perro {
    var nombre: String
    var raza: String
    
    // Constructor
    init(nombre: String, raza: String) {
        self.nombre = nombre
        self.raza = raza
    }
    
    // Método
    func ladrar() -> String {
        return "\\(nombre) dice: ¡Guau!"
    }
}

let miPerro = Perro(nombre: "Firulais", raza: "Labrador")
print(miPerro.ladrar())
\`\`\`

### Kotlin

\`\`\`kotlin
class Perro(val nombre: String, val raza: String) {
    fun ladrar(): String {
        return "$nombre dice: ¡Guau!"
    }
}

val miPerro = Perro("Firulais", "Labrador")
println(miPerro.ladrar())
\`\`\`

### TypeScript

\`\`\`typescript
class Perro {
    nombre: string;
    raza: string;
    
    constructor(nombre: string, raza: string) {
        this.nombre = nombre;
        this.raza = raza;
    }
    
    ladrar(): string {
        return \`\${this.nombre} dice: ¡Guau!\`;
    }
}

const miPerro = new Perro("Firulais", "Labrador");
console.log(miPerro.ladrar());
\`\`\`

## Componentes de una Clase

### 1. Atributos (Propiedades/Campos)
Variables que almacenan el **estado** del objeto.

### 2. Constructor
Método especial que se ejecuta al crear un objeto. Inicializa atributos.

### 3. Métodos
Funciones que definen el **comportamiento** del objeto.

### 4. Modificadores de Acceso
Controlan la visibilidad:
- **public**: Accesible desde cualquier lugar
- **private**: Solo accesible dentro de la clase
- **protected**: Accesible en la clase y subclases

## Ejemplo Completo: Sistema de Biblioteca

\`\`\`python
class Libro:
    def __init__(self, titulo, autor, isbn, disponible=True):
        self.titulo = titulo
        self.autor = autor
        self.isbn = isbn
        self.disponible = disponible
    
    def prestar(self):
        if self.disponible:
            self.disponible = False
            return f"'{self.titulo}' ha sido prestado"
        return f"'{self.titulo}' no está disponible"
    
    def devolver(self):
        self.disponible = True
        return f"'{self.titulo}' ha sido devuelto"
    
    def info(self):
        estado = "Disponible" if self.disponible else "Prestado"
        return f"{self.titulo} por {self.autor} - {estado}"

# Uso
libro1 = Libro("Cien Años de Soledad", "Gabriel García Márquez", "978-0307474728")
print(libro1.info())       # Disponible
print(libro1.prestar())    # Prestado
print(libro1.info())       # Prestado
print(libro1.devolver())   # Devuelto
\`\`\`

## Ejercicio Práctico

Crea una clase \`CuentaBancaria\` con:
- Atributos: \`titular\`, \`saldo\`, \`numero_cuenta\`
- Métodos: \`depositar(monto)\`, \`retirar(monto)\`, \`consultar_saldo()\`
- El retiro no debe permitir saldo negativo

**Solución en Python**:

\`\`\`python
class CuentaBancaria:
    def __init__(self, titular, numero_cuenta, saldo_inicial=0):
        self.titular = titular
        self.numero_cuenta = numero_cuenta
        self.saldo = saldo_inicial
    
    def depositar(self, monto):
        if monto > 0:
            self.saldo += monto
            return f"Depósito exitoso. Nuevo saldo: ${self.saldo}"
        return "Monto inválido"
    
    def retirar(self, monto):
        if monto > self.saldo:
            return "Fondos insuficientes"
        if monto > 0:
            self.saldo -= monto
            return f"Retiro exitoso. Nuevo saldo: ${self.saldo}"
        return "Monto inválido"
    
    def consultar_saldo(self):
        return f"Saldo actual: ${self.saldo}"

# Prueba
cuenta = CuentaBancaria("Juan Pérez", "001-12345", 1000)
print(cuenta.depositar(500))      # $1500
print(cuenta.retirar(200))        # $1300
print(cuenta.retirar(2000))       # Fondos insuficientes
print(cuenta.consultar_saldo())   # $1300
\`\`\`
`,
                    order: 2
                },
                {
                    title: "Atributos y Métodos: Estáticos vs de Instancia",
                    content: `
# Objetivos
- Diferenciar entre miembros de instancia y de clase
- Usar atributos y métodos estáticos correctamente
- Comprender cuándo usar cada tipo

## Miembros de Instancia

Pertenecen a **cada objeto individual**. Cada instancia tiene su propia copia.

### Python

\`\`\`python
class Contador:
    def __init__(self):
        self.cuenta = 0  # Atributo de instancia
    
    def incrementar(self):  # Método de instancia
        self.cuenta += 1

c1 = Contador()
c2 = Contador()
c1.incrementar()
print(c1.cuenta)  # 1
print(c2.cuenta)  # 0 (independiente)
\`\`\`

## Miembros de Clase (Estáticos)

Pertenecen a la **clase misma**, compartidos por todas las instancias.

### Python

\`\`\`python
class Contador:
    total_instancias = 0  # Atributo de clase
    
    def __init__(self):
        self.cuenta = 0
        Contador.total_instancias += 1
    
    @classmethod
    def obtener_total(cls):  # Método de clase
        return cls.total_instancias
    
    @staticmethod
    def es_par(numero):  # Método estático
        return numero % 2 == 0

c1 = Contador()
c2 = Contador()
print(Contador.obtener_total())  # 2
print(Contador.es_par(4))        # True
\`\`\`

### Java

\`\`\`java
public class Contador {
    private int cuenta = 0;              // Instancia
    private static int totalInstancias = 0;  // Clase
    
    public Contador() {
        totalInstancias++;
    }
    
    public void incrementar() {  // Método de instancia
        cuenta++;
    }
    
    public static int obtenerTotal() {  // Método estático
        return totalInstancias;
    }
    
    public static boolean esPar(int numero) {
        return numero % 2 == 0;
    }
}

// Uso
Contador c1 = new Contador();
Contador c2 = new Contador();
System.out.println(Contador.obtenerTotal());  // 2
System.out.println(Contador.esPar(4));        // true
\`\`\`

### JavaScript

\`\`\`javascript
class Contador {
    static totalInstancias = 0;  // Atributo estático
    
    constructor() {
        this.cuenta = 0;  // Atributo de instancia
        Contador.totalInstancias++;
    }
    
    incrementar() {  // Método de instancia
        this.cuenta++;
    }
    
    static obtenerTotal() {  // Método estático
        return Contador.totalInstancias;
    }
    
    static esPar(numero) {
        return numero % 2 === 0;
    }
}

const c1 = new Contador();
const c2 = new Contador();
console.log(Contador.obtenerTotal());  // 2
console.log(Contador.esPar(4));        // true
\`\`\`

### C++

\`\`\`cpp
class Contador {
private:
    int cuenta;
    static int totalInstancias;  // Declaración
    
public:
    Contador() : cuenta(0) {
        totalInstancias++;
    }
    
    void incrementar() {
        cuenta++;
    }
    
    static int obtenerTotal() {
        return totalInstancias;
    }
};

// Definición fuera de la clase
int Contador::totalInstancias = 0;
\`\`\`

### C#

\`\`\`csharp
public class Contador
{
    private int cuenta = 0;
    private static int totalInstancias = 0;
    
    public Contador()
    {
        totalInstancias++;
    }
    
    public void Incrementar()
    {
        cuenta++;
    }
    
    public static int ObtenerTotal()
    {
        return totalInstancias;
    }
}
\`\`\`

## Comparación

| Característica | Instancia | Clase/Estático |
|----------------|-----------|----------------|
| **Pertenece a** | Objeto individual | Clase completa |
| **Acceso** | \`objeto.metodo()\` | \`Clase.metodo()\` |
| **Memoria** | Una copia por objeto | Una copia compartida |
| **Uso de \`this/self\`** | Sí | No |
| **Cuándo usar** | Estado específico del objeto | Utilidades, contadores, constantes |

## Casos de Uso Comunes

### Atributos Estáticos
- Constantes de clase
- Contadores globales
- Configuración compartida

\`\`\`python
class Configuracion:
    VERSION = "1.0.0"  # Constante
    MAX_CONEXIONES = 100
    instancias_activas = 0
\`\`\`

### Métodos Estáticos
- Funciones de utilidad
- Factory methods
- Validadores

\`\`\`python
class Matematicas:
    @staticmethod
    def factorial(n):
        if n <= 1:
            return 1
        return n * Matematicas.factorial(n - 1)

print(Matematicas.factorial(5))  # 120
\`\`\`

## Ejemplo Completo: Sistema de Usuarios

\`\`\`python
class Usuario:
    # Atributos de clase
    usuarios_registrados = 0
    usuarios_activos = []
    
    def __init__(self, nombre, email):
        # Atributos de instancia
        self.nombre = nombre
        self.email = email
        self.activo = False
        
        # Incrementar contador
        Usuario.usuarios_registrados += 1
    
    # Método de instancia
    def activar(self):
        if not self.activo:
            self.activo = True
            Usuario.usuarios_activos.append(self.email)
    
    def desactivar(self):
        if self.activo:
            self.activo = False
            Usuario.usuarios_activos.remove(self.email)
    
    # Método de clase
    @classmethod
    def obtener_estadisticas(cls):
        return {
            'total': cls.usuarios_registrados,
            'activos': len(cls.usuarios_activos)
        }
    
    # Método estático
    @staticmethod
    def validar_email(email):
        return '@' in email and '.' in email

# Uso
u1 = Usuario("Ana", "ana@example.com")
u2 = Usuario("Luis", "luis@example.com")

u1.activar()
print(Usuario.obtener_estadisticas())  # {'total': 2, 'activos': 1}
print(Usuario.validar_email("test@test.com"))  # True
\`\`\`

## Ejercicio

Crea una clase \`Producto\` con:
- Atributo de clase: \`iva = 0.16\` (16%)
- Atributos de instancia: \`nombre\`, \`precio_base\`
- Método de instancia: \`precio_final()\` que calcule precio + IVA
- Método estático: \`calcular_descuento(precio, porcentaje)\`
- Método de clase: \`cambiar_iva(nuevo_iva)\`
`,
                    order: 3
                }
            ],
            assignments: [
                {
                    title: "Modelado de Sistema de Vehículos",
                    description: "Crea un sistema de clases para modelar diferentes tipos de vehículos. Debe incluir al menos 3 clases con atributos y métodos apropiados. Implementa contadores estáticos para rastrear el total de vehículos creados.",
                    dueDateOffset: 7,
                    type: "task"
                }
            ],
            quiz: null
        },
        {
            title: "Módulo 2: Los Cuatro Pilares de POO",
            order: 2,
            lessons: [
                {
                    title: "Pilar 1: Encapsulación",
                    content: `
# Objetivos
- Comprender el concepto de encapsulación
- Implementar modificadores de acceso
- Crear getters y setters
- Aplicar el principio de ocultamiento de información

## ¿Qué es la Encapsulación?

La **encapsulación** es el principio de **ocultar** los detalles internos de un objeto y exponer solo lo necesario a través de una interfaz pública.

### Analogía
Un **cajero automático**:
- **Oculta**: Mecanismos internos, conexión al banco, algoritmos de seguridad
- **Expone**: Botones simples (retirar, depositar, consultar)

## Modificadores de Acceso

### Niveles de Visibilidad

| Modificador | Descripción | Acceso desde |
|-------------|-------------|--------------|
| **public** | Totalmente accesible | Cualquier lugar |
| **private** | Solo dentro de la clase | Misma clase |
| **protected** | Clase y subclases | Clase + herencia |
| **package/internal** | Mismo paquete/módulo | Mismo namespace |

## Implementación por Lenguaje

### Python

Python usa **convenciones** (no hay private real):

\`\`\`python
class CuentaBancaria:
    def __init__(self, titular, saldo_inicial):
        self.titular = titular          # Público
        self._saldo = saldo_inicial     # Protegido (convención)
        self.__pin = "1234"             # Privado (name mangling)
    
    # Getter
    def obtener_saldo(self):
        return self._saldo
    
    # Setter con validación
    def establecer_saldo(self, nuevo_saldo):
        if nuevo_saldo >= 0:
            self._saldo = nuevo_saldo
        else:
            raise ValueError("Saldo no puede ser negativo")
    
    # Property (forma pythónica)
    @property
    def saldo(self):
        return self._saldo
    
    @saldo.setter
    def saldo(self, valor):
        if valor >= 0:
            self._saldo = valor
        else:
            raise ValueError("Saldo inválido")

# Uso
cuenta = CuentaBancaria("Ana", 1000)
print(cuenta.saldo)  # Usa el getter
cuenta.saldo = 1500  # Usa el setter
# cuenta.__pin  # Error: AttributeError
\`\`\`

### Java

\`\`\`java
public class CuentaBancaria {
    private String titular;    // Privado
    private double saldo;      // Privado
    private String pin;        // Privado
    
    public CuentaBancaria(String titular, double saldoInicial) {
        this.titular = titular;
        this.saldo = saldoInicial;
        this.pin = "1234";
    }
    
    // Getter
    public double getSaldo() {
        return saldo;
    }
    
    // Setter con validación
    public void setSaldo(double nuevoSaldo) {
        if (nuevoSaldo >= 0) {
            this.saldo = nuevoSaldo;
        } else {
            throw new IllegalArgumentException("Saldo inválido");
        }
    }
    
    // Método público que usa atributos privados
    public boolean verificarPin(String pinIngresado) {
        return this.pin.equals(pinIngresado);
    }
}
\`\`\`

### JavaScript (ES6+)

\`\`\`javascript
class CuentaBancaria {
    #saldo;  // Privado (ES2022+)
    #pin;    // Privado
    
    constructor(titular, saldoInicial) {
        this.titular = titular;  // Público
        this.#saldo = saldoInicial;
        this.#pin = "1234";
    }
    
    // Getter
    get saldo() {
        return this.#saldo;
    }
    
    // Setter
    set saldo(valor) {
        if (valor >= 0) {
            this.#saldo = valor;
        } else {
            throw new Error("Saldo inválido");
        }
    }
    
    verificarPin(pinIngresado) {
        return this.#pin === pinIngresado;
    }
}

const cuenta = new CuentaBancaria("Ana", 1000);
console.log(cuenta.saldo);  // 1000
cuenta.saldo = 1500;
// console.log(cuenta.#saldo);  // Error: Private field
\`\`\`

### C++

\`\`\`cpp
class CuentaBancaria {
private:
    string titular;
    double saldo;
    string pin;
    
public:
    CuentaBancaria(string t, double s) : titular(t), saldo(s), pin("1234") {}
    
    // Getter
    double getSaldo() const {
        return saldo;
    }
    
    // Setter
    void setSaldo(double nuevoSaldo) {
        if (nuevoSaldo >= 0) {
            saldo = nuevoSaldo;
        } else {
            throw invalid_argument("Saldo inválido");
        }
    }
    
    bool verificarPin(string pinIngresado) const {
        return pin == pinIngresado;
    }
};
\`\`\`

### C#

\`\`\`csharp
public class CuentaBancaria
{
    private string titular;
    private double saldo;
    private string pin;
    
    public CuentaBancaria(string titular, double saldoInicial)
    {
        this.titular = titular;
        this.saldo = saldoInicial;
        this.pin = "1234";
    }
    
    // Property (getter/setter automático)
    public double Saldo
    {
        get { return saldo; }
        set
        {
            if (value >= 0)
                saldo = value;
            else
                throw new ArgumentException("Saldo inválido");
        }
    }
    
    public bool VerificarPin(string pinIngresado)
    {
        return pin == pinIngresado;
    }
}
\`\`\`

## Beneficios de la Encapsulación

### 1. Control de Acceso
\`\`\`python
class Persona:
    def __init__(self, edad):
        self._edad = edad
    
    @property
    def edad(self):
        return self._edad
    
    @edad.setter
    def edad(self, valor):
        if 0 <= valor <= 150:  # Validación
            self._edad = valor
        else:
            raise ValueError("Edad inválida")

p = Persona(25)
p.edad = 30   # OK
# p.edad = -5   # Error: ValueError
\`\`\`

### 2. Flexibilidad de Implementación
Puedes cambiar la implementación interna sin afectar el código externo.

\`\`\`python
class Temperatura:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def fahrenheit(self):
        # Calculado dinámicamente
        return (self._celsius * 9/5) + 32
    
    @fahrenheit.setter
    def fahrenheit(self, valor):
        self._celsius = (valor - 32) * 5/9

t = Temperatura(0)
print(t.fahrenheit)  # 32.0
t.fahrenheit = 212
print(t._celsius)    # 100.0
\`\`\`

### 3. Mantenimiento
Cambios internos no rompen código existente.

## Patrones Comunes

### Inmutabilidad
\`\`\`python
class Punto:
    def __init__(self, x, y):
        self._x = x
        self._y = y
    
    @property
    def x(self):
        return self._x
    
    @property
    def y(self):
        return self._y
    
    # Sin setters = inmutable

p = Punto(10, 20)
print(p.x)  # 10
# p.x = 30  # Error: can't set attribute
\`\`\`

### Lazy Loading
\`\`\`python
class Reporte:
    def __init__(self, archivo):
        self._archivo = archivo
        self._datos = None  # No cargado aún
    
    @property
    def datos(self):
        if self._datos is None:
            # Cargar solo cuando se necesita
            self._datos = self._cargar_datos()
        return self._datos
    
    def _cargar_datos(self):
        # Operación costosa
        with open(self._archivo) as f:
            return f.read()
\`\`\`

## Ejemplo Completo: Sistema de Empleados

\`\`\`python
class Empleado:
    def __init__(self, nombre, salario_base):
        self._nombre = nombre
        self._salario_base = salario_base
        self.__numero_seguro_social = None  # Muy privado
    
    @property
    def nombre(self):
        return self._nombre
    
    @property
    def salario_base(self):
        return self._salario_base
    
    @salario_base.setter
    def salario_base(self, valor):
        if valor > 0:
            self._salario_base = valor
        else:
            raise ValueError("Salario debe ser positivo")
    
    @property
    def salario_anual(self):
        # Calculado, no almacenado
        return self._salario_base * 12
    
    def establecer_nss(self, nss, autorizacion):
        if autorizacion == "ADMIN_KEY":
            self.__numero_seguro_social = nss
        else:
            raise PermissionError("No autorizado")
    
    def __str__(self):
        return f"{self._nombre}: ${self._salario_base}/mes"

# Uso
emp = Empleado("Carlos", 5000)
print(emp.salario_anual)  # 60000
emp.salario_base = 5500   # Válido
# emp.salario_base = -100   # Error
# emp.__numero_seguro_social = "123"  # No accesible
emp.establecer_nss("123-45-6789", "ADMIN_KEY")  # OK
\`\`\`

## Ejercicio

Crea una clase \`Rectangulo\` con:
- Atributos privados: \`_ancho\`, \`_alto\`
- Properties para acceder/modificar (con validación > 0)
- Property calculado: \`area\`
- Property calculado: \`perimetro\`
- Método: \`es_cuadrado()\`
`,
                    order: 1
                },
                {
                    title: "Pilar 2: Abstracción",
                    content: `
# Objetivos
- Entender el concepto de abstracción
- Crear clases abstractas e interfaces
- Aplicar abstracción en diseño de sistemas

## ¿Qué es la Abstracción?

La **abstracción** es el proceso de **ocultar la complejidad** y mostrar solo la funcionalidad esencial.

### Analogía
Un **control remoto de TV**:
- **Abstrae**: Circuitos, señales infrarrojas, protocolos
- **Expone**: Botones simples (encender, cambiar canal, volumen)

No necesitas saber cómo funciona internamente para usarlo.

## Niveles de Abstracción

### 1. Abstracción de Datos
Ocultar cómo se almacenan los datos.

\`\`\`python
class Pila:
    def __init__(self):
        self._items = []  # Implementación oculta
    
    def push(self, item):
        self._items.append(item)
    
    def pop(self):
        return self._items.pop()
    
    def esta_vacia(self):
        return len(self._items) == 0

# Usuario no necesita saber que usa una lista
pila = Pila()
pila.push(1)
pila.push(2)
print(pila.pop())  # 2
\`\`\`

### 2. Abstracción de Control
Ocultar la lógica de control.

\`\`\`python
class Ordenador:
    def ordenar(self, lista):
        # Usuario no necesita saber el algoritmo
        return sorted(lista)  # Podría ser quicksort, mergesort, etc.

ord = Ordenador()
print(ord.ordenar([3, 1, 2]))  # [1, 2, 3]
\`\`\`

## Clases Abstractas

Una **clase abstracta** es una clase que:
- No puede ser instanciada directamente
- Define métodos abstractos (sin implementación)
- Sirve como plantilla para subclases

### Python (ABC - Abstract Base Class)

\`\`\`python
from abc import ABC, abstractmethod

class Forma(ABC):  # Clase abstracta
    @abstractmethod
    def area(self):
        pass  # Sin implementación
    
    @abstractmethod
    def perimetro(self):
        pass
    
    # Método concreto (opcional)
    def descripcion(self):
        return f"Soy una forma con área {self.area()}"

class Rectangulo(Forma):
    def __init__(self, ancho, alto):
        self.ancho = ancho
        self.alto = alto
    
    def area(self):  # Implementación obligatoria
        return self.ancho * self.alto
    
    def perimetro(self):
        return 2 * (self.ancho + self.alto)

class Circulo(Forma):
    def __init__(self, radio):
        self.radio = radio
    
    def area(self):
        return 3.14159 * self.radio ** 2
    
    def perimetro(self):
        return 2 * 3.14159 * self.radio

# forma = Forma()  # Error: Can't instantiate abstract class
rect = Rectangulo(5, 3)
print(rect.area())  # 15
print(rect.descripcion())  # Soy una forma con área 15
\`\`\`

### Java

\`\`\`java
abstract class Forma {
    // Método abstracto
    public abstract double area();
    public abstract double perimetro();
    
    // Método concreto
    public String descripcion() {
        return "Soy una forma con área " + area();
    }
}

class Rectangulo extends Forma {
    private double ancho, alto;
    
    public Rectangulo(double ancho, double alto) {
        this.ancho = ancho;
        this.alto = alto;
    }
    
    @Override
    public double area() {
        return ancho * alto;
    }
    
    @Override
    public double perimetro() {
        return 2 * (ancho + alto);
    }
}

// Forma f = new Forma();  // Error: Cannot instantiate
Rectangulo r = new Rectangulo(5, 3);
System.out.println(r.area());  // 15.0
\`\`\`

### C++

\`\`\`cpp
#include <iostream>
using namespace std;

class Forma {
public:
    // Función virtual pura = método abstracto
    virtual double area() = 0;
    virtual double perimetro() = 0;
    
    // Método concreto
    string descripcion() {
        return "Soy una forma con área " + to_string(area());
    }
    
    virtual ~Forma() {}  // Destructor virtual
};

class Rectangulo : public Forma {
private:
    double ancho, alto;
    
public:
    Rectangulo(double a, double h) : ancho(a), alto(h) {}
    
    double area() override {
        return ancho * alto;
    }
    
    double perimetro() override {
        return 2 * (ancho + alto);
    }
};

int main() {
    // Forma* f = new Forma();  // Error
    Forma* r = new Rectangulo(5, 3);
    cout << r->area() << endl;  // 15
    delete r;
    return 0;
}
\`\`\`

### C#

\`\`\`csharp
abstract class Forma
{
    public abstract double Area();
    public abstract double Perimetro();
    
    public string Descripcion()
    {
        return $"Soy una forma con área {Area()}";
    }
}

class Rectangulo : Forma
{
    private double ancho, alto;
    
    public Rectangulo(double ancho, double alto)
    {
        this.ancho = ancho;
        this.alto = alto;
    }
    
    public override double Area()
    {
        return ancho * alto;
    }
    
    public override double Perimetro()
    {
        return 2 * (ancho + alto);
    }
}
\`\`\`

## Interfaces

Una **interfaz** es un contrato que define qué métodos debe implementar una clase, sin especificar cómo.

### Diferencias: Clase Abstracta vs Interfaz

| Característica | Clase Abstracta | Interfaz |
|----------------|-----------------|----------|
| **Métodos** | Abstractos y concretos | Solo abstractos (Java < 8) |
| **Atributos** | Sí | Solo constantes |
| **Herencia** | Una sola | Múltiples |
| **Cuándo usar** | Relación "es un" | Capacidad/Comportamiento |

### Java

\`\`\`java
interface Volador {
    void volar();
    void aterrizar();
}

interface Nadador {
    void nadar();
}

class Pato implements Volador, Nadador {
    @Override
    public void volar() {
        System.out.println("El pato vuela");
    }
    
    @Override
    public void aterrizar() {
        System.out.println("El pato aterriza");
    }
    
    @Override
    public void nadar() {
        System.out.println("El pato nada");
    }
}

Pato pato = new Pato();
pato.volar();
pato.nadar();
\`\`\`

### Python (Protocol - Python 3.8+)

\`\`\`python
from typing import Protocol

class Volador(Protocol):
    def volar(self) -> None: ...
    def aterrizar(self) -> None: ...

class Nadador(Protocol):
    def nadar(self) -> None: ...

class Pato:
    def volar(self):
        print("El pato vuela")
    
    def aterrizar(self):
        print("El pato aterriza")
    
    def nadar(self):
        print("El pato nada")

# Duck typing: si camina como pato y grazna como pato...
def hacer_volar(volador: Volador):
    volador.volar()
    volador.aterrizar()

pato = Pato()
hacer_volar(pato)  # Funciona por duck typing
\`\`\`

### C#

\`\`\`csharp
interface IVolador
{
    void Volar();
    void Aterrizar();
}

interface INadador
{
    void Nadar();
}

class Pato : IVolador, INadador
{
    public void Volar()
    {
        Console.WriteLine("El pato vuela");
    }
    
    public void Aterrizar()
    {
        Console.WriteLine("El pato aterriza");
    }
    
    public void Nadar()
    {
        Console.WriteLine("El pato nada");
    }
}
\`\`\`

### TypeScript

\`\`\`typescript
interface Volador {
    volar(): void;
    aterrizar(): void;
}

interface Nadador {
    nadar(): void;
}

class Pato implements Volador, Nadador {
    volar(): void {
        console.log("El pato vuela");
    }
    
    aterrizar(): void {
        console.log("El pato aterriza");
    }
    
    nadar(): void {
        console.log("El pato nada");
    }
}

const pato = new Pato();
pato.volar();
pato.nadar();
\`\`\`

## Ejemplo Completo: Sistema de Pagos

\`\`\`python
from abc import ABC, abstractmethod

# Interfaz (clase abstracta)
class MetodoPago(ABC):
    @abstractmethod
    def procesar_pago(self, monto):
        pass
    
    @abstractmethod
    def validar(self):
        pass

class TarjetaCredito(MetodoPago):
    def __init__(self, numero, cvv):
        self.numero = numero
        self.cvv = cvv
    
    def validar(self):
        return len(self.numero) == 16 and len(self.cvv) == 3
    
    def procesar_pago(self, monto):
        if self.validar():
            return f"Pago de \${monto} procesado con tarjeta ****\{self.numero[-4:]}"
        return "Tarjeta inválida"

class PayPal(MetodoPago):
    def __init__(self, email):
        self.email = email
    
    def validar(self):
        return '@' in self.email
    
    def procesar_pago(self, monto):
        if self.validar():
            return f"Pago de \${monto} procesado vía PayPal (\{self.email})"
        return "Email inválido"

class Criptomoneda(MetodoPago):
    def __init__(self, wallet_address):
        self.wallet = wallet_address
    
    def validar(self):
        return len(self.wallet) == 42  # Simplificado
    
    def procesar_pago(self, monto):
        if self.validar():
            return f"Pago de \${monto} procesado en cripto a \{self.wallet[:10]}..."
        return "Wallet inválida"

# Procesador genérico (usa abstracción)
class ProcesadorPagos:
    def realizar_pago(self, metodo_pago: MetodoPago, monto):
        # No necesita saber el tipo específico
        return metodo_pago.procesar_pago(monto)

# Uso
procesador = ProcesadorPagos()

tarjeta = TarjetaCredito("1234567890123456", "123")
paypal = PayPal("usuario@example.com")
crypto = Criptomoneda("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")

print(procesador.realizar_pago(tarjeta, 100))
print(procesador.realizar_pago(paypal, 50))
print(procesador.realizar_pago(crypto, 200))
\`\`\`

## Beneficios de la Abstracción

1. **Simplicidad**: Interfaz simple para funcionalidad compleja
2. **Flexibilidad**: Fácil agregar nuevas implementaciones
3. **Mantenibilidad**: Cambios internos no afectan usuarios
4. **Reutilización**: Código genérico funciona con múltiples tipos

## Ejercicio

Crea un sistema de notificaciones con:
- Interfaz/Clase abstracta \`Notificacion\` con método \`enviar(mensaje)\`
- Implementaciones: \`Email\`, \`SMS\`, \`PushNotification\`
- Clase \`GestorNotificaciones\` que pueda enviar a cualquier tipo
`,
                    order: 2
                }
            ],
            assignments: [],
            quiz: {
                title: "Quiz: Pilares de POO",
                description: "Evalúa tu comprensión de Encapsulación y Abstracción",
                questions: [
                    {
                        type: "multiple",
                        text: "¿Cuál es el propósito principal de la encapsulación?",
                        options: [
                            "Hacer el código más rápido",
                            "Ocultar detalles de implementación",
                            "Permitir herencia múltiple",
                            "Crear objetos más grandes"
                        ],
                        correctAnswer: 1
                    },
                    {
                        type: "multiple",
                        text: "¿Qué diferencia hay entre una clase abstracta y una interfaz en Java?",
                        options: [
                            "No hay diferencia",
                            "Las interfaces no pueden tener métodos",
                            "Una clase puede implementar múltiples interfaces pero heredar solo una clase",
                            "Las clases abstractas son más rápidas"
                        ],
                        correctAnswer: 2
                    }
                ]
            }
        },
        {
            title: "Módulo 3: Herencia y Polimorfismo",
            order: 3,
            lessons: [
                {
                    title: "Pilar 3: Herencia",
                    content: `
# Objetivos
- Comprender el concepto de herencia
- Implementar jerarquías de clases
- Usar super() para acceder a la clase padre

## ¿Qué es la Herencia?

La **herencia** permite crear nuevas clases basadas en clases existentes.

### Python
\\\`\\\`\\\`python
class Animal:
    def __init__(self, nombre):
        self.nombre = nombre
    
    def hacer_sonido(self):
        return "Sonido genérico"

class Perro(Animal):
    def __init__(self, nombre, raza):
        super().__init__(nombre)
        self.raza = raza
    
    def hacer_sonido(self):
        return "¡Guau!"

perro = Perro("Max", "Golden")
print(perro.hacer_sonido())  # ¡Guau!
\\\`\\\`\\\`
`,
                    order: 1
                },
                {
                    title: "Pilar 4: Polimorfismo",
                    content: `
# Objetivos
- Comprender el polimorfismo
- Implementar métodos polimórficos

## Polimorfismo

Permite tratar objetos de diferentes clases de manera uniforme.

\\\`\\\`\\\`python
def imprimir_info(forma):
    print(f"Área: {forma.area()}")

rect = Rectangulo(5, 3)
circ = Circulo(4)

imprimir_info(rect)  # Funciona
imprimir_info(circ)  # También funciona
\\\`\\\`\\\`
`,
                    order: 2
                }
            ],
            assignments: [],
            quiz: null
        },
        {
            title: "Módulo 4: Patrones de Diseño",
            order: 4,
            lessons: [
                {
                    title: "Patrones Creacionales",
                    content: `
# Patrones de Diseño

Soluciones reutilizables a problemas comunes.

## Singleton

\\\`\\\`\\\`python
class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
\\\`\\\`\\\`
`,
                    order: 1
                }
            ],
            assignments: [],
            quiz: null
        },
        {
            title: "Módulo 5: Principios SOLID",
            order: 5,
            lessons: [
                {
                    title: "Los 5 Principios SOLID",
                    content: `
# SOLID

## S - Single Responsibility
Una clase, una responsabilidad.

## O - Open/Closed
Abierto para extensión, cerrado para modificación.

## L - Liskov Substitution
Las subclases deben ser sustituibles.

## I - Interface Segregation
Interfaces específicas, no generales.

## D - Dependency Inversion
Depender de abstracciones.
`,
                    order: 1
                }
            ],
            assignments: [
                {
                    title: "Proyecto Final POO",
                    description: "Crea un sistema completo aplicando todos los principios aprendidos.",
                    dueDateOffset: 21,
                    type: "project"
                }
            ],
            quiz: {
                title: "Examen Final POO",
                description: "Evaluación completa de POO",
                questions: [
                    {
                        type: "multiple",
                        text: "¿Cuál NO es un pilar de POO?",
                        options: ["Encapsulación", "Compilación", "Herencia", "Polimorfismo"],
                        correctAnswer: 1
                    }
                ]
            }
        }
    ]
};
