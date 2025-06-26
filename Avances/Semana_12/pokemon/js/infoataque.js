// Obtener los modales
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");
const modal3 = document.getElementById("modal3");
const modal4 = document.getElementById("modal4");

// Obtener los botones que abren los modales
const botonModal1 = document.getElementById("botonModal1");
const botonModal2 = document.getElementById("botonModal2");
const botonModal3 = document.getElementById("botonModal3");
const botonModal4 = document.getElementById("botonModal4");

// Obtener los botones de cerrar
const cerrarModal1 = document.getElementById("cerrarModal1");
const cerrarModal2 = document.getElementById("cerrarModal2");
const cerrarModal3 = document.getElementById("cerrarModal3");
const cerrarModal4 = document.getElementById("cerrarModal4");

// Función para abrir el modal
function abrirModal(modal) {
    modal.style.display = "block";
}

// Función para cerrar el modal
function cerrarModal(modal) {
    modal.style.display = "none";
}

// Asignar eventos a los botones para abrir los modales
botonModal1.onclick = function() {
    abrirModal(modal1);
}
botonModal2.onclick = function() {
    abrirModal(modal2);
}
botonModal3.onclick = function() {
    abrirModal(modal3);
}
botonModal4.onclick = function() {
    abrirModal(modal4);
}

// Asignar eventos a los botones de cerrar
cerrarModal1.onclick = function() {
    cerrarModal(modal1);
}
cerrarModal2.onclick = function() {
    cerrarModal(modal2);
}
cerrarModal3.onclick = function() {
    cerrarModal(modal3);
}
cerrarModal4.onclick = function() {
    cerrarModal(modal4);
}

// Cerrar modal si se hace clic fuera del contenido
window.onclick = function(event) {
    if (event.target === modal1) {
        cerrarModal(modal1);
    }
    if (event.target === modal2) {
        cerrarModal(modal2);
    }
    if (event.target === modal3) {
        cerrarModal(modal3);
    }
    if (event.target === modal4) {
        cerrarModal(modal4);
    }
}
