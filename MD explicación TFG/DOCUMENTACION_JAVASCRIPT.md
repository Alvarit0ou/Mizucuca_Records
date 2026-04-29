# MizuCuca Records - Documentación JavaScript Centralizado

## 📋 Resumen

Se ha creado un archivo `app.js` centralizado que contiene toda la lógica JavaScript del sitio web, organizando el código en módulos independientes usando el patrón **Module Pattern** (IIFE).

## 🏗️ Estructura Modular

### 1. **CartModule** - Carrito de Compras
Gestiona toda la lógica del carrito de compras almacenado en `localStorage`.

```javascript
CartModule.obtenerCarrito()        // Obtiene carrito actual
CartModule.guardarCarrito(carrito) // Guarda carrito
CartModule.agregarAlCarrito(button) // Añade producto
CartModule.actualizarContador()    // Actualiza contador
CartModule.incrementarCantidad()   // Aumenta cantidad
CartModule.decrementarCantidad()   // Disminuye cantidad
CartModule.eliminarDelCarrito()    // Elimina producto
CartModule.limpiarCarrito()        // Vacía carrito
```

**Almacenamiento:** `localStorage.mizucuca_carrito`

---

### 2. **AuthModule** - Autenticación
Maneja el sistema de login y registro de usuarios.

```javascript
AuthModule.getUsers()              // Obtiene lista de usuarios
AuthModule.saveUsers(users)        // Guarda usuarios
AuthModule.getCurrentUser()        // Usuario actual logueado
AuthModule.setCurrentUser(email)   // Establece usuario actual
AuthModule.logout()                // Cierra sesión
AuthModule.register(name, email, pass)  // Registra nuevo usuario
AuthModule.login(email, pass)      // Inicia sesión
```

**Almacenamiento:**
- `localStorage.ar_users` - Lista de usuarios
- `localStorage.ar_current` - Usuario actual

---

### 3. **NavigationModule** - Navegación
Controla el comportamiento de los menús y elementos de navegación.

```javascript
NavigationModule.initSubmenuToggle()   // Menú desplegable características
NavigationModule.initCartMessageHover() // Mensaje de carrito
```

---

### 4. **AudioModule** - Control de Música
Gestiona la reproducción de audio y control de volumen.

```javascript
AudioModule.initAudio()  // Inicializa audio, volumen y mute
```

---

### 5. **CartViewModule** - Vista del Carrito
Renderiza la página del carrito con tabla interactiva.

```javascript
CartViewModule.renderizarCarrito()  // Renderiza HTML del carrito
CartViewModule.irAPago()            // Navega a página de pago
```

---

### 6. **PaymentModule** - Sistema de Pago
Gestiona el formulario y procesamiento de pagos.

```javascript
PaymentModule.renderizarResumen()       // Muestra resumen
PaymentModule.formatearNumeroTarjeta()  // Formatea tarjeta
PaymentModule.formatearVencimiento()    // Formatea vencimiento
PaymentModule.formatearCVV()            // Valida CVV
PaymentModule.initValidadores()         // Inicializa validadores
PaymentModule.procesarPago()            // Procesa pago
```

---

### 7. **AuthViewModule** - Vista de Autenticación
Maneja los eventos y formularios de login/registro.

```javascript
AuthViewModule.initTabToggle()    // Alterna tabs login/registro
AuthViewModule.initRegisterForm() // Maneja envío registro
AuthViewModule.initLoginForm()    // Maneja envío login
```

---

## 🔗 Integración en HTML

Cada archivo HTML ahora solo necesita incluir una línea:

```html
<script src="app.js"></script>
```

**Archivos actualizados:**
- ✅ `index.html` - Página principal
- ✅ `auth.html` - Login/Registro
- ✅ `carrito.html` - Carrito de compras
- ✅ `pago.html` - Página de pago

---

## 🚀 Ventajas de la Nueva Estructura

✨ **Mantenibilidad:** Código limpio y organizado
✨ **Reutilización:** Módulos disponibles en todas las páginas
✨ **Sin conflictos:** Variables encapsuladas
✨ **Fácil debug:** Funciones públicas bien documentadas
✨ **Escalabilidad:** Fácil agregar nuevos módulos
✨ **Rendimiento:** Una única descarga del script

---

## 📦 Flujo de Datos - LocalStorage

```
CartModule (mizucuca_carrito)
├── id: string
├── nombre: string
├── precio: number
├── artista: string
└── cantidad: number

AuthModule (ar_users)
├── name: string
├── email: string
└── pass: string

AuthModule (ar_current)
└── email del usuario logueado
```

---

## 🛠️ Ejemplos de Uso

### Agregar al carrito desde HTML
```html
<button onclick="CartModule.agregarAlCarrito(this)">Añadir a cesta</button>
```

### Renderizar carrito en página carrito.html
```javascript
// Se ejecuta automáticamente en DOMContentLoaded
CartViewModule.renderizarCarrito();
```

### Acceder al usuario actual
```javascript
const usuario = AuthModule.getCurrentUser();
```

### Procesamiento de pago
```javascript
// El formulario se vincula automáticamente en AuthViewModule
```

---

## 🔄 Ciclo de Inicialización

El archivo `app.js` se ejecuta cuando el DOM está listo:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // 1. Carrito
  CartModule.actualizarContador();
  
  // 2. Navegación
  NavigationModule.initSubmenuToggle();
  NavigationModule.initCartMessageHover();
  
  // 3. Audio
  AudioModule.initAudio();
  
  // 4. Carrito (vista)
  CartViewModule.renderizarCarrito();
  
  // 5. Pago
  PaymentModule.renderizarResumen();
  PaymentModule.initValidadores();
  
  // 6. Autenticación
  AuthViewModule.initTabToggle();
  AuthViewModule.initRegisterForm();
  AuthViewModule.initLoginForm();
});
```

---

## 📝 Notas Importantes

⚠️ **Nota de Seguridad:** El almacenamiento de contraseñas en `localStorage` es solo para propósitos de demostración. En producción, usar API backend con hash de contraseñas.

⚠️ **IDs Únicos:** Asegurar que los elementos HTML tengan los IDs correspondientes:
- `contador-cesta`, `cestaLink`, `cestaMsg` (carrito)
- `tab-login`, `tab-register`, `login-form`, `register-form` (auth)
- `carrito-contenido` (carrito view)
- `numero-tarjeta`, `vencimiento`, `cvv` (pago)
- `miAudio`, `volumenSlider`, `volumenLogo` (audio)

---

## 🧪 Testing

Para verificar que los módulos funcionan:

1. Abrir DevTools (F12)
2. En consola, escribir:
   ```javascript
   CartModule.obtenerCarrito()      // Ver carrito actual
   AuthModule.getCurrentUser()      // Ver usuario actual
   ```

---

## 📚 Referencias

- **Patrón Module Pattern:** Encapsulación de código en IIFE
- **localStorage:** Almacenamiento cliente de datos persistentes
- **DOMContentLoaded:** Evento de inicialización cuando DOM está listo

