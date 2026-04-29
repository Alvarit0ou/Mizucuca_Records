# ✅ Firebase Configurado - Próximos Pasos

## 📋 Qué se ha hecho:

✅ Creado `firebase-config.js` con la configuración de Firebase  
✅ Actualizado `app.js` para sincronizar carrito con Firebase  
✅ Añadidos scripts de Firebase a todos los HTML (index, auth, carrito, pago)  
✅ Módulo de autenticación preparado para usar Firebase

---

## 🎯 Lo que tienes que hacer AHORA:

### Paso 1️⃣: Crear un proyecto Firebase

1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Nombra tu proyecto: `mizucuca-records` (o el nombre que prefieras)
4. Continúa hasta que se cree el proyecto

### Paso 2️⃣: Habilitar Autenticación

1. En Firebase Console → **Autenticación**
2. Pestaña **"Método de inicio de sesión"**
3. Habilita **"Correo electrónico/Contraseña"** ✅

### Paso 3️⃣: Crear Base de Datos Firestore

1. En Firebase Console → **Firestore Database**
2. Haz clic en **"Crear base de datos"**
3. Modo: **"Iniciar en modo de prueba"**
4. Ubicación: selecciona la más cercana

### Paso 4️⃣: Obtener Credenciales

1. Haz clic en ⚙️ (engranaje) → **"Configuración del proyecto"**
2. Pestaña **"General"**
3. En "Tus aplicaciones", haz clic en **"</>  Web"**
4. **Copia el objeto `firebaseConfig`** completo

### Paso 5️⃣: Actualizar firebase-config.js

1. Abre `firebase-config.js` en VS Code
2. Reemplaza el objeto `firebaseConfig` con el que copiaste:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-id",
  appId: "tu-app-id"
};
```

### Paso 6️⃣: Configurar Reglas de Seguridad

1. En Firestore → **"Reglas"**
2. Reemplaza todo con esto:

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

---

## ✨ ¿Qué sucede después?

Una vez configurado Firebase:

✅ Los usuarios pueden registrarse con email/contraseña  
✅ Al iniciar sesión, su carrito se sincroniza automáticamente  
✅ Si abren la web en otro dispositivo, ven el mismo carrito  
✅ Al cerrar sesión, el carrito se guarda en Firebase  
✅ Todo está protegido - cada usuario solo ve sus datos  

---

## 🔍 ¿Cómo verificar que funciona?

1. Abre la web en Firefox/Chrome
2. Abre la consola (F12)
3. Deberías ver: ✅ **"Firebase inicializado correctamente"**
4. Registra un usuario
5. Añade productos al carrito
6. Abre la consola de Firebase para verificar que se guardan en Firestore

---

## ⚠️ Problemas Comunes

### "Firebase is not defined"
→ Verifica que los scripts de Firebase están antes de `firebase-config.js`

### "Permission denied" 
→ Revisa las reglas de Firestore (Paso 6)

### El carrito no se sincroniza
→ Abre F12 (consola) y busca mensajes de error

---

## 📞 Necesitas Ayuda?

Si algo no funciona después de seguir estos pasos, abre la consola (F12) y comparte los errores que veas.

¡Estoy aquí para ayudarte! 😊
