/**
 * MizuCuca Records - Aplicación Principal
 * Centraliza toda la lógica de JavaScript para la tienda online
 */

// ============================================
// MÓDULO: CARRITO DE COMPRAS
// ============================================
const CartModule = (() => {
  const STORAGE_KEY = 'mizucuca_carrito';

  const obtenerCarrito = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      console.error('Error al obtener carrito:', e);
      return [];
    }
  };

  const guardarCarrito = (carrito) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    actualizarContador();

    // Sincronizar con Firebase si el usuario está autenticado
    if (typeof FirebaseCartModule !== 'undefined' && AuthModule.isUsingFirebase && AuthModule.isUsingFirebase()) {
      const currentUser = AuthModule.getCurrentUser();
      if (currentUser) {
        FirebaseCartModule.sincronizarCarrito(currentUser, carrito).catch(error => {
          console.error('Error al sincronizar carrito con Firebase:', error);
        });
      }
    }
  };

  const agregarAlCarrito = (button) => {
    const album = button.closest('.album');
    if (!album) return;

    const id = album.dataset.id;
    const nombre = album.dataset.nombre;
    const precio = parseFloat(album.dataset.precio);
    const artista = album.dataset.artista;

    let carrito = obtenerCarrito();
    const existe = carrito.find(item => item.id === id);

    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ id, nombre, precio, artista, cantidad: 1 });
    }

    guardarCarrito(carrito);
    button.textContent = '✓ Añadido';
    setTimeout(() => {
      button.textContent = 'Añadir a cesta';
    }, 1500);
  };

  const actualizarContador = () => {
    const contadorEl = document.getElementById('contador-cesta');
    if (!contadorEl) return;

    const carrito = obtenerCarrito();
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contadorEl.textContent = total;
  };

  const incrementarCantidad = (index) => {
    let carrito = obtenerCarrito();
    if (carrito[index]) {
      carrito[index].cantidad++;
      guardarCarrito(carrito);
    }
  };

  const decrementarCantidad = (index) => {
    let carrito = obtenerCarrito();
    if (carrito[index]) {
      if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
      } else {
        carrito.splice(index, 1);
      }
      guardarCarrito(carrito);
    }
  };

  const eliminarDelCarrito = (index) => {
    if (confirm('¿Eliminar este producto del carrito?')) {
      let carrito = obtenerCarrito();
      carrito.splice(index, 1);
      guardarCarrito(carrito);
      return true;
    }
    return false;
  };

  const limpiarCarrito = () => {
    localStorage.removeItem(STORAGE_KEY);
    actualizarContador();
  };

  return {
    obtenerCarrito,
    guardarCarrito,
    agregarAlCarrito,
    actualizarContador,
    incrementarCantidad,
    decrementarCantidad,
    eliminarDelCarrito,
    limpiarCarrito
  };
})();

// ============================================
// MÓDULO: AUTENTICACIÓN
// ============================================
const AuthModule = (() => {
  const USERS_KEY = 'ar_users';
  const CURRENT_USER_KEY = 'ar_current';
  let useFirebase = false;

  // Detectar si Firebase está disponible
  const isFirebaseAvailable = () => {
    return typeof firebase !== 'undefined' && typeof FirebaseAuthModule !== 'undefined';
  };

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      console.error('Error al obtener usuarios:', e);
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const getCurrentUser = () => {
    return localStorage.getItem(CURRENT_USER_KEY);
  };

  const setCurrentUser = (email) => {
    localStorage.setItem(CURRENT_USER_KEY, email);
  };

  const logout = async () => {
    if (useFirebase && isFirebaseAvailable()) {
      try {
        await FirebaseAuthModule.cerrarSesion();
      } catch (error) {
        console.error('Error al cerrar sesión en Firebase:', error);
      }
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      CartModule.limpiarCarrito();
    }
  };

  const register = async (name, email, password) => {
    if (useFirebase && isFirebaseAvailable()) {
      try {
        await FirebaseAuthModule.registrarUsuario(email, password, name);
        return { success: true, message: 'Cuenta creada exitosamente.' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    } else {
      // Fallback a localStorage
      const emailLower = email.trim().toLowerCase();
      const users = getUsers();

      if (users.find(u => u.email === emailLower)) {
        return { success: false, message: 'Ya existe una cuenta con ese correo.' };
      }

      users.push({ name, email: emailLower, pass: password });
      saveUsers(users);
      setCurrentUser(emailLower);
      return { success: true, message: 'Cuenta creada exitosamente.' };
    }
  };

  const login = async (email, password) => {
    if (useFirebase && isFirebaseAvailable()) {
      try {
        await FirebaseAuthModule.iniciarSesion(email, password);
        return { success: true, message: 'Sesión iniciada.' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    } else {
      // Fallback a localStorage
      const emailLower = email.trim().toLowerCase();
      const users = getUsers();
      const found = users.find(u => u.email === emailLower && u.pass === password);

      if (!found) {
        return { success: false, message: 'Credenciales incorrectas.' };
      }

      setCurrentUser(emailLower);
      return { success: true, message: 'Sesión iniciada.' };
    }
  };

  // Inicializar Firebase si está disponible
  const initFirebase = () => {
    if (isFirebaseAvailable()) {
      useFirebase = true;
      console.log('✅ Firebase detectado, usando autenticación con Firebase');
      try {
        FirebaseAuthModule.escucharCambiosAutenticacion((user) => {
          if (user) {
            setCurrentUser(user.email);
          } else {
            localStorage.removeItem(CURRENT_USER_KEY);
          }
        });
      } catch (error) {
        console.error('Error al escuchar cambios de autenticación:', error);
      }
    } else {
      console.log('⚠️ Firebase no disponible, usando localStorage para autenticación');
      useFirebase = false;
    }
  };

  return {
    getUsers,
    saveUsers,
    getCurrentUser,
    setCurrentUser,
    logout,
    register,
    login,
    initFirebase,
    isUsingFirebase: () => useFirebase
  };
})();

// ============================================
// MÓDULO: NAVEGACIÓN
// ============================================
const NavigationModule = (() => {
  const initSubmenuToggle = () => {
    const btn = document.querySelector('nav button');
    const submenu = document.getElementById('submenu-caracteristicas');

    if (!btn || !submenu) return;

    let submenuTimeout;

    btn.addEventListener('mouseenter', () => {
      clearTimeout(submenuTimeout);
      submenu.style.display = 'flex';
    });

    btn.addEventListener('mouseleave', () => {
      submenuTimeout = setTimeout(() => {
        submenu.style.display = 'none';
      }, 50);
    });

    submenu.addEventListener('mouseenter', () => {
      clearTimeout(submenuTimeout);
      submenu.style.display = 'flex';
    });

    submenu.addEventListener('mouseleave', () => {
      submenuTimeout = setTimeout(() => {
        submenu.style.display = 'none';
      }, 800);
    });
  };

  const initCartMessageHover = () => {
    const cestaLink = document.getElementById('cestaLink');
    const cestaMsg = document.getElementById('cestaMsg');

    if (!cestaLink || !cestaMsg) return;

    cestaLink.addEventListener('mouseenter', () => {
      cestaMsg.style.display = 'block';
    });

    cestaLink.addEventListener('mouseleave', () => {
      cestaMsg.style.display = 'none';
    });
  };

  return {
    initSubmenuToggle,
    initCartMessageHover
  };
})();

// ============================================
// MÓDULO: AUDIO
// ============================================
const AudioModule = (() => {
  const initAudio = () => {
    const audio = document.getElementById('miAudio');
    const volumenSlider = document.getElementById('volumenSlider');
    const audioMsg = document.getElementById('audioMsg');
    const volumenLogo = document.getElementById('volumenLogo');

    if (!audio || !volumenSlider) return;

    audio.volume = parseFloat(volumenSlider.value);

    audio.play().catch(() => {
      if (audioMsg) audioMsg.style.display = 'block';
      const activarAudio = () => {
        audio.play();
        if (audioMsg) audioMsg.style.display = 'none';
        document.body.removeEventListener('click', activarAudio);
      };
      document.body.addEventListener('click', activarAudio);
    });

    volumenSlider.addEventListener('input', function() {
      audio.volume = parseFloat(this.value);
    });

    if (volumenLogo) {
      let muted = false;
      volumenLogo.addEventListener('click', function() {
        muted = !muted;
        audio.muted = muted;
        volumenLogo.style.opacity = muted ? '0.5' : '1';
      });
    }
  };

  return {
    initAudio
  };
})();

// ============================================
// MÓDULO: CARRITO (VISTA)
// ============================================
const CartViewModule = (() => {
  const renderizarCarrito = () => {
    const contenedor = document.getElementById('carrito-contenido');
    if (!contenedor) return;

    const carrito = CartModule.obtenerCarrito();

    if (carrito.length === 0) {
      contenedor.innerHTML = `
        <div class="carrito-vacio">
          <p style="font-size: 1.2em; margin-bottom: 20px;">Tu carrito está vacío</p>
          <a href="index.html">← Volver a comprar</a>
        </div>
      `;
      return;
    }

    let html = `
      <table class="carrito-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Artista</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
    `;

    let total = 0;
    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      html += `
        <tr>
          <td><strong>${item.nombre}</strong></td>
          <td>${item.artista}</td>
          <td>${item.precio.toFixed(2)}€</td>
          <td>
            <div class="cantidad-control">
              <button onclick="CartModule.decrementarCantidad(${index}); CartViewModule.renderizarCarrito()">−</button>
              <span style="min-width: 30px; text-align: center;">${item.cantidad}</span>
              <button onclick="CartModule.incrementarCantidad(${index}); CartViewModule.renderizarCarrito()">+</button>
            </div>
          </td>
          <td><strong>${subtotal.toFixed(2)}€</strong></td>
          <td><button class="btn-eliminar" onclick="if(CartModule.eliminarDelCarrito(${index})) CartViewModule.renderizarCarrito()">Eliminar</button></td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
      <div class="carrito-resumen">
        <div class="carrito-resumen-row">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}€</span>
        </div>
        <div class="carrito-resumen-row">
          <span>Envío:</span>
          <span>Gratis</span>
        </div>
        <div class="carrito-resumen-row carrito-total">
          <span>TOTAL:</span>
          <span>${total.toFixed(2)}€</span>
        </div>
      </div>
      <div class="carrito-acciones">
        <a href="index.html" class="btn-volver">← Seguir comprando</a>
        <button class="btn-pago" onclick="CartViewModule.irAPago()">Ir a pago →</button>
      </div>
    `;

    contenedor.innerHTML = html;
  };

  const irAPago = () => {
    const carrito = CartModule.obtenerCarrito();
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    window.location.href = 'pago.html';
  };

  return {
    renderizarCarrito,
    irAPago
  };
})();

// ============================================
// MÓDULO: PAGO
// ============================================
const PaymentModule = (() => {
  const renderizarResumen = () => {
    const contenedor = document.getElementById('resumen-productos');
    if (!contenedor) return;

    const carrito = CartModule.obtenerCarrito();
    let html = '<div class="resumen-item-titulo">Productos</div>';
    let total = 0;

    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      html += `
        <div class="resumen-producto">
          <span>${item.nombre} x${item.cantidad}</span>
          <span>${subtotal.toFixed(2)}€</span>
        </div>
      `;
    });

    contenedor.innerHTML = html;

    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = total.toFixed(2) + '€';
    if (totalEl) totalEl.textContent = total.toFixed(2) + '€';
  };

  const formatearNumeroTarjeta = (value) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += cleaned[i];
    }
    return formatted;
  };

  const formatearVencimiento = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const formatearCVV = (value) => {
    return value.replace(/\D/g, '');
  };

  const initValidadores = () => {
    const cardInput = document.getElementById('numero-tarjeta');
    const expiryInput = document.getElementById('vencimiento');
    const cvvInput = document.getElementById('cvv');

    if (cardInput) {
      cardInput.addEventListener('input', function() {
        this.value = formatearNumeroTarjeta(this.value);
      });
    }

    if (expiryInput) {
      expiryInput.addEventListener('input', function() {
        this.value = formatearVencimiento(this.value);
      });
    }

    if (cvvInput) {
      cvvInput.addEventListener('input', function() {
        this.value = formatearCVV(this.value);
      });
    }
  };

  const procesarPago = (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const numeroTarjeta = document.getElementById('numero-tarjeta').value.replace(/\s/g, '');

    if (nombre.length < 3) {
      alert('Por favor, introduce un nombre válido');
      return;
    }

    if (numeroTarjeta.length !== 16) {
      alert('El número de tarjeta debe tener 16 dígitos');
      return;
    }

    const btn = document.querySelector('.btn-pago-completar');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Procesando...';
    }

    setTimeout(() => {
      CartModule.limpiarCarrito();

      const orderNumber = Math.floor(Math.random() * 1000000);
      alert(`✓ ¡Pago realizado con éxito!\n\nNúmero de pedido: #${orderNumber}\n\nTe hemos enviado una confirmación a: ${email}\n\nTu pedido llegará en 24 horas.`);

      window.location.href = 'welcome.html';
    }, 2000);
  };

  return {
    renderizarResumen,
    formatearNumeroTarjeta,
    formatearVencimiento,
    formatearCVV,
    initValidadores,
    procesarPago
  };
})();

// ============================================
// MÓDULO: AUTENTICACIÓN (VISTA)
// ============================================
const AuthViewModule = (() => {
  const initTabToggle = () => {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (!tabLogin || !tabRegister || !loginForm || !registerForm) return;

    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.style.display = '';
      registerForm.style.display = 'none';
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.style.display = '';
      loginForm.style.display = 'none';
    });
  };

  const initRegisterForm = () => {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pass = document.getElementById('reg-pass').value;
      const msg = document.getElementById('reg-msg');

      const result = await AuthModule.register(name, email, pass);

      if (msg) {
        msg.textContent = result.message;
        msg.style.color = result.success ? 'green' : 'salmon';
      }

      if (result.success) {
        setTimeout(() => {
          window.location.href = 'welcome.html';
        }, 500);
      }
    });
  };

  const initLoginForm = () => {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-pass').value;
      const msg = document.getElementById('login-msg');

      const result = await AuthModule.login(email, pass);

      if (msg) {
        msg.textContent = result.message;
        msg.style.color = result.success ? 'green' : 'salmon';
      }

      if (result.success) {
        setTimeout(() => {
          window.location.href = 'welcome.html';
        }, 500);
      }
    });
  };

  return {
    initTabToggle,
    initRegisterForm,
    initLoginForm
  };
})();

// ============================================
// INICIALIZACIÓN GLOBAL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar Firebase si está disponible
  AuthModule.initFirebase();

  // Inicializar módulo de carrito en todas las páginas
  CartModule.actualizarContador();

  // Inicializar navegación si existe
  NavigationModule.initSubmenuToggle();
  NavigationModule.initCartMessageHover();

  // Inicializar audio si existe
  AudioModule.initAudio();

  // Inicializar carrito (vista) si existe
  CartViewModule.renderizarCarrito();

  // Inicializar pago si existe
  PaymentModule.renderizarResumen();
  PaymentModule.initValidadores();

  const pagoForm = document.getElementById('pago-form');
  if (pagoForm) {
    pagoForm.addEventListener('submit', PaymentModule.procesarPago);
  }

  // Inicializar autenticación si existe
  AuthViewModule.initTabToggle();
  AuthViewModule.initRegisterForm();
  AuthViewModule.initLoginForm();
});
