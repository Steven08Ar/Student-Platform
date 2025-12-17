# Guía de Configuración de Firebase

Sigue estos pasos detallados para configurar el backend de tu aplicación Serverless.

## 1. Crear Proyecto
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en **"Agregar proyecto"**.
3. Ponle un nombre (ej: `clases-platform`).
4. Desactiva Google Analytics (no es necesario para este tutorial) y crea el proyecto.

## 2. Configurar Autenticación
1. En el menú lateral izquierdo, selecciona **Compilación** -> **Authentication**.
2. Haz clic en **Comenzar**.
3. En la pestaña **Sign-in method** (Método de inicio de sesión), selecciona **Correo electrónico/contraseña**.
4. **Habilita** la primera opción ("Correo electrónico/contraseña").
5. Haz clic en **Guardar**.

## 3. Configurar Base de Datos (Firestore)
1. En el menú lateral, selecciona **Compilación** -> **Firestore Database**.
2. Haz clic en **Crear base de datos**.
3. Selecciona una ubicación cercana a ti (ej: `us-central1` o `nam5`).
4. En reglas de seguridad, selecciona **Comenzar en modo de producción**.
5. Haz clic en **Crear**.

## 4. Aplicar Reglas de Seguridad
Para que los roles (profesor/estudiante) funcionen, necesitamos aplicar las reglas que ya creé en tu código.

1. En la consola de Firestore, ve a la pestaña **Reglas**.
2. Abre el archivo `firestore.rules` que está en tu proyecto local (en la carpeta raíz).
3. Copia todo su contenido.
4. Pégalo en el editor de reglas de la consola de Firebase, reemplazando lo que haya.
5. Haz clic en **Publicar**.

## 5. Conectar la Aplicación (Obtener API Keys)
1. En el menú lateral izquierdo, haz clic en el engranaje ⚙️ (Configuración del proyecto).
2. Baja hasta la sección **"Tus apps"**.
3. Haz clic en el icono de **Web** (`</>`).
4. Ponle un apodo a la app (ej: `Web App`) y registra la app.
5. Verás un objeto `firebaseConfig`. **No copies el código**, solo necesitamos los valores para tu archivo `.env`.

### Configurar archivo .env
1. En tu proyecto local, crea un archivo llamado `.env` (si no existe).
2. Copia el contenido de `.env.example` dentro de `.env`.
3. Reemplaza los valores con los que te da Firebase:

```env
VITE_FIREBASE_API_KEY= "tu apiKey"
VITE_FIREBASE_AUTH_DOMAIN= "tu authDomain"
VITE_FIREBASE_PROJECT_ID= "tu projectId"
VITE_FIREBASE_STORAGE_BUCKET= "tu storageBucket"
VITE_FIREBASE_MESSAGING_SENDER_ID= "tu messagingSenderId"
VITE_FIREBASE_APP_ID= "tu appId"
```

> **IMPORTANTE**: No uses comillas `""` ni espacios extra después del signo `=` en el archivo `.env`.

## 6. Crear tu primer usuario Profesor
Como la aplicación no tiene un panel de "Super Admin", el primer profesor debe registrarse normalmente.

1. Reinicia tu aplicación local: `npm run dev`.
2. Ve a `/register`.
3. Crea una cuenta seleccionando el rol **Teacher**.
   - *Nota: Por seguridad, podrías querer deshabilitar el registro de profesores en el futuro modificando el código de registro, pero para empezar está bien así.*

¡Listo! Ya tienes todo configurado.
