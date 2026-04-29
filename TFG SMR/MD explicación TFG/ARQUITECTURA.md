# 📊 Arquitectura de MizuCuca Records - Visualización

## 📁 Estructura de Archivos

```
/TFG SMR/
├── index.html ........................ Página principal
├── auth.html ......................... Login/Registro
├── carrito.html ...................... Carrito de compras
├── pago.html ......................... Página de pago
├── welcome.html ...................... Bienvenida
├── pop.html, rock.html, etc ......... Categorías
│
├── app.js ............................ 🆕 LÓGICA CENTRALIZADA
├── estilos.css ....................... Estilos
│
├── images/ ........................... Imágenes
└── music/ ............................ Archivos de audio
```

---

## 🏛️ Arquitectura de Módulos JavaScript

```
┌─────────────────────────────────────────────────────────────┐
│                      APP.JS (CENTRALIZADO)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ MÓDULOS (Encapsulados con IIFE)                     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  ├─ CartModule ..................... Carrito         │   │
│  │  ├─ AuthModule ..................... Autenticación   │   │
│  │  ├─ NavigationModule ............... Menús           │   │
│  │  ├─ AudioModule ................... Música          │   │
│  │  ├─ CartViewModule ................ Vista Carrito   │   │
│  │  ├─ PaymentModule ................. Pago            │   │
│  │  └─ AuthViewModule ................ Vista Auth      │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ INICIALIZACIÓN GLOBAL                               │   │
│  │ (Se ejecuta en DOMContentLoaded)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos - LocalStorage

```
┌─────────────────────────────┐
│     NAVEGADOR - HTML        │
│  ┌───────────────────────┐  │
│  │  index.html           │  │
│  │  auth.html            │  │
│  │  carrito.html         │  │
│  │  pago.html            │  │
│  └───────────────────────┘  │
└─────────────┬───────────────┘
              │
              │ Todas cargan
              ▼
         ┌─────────────┐
         │   app.js    │
         └─────────────┘
              │
              ├──────────────────────────────┐
              ▼                              ▼
    ┌──────────────────┐          ┌──────────────────┐
    │   localStorage   │          │   localStorage   │
    ├──────────────────┤          ├──────────────────┤
    │ mizucuca_carrito │          │    ar_users      │
    │ - id             │          │ - name           │
    │ - nombre         │          │ - email          │
    │ - precio         │          │ - pass           │
    │ - artista        │          │                  │
    │ - cantidad       │          ├──────────────────┤
    │                  │          │   ar_current     │
    └──────────────────┘          │ - email usuario  │
                                  └──────────────────┘
```

---

## 🎯 Mapeo HTML → Módulos

### INDEX.HTML
```
┌─────────────────────────────────┐
│ Elementos HTML                  │
├─────────────────────────────────┤
│ submenu-caracteristicas    ────→ NavigationModule.initSubmenuToggle()
│ cestaLink, cestaMsg        ────→ NavigationModule.initCartMessageHover()
│ contador-cesta             ────→ CartModule.actualizarContador()
│ btn-carrito (Añadir)       ────→ CartModule.agregarAlCarrito()
│ miAudio, volumenSlider     ────→ AudioModule.initAudio()
└─────────────────────────────────┘
```

### AUTH.HTML
```
┌──────────────────────────────────┐
│ Elementos HTML                   │
├──────────────────────────────────┤
│ tab-login, tab-register    ────→ AuthViewModule.initTabToggle()
│ login-form                 ────→ AuthViewModule.initLoginForm()
│ register-form              ────→ AuthViewModule.initRegisterForm()
│ (evento submit)                 │
└──────────────────────────────────┘
```

### CARRITO.HTML
```
┌──────────────────────────────────┐
│ Elemento HTML                    │
├──────────────────────────────────┤
│ carrito-contenido          ────→ CartViewModule.renderizarCarrito()
│ (Renderiza tabla + botones)      │
└──────────────────────────────────┘
```

### PAGO.HTML
```
┌────────────────────────────────────┐
│ Elementos HTML                     │
├────────────────────────────────────┤
│ resumen-productos, subtotal, total ────→ PaymentModule.renderizarResumen()
│ numero-tarjeta, vencimiento, cvv   ────→ PaymentModule.initValidadores()
│ pago-form (evento submit)          ────→ PaymentModule.procesarPago()
└────────────────────────────────────┘
```

---

## 🔗 Ciclo de Vida - Flujo de Compra

```
1. INICIO
   └─ Usuario entra a index.html
      └─ Se carga app.js
         ├─ CartModule.actualizarContador() ✓
         ├─ NavigationModule.init* ✓
         └─ AudioModule.initAudio() ✓

2. SELECCIONAR PRODUCTOS
   └─ Usuario hace click en "Añadir a cesta"
      └─ CartModule.agregarAlCarrito()
         ├─ Lee datos del album
         ├─ Obtiene carrito de localStorage
         ├─ Agrega/actualiza producto
         ├─ Guarda en localStorage
         └─ CartModule.actualizarContador() 🔄

3. VER CARRITO
   └─ Usuario navega a carrito.html
      └─ app.js se carga nuevamente
         └─ CartViewModule.renderizarCarrito()
            ├─ Lee carrito de localStorage
            ├─ Genera tabla HTML
            ├─ Vincula onclick a botones
            └─ Muestra total

4. MODIFICAR CARRITO
   └─ Usuario incrementa/decrementa/elimina
      └─ CartModule.incrementarCantidad() / decrementarCantidad() / eliminarDelCarrito()
         ├─ Actualiza localStorage
         └─ CartViewModule.renderizarCarrito() 🔄

5. PAGAR
   └─ Usuario navega a pago.html
      └─ PaymentModule.renderizarResumen()
         ├─ Lee carrito de localStorage
         └─ Muestra productos + total

6. COMPLETAR PAGO
   └─ Usuario envía formulario
      └─ PaymentModule.procesarPago()
         ├─ Valida datos
         ├─ Simula procesamiento (2s)
         ├─ CartModule.limpiarCarrito()
         ├─ Muestra confirmación
         └─ Redirige a welcome.html

7. FIN ✓
```

---

## 🔐 Gestión de Sesión

```
REGISTRO/LOGIN
    │
    ├─→ Usuario ingresa credenciales
    │
    ├─→ AuthModule.register() o AuthModule.login()
    │
    ├─→ Si OK: setCurrentUser(email)
    │   └─→ localStorage.ar_current = email
    │
    └─→ Redirige a welcome.html

VERIFICAR SESIÓN
    │
    └─→ AuthModule.getCurrentUser()
        └─→ return localStorage.ar_current
```

---

## 📊 Comparativa ANTES vs DESPUÉS

### ❌ ANTES (Sin Centralizar)
```
index.html      { 50+ líneas de JS }
auth.html       { 40+ líneas de JS }
carrito.html    { 50+ líneas de JS }
pago.html       { 45+ líneas de JS }
─────────────────────────────────────
TOTAL:          ~185 líneas repetidas
```

### ✅ DESPUÉS (Centralizado)
```
app.js          { ~500 líneas organizadas }
index.html      { <script src="app.js"></script> }
auth.html       { <script src="app.js"></script> }
carrito.html    { <script src="app.js"></script> }
pago.html       { <script src="app.js"></script> }
─────────────────────────────────────
VENTAJAS:
✓ Una única fuente de verdad
✓ Código reutilizable
✓ Fácil mantenimiento
✓ Mejor rendimiento (cache)
```

---

## 🚀 Cómo Extender

### Agregar un nuevo módulo

```javascript
// En app.js, agregar:
const MiNuevoModulo = (() => {
  const miMetodo = () => { ... };
  
  return {
    miMetodo
  };
})();

// En inicialización:
document.addEventListener('DOMContentLoaded', function() {
  MiNuevoModulo.miMetodo(); // ← Llamar aquí
});
```

### Usar módulo en HTML

```html
<script src="app.js"></script>
<script>
  // Acceder desde cualquier HTML
  MiNuevoModulo.miMetodo();
</script>
```

---

## 📝 Checklist de Verificación

- [x] Carrito funciona en todas las páginas
- [x] Contador actualiza correctamente
- [x] Auth register/login funciona
- [x] Navegación submenú funciona
- [x] Audio inicia y control de volumen
- [x] Carrito renderiza tabla
- [x] Modificar cantidades funciona
- [x] Pago procesa correctamente
- [x] Validadores tarjeta/vencimiento/CVV funcionan
- [x] LocalStorage persiste datos

