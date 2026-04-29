# 🔥 Guía de Configuración de Firebase

## Paso 1: Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Nombra tu proyecto: `mizucuca-records` (o el nombre que prefieras)
4. Completa el asistente de configuración
5. Una vez creado, espera a que se inicie el proyecto

## Paso 2: Habilitar Autenticación por Email/Contraseña

1. En la consola de Firebase, ve a **Autenticación** (en el menú izquierdo)
2. Haz clic en la pestaña **"Método de inicio de sesión"**
3. Haz clic en **"Correo electrónico/Contraseña"**
4. Habilita ambas opciones:
   - ✅ Correo electrónico/Contraseña
   - ✅ Enlace de inicio de sesión por correo electrónico
5. Haz clic en **"Guardar"**

## Paso 3: Crear una Base de Datos Firestore

1. Ve a **Firestore Database** (en el menú izquierdo)
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de prueba"** (para desarrollo)
4. Elige la ubicación más cercana a tu zona
5. Haz clic en **"Crear"**

## Paso 4: Obtener tus Credenciales de Firebase

1. En la consola, haz clic en el ícono de **engranaje** ⚙️ (arriba a la izquierda)
2. Selecciona **"Configuración del proyecto"**
3. Ve a la pestaña **"General"**
4. En la sección **"Tus aplicaciones"**, haz clic en **"</>  Web"**
5. Copia el objeto `firebaseConfig` que aparece

## Paso 5: Actualizar `firebase-config.js`

1. Abre el archivo `firebase-config.js` en VS Code
2. Reemplaza esto:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBLjJk2vXZqL8wM9pQ1rS2tU3vW4xY5zAb",
  authDomain: "mizucuca-records.firebaseapp.com",
  projectId: "mizucuca-records",
  storageBucket: "mizucuca-records.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

Por tu propia configuración de Firebase que copiaste en el paso anterior.

## Paso 6: Agregar Scripts de Firebase a los HTML

En cada archivo HTML (`index.html`, `auth.html`, `carrito.html`, `pago.html`), justo antes del `</body>`, agrega:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>

<!-- Tu configuración de Firebase -->
<script src="firebase-config.js"></script>

<!-- Tu app principal -->
<script src="app.js"></script>
```

**Importante**: El orden debe ser:
1. Firebase SDK
2. firebase-config.js
3. app.js

## Paso 7: Configurar Reglas de Seguridad de Firestore

1. En Firestore Database, ve a la pestaña **"Reglas"**
2. Reemplaza el contenido con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que cada usuario acceda solo a sus datos
    match /usuarios/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /carritos/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Haz clic en **"Publicar"**

## ¿Qué hace ahora?

✅ Cuando un usuario **se registra o inicia sesión**, su carrito se guarda en Firebase  
✅ Si el usuario abre la web en otro dispositivo, su carrito se cargará automáticamente  
✅ Al cerrar sesión, el carrito se guarda y se limpia localmente  
✅ Cada compra está vinculada a la cuenta del usuario

## Problemas Comunes

### ❌ "Firebase is not defined"
- Asegúrate de que los scripts de Firebase están en el HTML ANTES de `firebase-config.js`

### ❌ "Permission denied" en Firestore
- Revisa las reglas de seguridad de Firestore (Paso 7)
- Asegúrate de que el usuario está autenticado

### ❌ El carrito no se sincroniza
- Abre la consola del navegador (F12) y busca errores
- Verifica que Firebase está inicializado correctamente

---

¿Necesitas ayuda con algún paso?
