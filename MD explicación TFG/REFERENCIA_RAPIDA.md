# 📖 REFERENCIA RÁPIDA - app.js

## 📍 ¿Dónde buscar?

| Funcionalidad | Módulo | Función |
|---------------|--------|---------|
| Agregar producto a carrito | `CartModule` | `agregarAlCarrito(button)` |
| Ver cantidad total | `CartModule` | `actualizarContador()` |
| Obtener carrito | `CartModule` | `obtenerCarrito()` |
| Vaciar carrito | `CartModule` | `limpiarCarrito()` |
| Aumentar/Disminuir cantidad | `CartModule` | `incrementarCantidad()` / `decrementarCantidad()` |
| | | |
| Registrar usuario | `AuthModule` | `register(name, email, pass)` |
| Iniciar sesión | `AuthModule` | `login(email, pass)` |
| Usuario actual | `AuthModule` | `getCurrentUser()` |
| Cerrar sesión | `AuthModule` | `logout()` |
| | | |
| Menú desplegable | `NavigationModule` | `initSubmenuToggle()` |
| Mensaje carrito hover | `NavigationModule` | `initCartMessageHover()` |
| | | |
| Reproducción audio | `AudioModule` | `initAudio()` |
| | | |
| Renderizar carrito | `CartViewModule` | `renderizarCarrito()` |
| Ir a pago | `CartViewModule` | `irAPago()` |
| | | |
| Resumen pago | `PaymentModule` | `renderizarResumen()` |
| Procesar pago | `PaymentModule` | `procesarPago(event)` |
| | | |
| Tabs login/registro | `AuthViewModule` | `initTabToggle()` |

---

## 🔍 Búsqueda por Página

### **index.html**
Funcionalidades:
- ✓ Carrito: agregar, contador, actualización
- ✓ Menú: características, mensajes
- ✓ Audio: reproducción, volumen, mute

Módulos en uso:
```
CartModule
NavigationModule
AudioModule
```

---

### **auth.html**
Funcionalidades:
- ✓ Tabs: login/registro
- ✓ Registro: validación, guardado
- ✓ Login: verificación de credenciales

Módulos en uso:
```
AuthModule
AuthViewModule
```

---

### **carrito.html**
Funcionalidades:
- ✓ Tabla: mostrar productos
- ✓ Cantidad: modificar (+/-)
- ✓ Eliminar: productos individuales
- ✓ Total: cálculo automático
- ✓ Ir a pago: navegación

Módulos en uso:
```
CartModule
CartViewModule
```

---

### **pago.html**
Funcionalidades:
- ✓ Resumen: productos y total
- ✓ Validadores: tarjeta, vencimiento, CVV
- ✓ Procesamiento: simulado con confirmación
- ✓ Limpieza: carrito al finalizar

Módulos en uso:
```
CartModule
PaymentModule
```

---

## 💾 LocalStorage Keys

```javascript
// Carrito
localStorage.mizucuca_carrito
// Estructura:
{
  id: "1",
  nombre: "SOUR",
  precio: 19.99,
  artista: "Olivia Rodrigo",
  cantidad: 2
}

// Usuarios (lista)
localStorage.ar_users
// Estructura:
{
  name: "Juan",
  email: "juan@example.com",
  pass: "password123"
}

// Usuario actual logueado
localStorage.ar_current
// Valor: "juan@example.com"
```

---

## 🎨 Estructura de Módulos (IIFE)

```javascript
const MiModulo = (() => {
  // Variables privadas
  const variable_privada = "solo dentro";
  
  // Funciones privadas
  const funcionPrivada = () => { ... };
  
  // Funciones públicas
  const funcionPublica = () => { ... };
  
  // Exportar público
  return {
    funcionPublica
  };
})();

// Usar:
MiModulo.funcionPublica() ✓
MiModulo.variable_privada  ✗ (undefined)
```

---

## 🔌 Puntos de Entrada HTML

### Botones/Elementos que llaman módulos:

```html
<!-- Agregar al carrito -->
<button onclick="CartModule.agregarAlCarrito(this)">Añadir</button>

<!-- Modificar cantidad -->
<button onclick="CartModule.incrementarCantidad(0); CartViewModule.renderizarCarrito()">+</button>
<button onclick="CartModule.decrementarCantidad(0); CartViewModule.renderizarCarrito()">-</button>

<!-- Eliminar del carrito -->
<button onclick="if(CartModule.eliminarDelCarrito(0)) CartViewModule.renderizarCarrito()">Eliminar</button>

<!-- Ir a pago -->
<button onclick="CartViewModule.irAPago()">Ir a pago</button>

<!-- Procesar pago (form submit) -->
<form id="pago-form" onsubmit="PaymentModule.procesarPago(event)">...</form>
```

---

## 🎯 Inicialización Automática

```javascript
// En DOMContentLoaded, se ejecuta automáticamente:
document.addEventListener('DOMContentLoaded', function() {
  CartModule.actualizarContador()                 // ✓ index.html
  NavigationModule.initSubmenuToggle()            // ✓ index.html
  NavigationModule.initCartMessageHover()         // ✓ index.html
  AudioModule.initAudio()                         // ✓ index.html
  
  CartViewModule.renderizarCarrito()              // ✓ carrito.html
  
  PaymentModule.renderizarResumen()               // ✓ pago.html
  PaymentModule.initValidadores()                 // ✓ pago.html
  
  AuthViewModule.initTabToggle()                  // ✓ auth.html
  AuthViewModule.initRegisterForm()               // ✓ auth.html
  AuthViewModule.initLoginForm()                  // ✓ auth.html
})
```

---

## 🚀 Patrones Comunes

### Obtener datos del carrito
```javascript
const carrito = CartModule.obtenerCarrito()
console.log(carrito) // Array de productos
```

### Agregar a carrito
```javascript
// Desde HTML
<button onclick="CartModule.agregarAlCarrito(this)">Agregar</button>

// Desde JS
const button = document.querySelector('button')
CartModule.agregarAlCarrito(button)
```

### Procesar pago
```javascript
// Se vincula automáticamente
// El formulario tiene id="pago-form"
// Al enviar → PaymentModule.procesarPago(event)
```

### Verificar usuario logueado
```javascript
const usuario = AuthModule.getCurrentUser()
if (usuario) {
  console.log('Usuario:', usuario)
} else {
  console.log('No hay sesión activa')
}
```

---

## ⚠️ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `CartModule is not defined` | `app.js` no se cargó | Verificar `<script src="app.js"></script>` |
| `getElementById(...) is null` | ID HTML incorrecto | Verificar que coincidan exactamente |
| `localStorage.mizucuca_carrito` vacío | Carrito nunca tuvo items | Agregar primero un producto |
| Botones no responden | `onclick` sin módulo | Usar `CartModule.agregarAlCarrito(this)` |
| Doble recarga de `app.js` | `<script>` duplicado | Eliminar `<script>` inline, mantener solo `<script src="app.js">` |

---

## 📞 Soporte

Si algo no funciona:

1. **Verificar consola (F12 → Console)**
   - Ver errores rojos
   - Escribir `CartModule` para verificar que existe

2. **Verificar localStorage**
   - F12 → Application → Local Storage
   - Ver qué datos hay guardados

3. **Verificar HTML**
   - Confirmar que IDs coinciden
   - Confirmar que `<script src="app.js"></script>` existe

4. **Recargar página**
   - Ctrl+F5 o Cmd+Shift+R (hard refresh)
   - Limpiar caché

---

## 📊 Tamaño del Código

- `app.js`: ~520 líneas
- Documentación: 3 archivos markdown
- **Total:** ~730 líneas de código + documentación

**Beneficio:** Antes eran ~330 líneas dispersas en 4 archivos 
**Resultado:** Código centralizado, modular y mantenible ✨

