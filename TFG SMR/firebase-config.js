/**
 * Configuración de Firebase (Compatible con Safari)
 * Este archivo contiene la configuración de Firebase para la tienda online
 */

// Variables globales para Firebase
var app;
var auth;
var db;
var firebaseReady = false;

// Intenta inicializar Firebase si está disponible
if (typeof firebase !== 'undefined') {
  try {
    var firebaseConfig = {
      apiKey: "AIzaSyAeUHJ_FX1jyzLLeoq_0LVLCM8Ujunj-XI",
      authDomain: "mizucuca-records.firebaseapp.com",
      projectId: "mizucuca-records",
      storageBucket: "mizucuca-records.firebasestorage.app",
      messagingSenderId: "426374647288",
      appId: "1:426374647288:web:017021acf5c359d22dda0d",
      measurementId: "G-F63QMQ6JKJ"
    };
    
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    firebaseReady = true;
    console.log('Firebase inicializado correctamente');
  } catch (error) {
    console.warn('Firebase no se pudo inicializar:', error.message);
    firebaseReady = false;
  }
} else {
  console.log('Firebase SDK no disponible');
}

// ============================================
// MÓDULO: FIREBASE CARRITO
// ============================================
var FirebaseCartModule = (function() {
  var CARRITO_COLLECTION = 'carritos';

  var guardarCarritoEnFirebase = function(userId, carrito) {
    if (!firebaseReady || !db) {
      return Promise.resolve();
    }
    try {
      return db.collection(CARRITO_COLLECTION).doc(userId).set({
        carrito: carrito,
        ultimaActualizacion: new Date()
      }, { merge: true }).then(function() {
        console.log('Carrito guardado en Firebase');
      });
    } catch (error) {
      console.error('Error al guardar carrito en Firebase:', error);
      return Promise.resolve();
    }
  };

  var obtenerCarritoDeFirebase = function(userId) {
    if (!firebaseReady || !db) {
      return Promise.resolve([]);
    }
    try {
      return db.collection(CARRITO_COLLECTION).doc(userId).get()
        .then(function(doc) {
          if (doc.exists) {
            return doc.data().carrito || [];
          }
          return [];
        })
        .catch(function(error) {
          console.error('Error al obtener carrito de Firebase:', error);
          return [];
        });
    } catch (error) {
      console.error('Error:', error);
      return Promise.resolve([]);
    }
  };

  var sincronizarCarrito = function(userId, carritoLocal) {
    if (!userId) return Promise.resolve();
    return guardarCarritoEnFirebase(userId, carritoLocal);
  };

  var cargarCarritoAlIniciarSesion = function(userId) {
    if (!userId) return Promise.resolve();
    return obtenerCarritoDeFirebase(userId)
      .then(function(carritoFirebase) {
        if (carritoFirebase && carritoFirebase.length > 0) {
          localStorage.setItem('mizucuca_carrito', JSON.stringify(carritoFirebase));
          if (typeof CartModule !== 'undefined' && CartModule.actualizarContador) {
            CartModule.actualizarContador();
          }
          console.log('Carrito cargado desde Firebase');
        }
      })
      .catch(function(error) {
        console.error('Error al cargar carrito:', error);
      });
  };

  var limpiarCarritoEnFirebase = function(userId) {
    if (!firebaseReady || !db) {
      return Promise.resolve();
    }
    try {
      return db.collection(CARRITO_COLLECTION).doc(userId).set({
        carrito: [],
        ultimaActualizacion: new Date()
      }, { merge: true }).then(function() {
        console.log('Carrito limpiado en Firebase');
      });
    } catch (error) {
      console.error('Error al limpiar carrito en Firebase:', error);
      return Promise.resolve();
    }
  };

  return {
    guardarCarritoEnFirebase: guardarCarritoEnFirebase,
    obtenerCarritoDeFirebase: obtenerCarritoDeFirebase,
    sincronizarCarrito: sincronizarCarrito,
    cargarCarritoAlIniciarSesion: cargarCarritoAlIniciarSesion,
    limpiarCarritoEnFirebase: limpiarCarritoEnFirebase
  };
})();

// ============================================
// MÓDULO: AUTENTICACIÓN CON FIREBASE
// ============================================
var FirebaseAuthModule = (function() {
  var registrarUsuario = function(email, password, nombre) {
    if (!firebaseReady || !auth) {
      return Promise.reject(new Error('Firebase no disponible'));
    }
    
    return auth.createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        var user = userCredential.user;
        if (firebaseReady && db) {
          return db.collection('usuarios').doc(user.uid).set({
            nombre: nombre,
            email: email,
            createdAt: new Date()
          }).then(function() {
            console.log('Usuario registrado:', user.uid);
            return user;
          });
        }
        console.log('Usuario registrado:', user.uid);
        return user;
      })
      .catch(function(error) {
        console.error('Error al registrar usuario:', error);
        throw error;
      });
  };

  var iniciarSesion = function(email, password) {
    if (!firebaseReady || !auth) {
      return Promise.reject(new Error('Firebase no disponible'));
    }
    
    return auth.signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        var user = userCredential.user;
        localStorage.setItem('ar_current', user.uid);
        
        if (firebaseReady) {
          return FirebaseCartModule.cargarCarritoAlIniciarSesion(user.uid)
            .then(function() {
              console.log('Sesión iniciada:', user.uid);
              return user;
            });
        }
        console.log('Sesión iniciada:', user.uid);
        return user;
      })
      .catch(function(error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  };

  var cerrarSesion = function() {
    if (!firebaseReady || !auth) {
      localStorage.removeItem('ar_current');
      if (typeof CartModule !== 'undefined' && CartModule.limpiarCarrito) {
        CartModule.limpiarCarrito();
      }
      return Promise.resolve();
    }
    
    var currentUser = auth && auth.currentUser;
    var userId = currentUser ? currentUser.uid : null;
    var promesas = [];
    
    if (userId) {
      if (typeof CartModule !== 'undefined' && CartModule.obtenerCarrito) {
        var carrito = CartModule.obtenerCarrito();
        promesas.push(FirebaseCartModule.guardarCarritoEnFirebase(userId, carrito));
      }
    }
    
    promesas.push(auth.signOut());
    
    return Promise.all(promesas)
      .then(function() {
        localStorage.removeItem('ar_current');
        if (typeof CartModule !== 'undefined' && CartModule.limpiarCarrito) {
          CartModule.limpiarCarrito();
        }
        console.log('Sesión cerrada');
      })
      .catch(function(error) {
        console.error('Error al cerrar sesión:', error);
      });
  };

  var obtenerUsuarioActual = function() {
    if (!firebaseReady || !auth) {
      return null;
    }
    return auth.currentUser;
  };

  var escucharCambiosAutenticacion = function(callback) {
    if (!firebaseReady || !auth) {
      console.warn('Firebase no disponible para escuchar cambios');
      return;
    }
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('Usuario autenticado:', user.uid);
        localStorage.setItem('ar_current', user.uid);
        callback(user);
      } else {
        console.log('Usuario no autenticado');
        localStorage.removeItem('ar_current');
        callback(null);
      }
    });
  };

  return {
    registrarUsuario: registrarUsuario,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion,
    obtenerUsuarioActual: obtenerUsuarioActual,
    escucharCambiosAutenticacion: escucharCambiosAutenticacion
  };
})();
