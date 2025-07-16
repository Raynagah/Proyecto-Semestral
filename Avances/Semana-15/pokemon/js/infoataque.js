document.addEventListener("DOMContentLoaded", function() {
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

    // Mapa de tipos a iconos
    const tipoIconMap = {
        'Fuego': 'img/tipoPokemon/Fuego.png',
        'Agua': 'img/tipoPokemon/Agua.png',
        'Planta': 'img/tipoPokemon/Planta.png',
        'Eléctrico': 'img/tipoPokemon/Eléctrico.png',
        'Hielo': 'img/tipoPokemon/Hielo.png',
        'Lucha': 'img/tipoPokemon/Lucha.png',
        'Veneno': 'img/tipoPokemon/Veneno.png',
        'Tierra': 'img/tipoPokemon/Tierra.png',
        'Volador': 'img/tipoPokemon/Volador.png',
        'Psíquico': 'img/tipoPokemon/Psíquico.png',
        'Bicho': 'img/tipoPokemon/Bicho.png',
        'Roca': 'img/tipoPokemon/Roca.png',
        'Fantasma': 'img/tipoPokemon/Fantasma.png',
        'Dragón': 'img/tipoPokemon/Dragón.png',
        'Siniestro': 'img/tipoPokemon/Siniestro.png',
        'Acero': 'img/tipoPokemon/Acero.png',
        'Hada': 'img/tipoPokemon/Hada.png',
        'Normal': 'img/tipoPokemon/Normal.png'
    };

    // Función para obtener información detallada de un movimiento
    async function obtenerInfoMovimiento(nombreMovimiento) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/move/${nombreMovimiento.toLowerCase()}`);
            const movimiento = await response.json();
            
            // Buscar nombre en español
            const nombreES = movimiento.names.find(n => n.language.name === 'es')?.name || movimiento.name;
            
            // Buscar descripción en español
            const efectoES = movimiento.flavor_text_entries.find(e => e.language.name === 'es')?.flavor_text || 
                 movimiento.effect_entries[0]?.effect || "Sin descripción disponible";
            
            // Obtener tipo de movimiento en español
            const tipoResponse = await fetch(movimiento.type.url);
            const tipoData = await tipoResponse.json();
            const tipoES = tipoData.names.find(n => n.language.name === 'es')?.name || movimiento.type.name;
            
            return {
                nombre: formatearNombre(nombreES),
                tipo: tipoES,
                poder: movimiento.power || "N/A",
                precision: movimiento.accuracy || "N/A",
                pp: movimiento.pp || "N/A",
                efecto: efectoES,
                prioridad: movimiento.priority || 0,
                clase: movimiento.damage_class.name === "special" ? "Especial" : 
                      movimiento.damage_class.name === "physical" ? "Físico" : 
                      "Estado",
                tipoIcon: tipoIconMap[tipoES] || 'img/tipoPokemon/Normal.png'
            };
        } catch (error) {
            console.error("Error al obtener información del movimiento:", error);
            return {
                nombre: nombreMovimiento,
                tipo: "Desconocido",
                poder: "N/A",
                precision: "N/A",
                pp: "N/A",
                efecto: "No se pudo cargar la información del movimiento",
                prioridad: 0,
                clase: "Desconocido",
                tipoIcon: 'img/tipoPokemon/Normal.png'
            };
        }
    }

    // Función para formatear el nombre del movimiento
    function formatearNombre(nombre) {
        return nombre.replace(/-/g, ' ')
                     .split(' ')
                     .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                     .join(' ');
    }

    // Función para crear el HTML de la carta de movimiento
    function crearCartaMovimiento(info) {
        return `
        <div class="modal-contenido">
            <span class="cerrar">&times;</span>
            <div class="modal-header">
                <h2>${info.nombre}</h2>
                <img src="${info.tipoIcon}" class="type-icon-large" alt="${info.tipo}">
            </div>
            <div class="move-details">
                <div class="move-stat-grid">
                    <div class="move-stat">
                        <div class="move-stat-label">TIPO</div>
                        <div class="move-stat-value type-${info.tipo.toLowerCase()}">${info.tipo}</div>
                    </div>
                    <div class="move-stat">
                        <div class="move-stat-label">CLASE</div>
                        <div class="move-stat-value">${info.clase}</div>
                    </div>
                    <div class="move-stat">
                        <div class="move-stat-label">PODER</div>
                        <div class="move-stat-value">${info.poder}</div>
                    </div>
                    <div class="move-stat">
                        <div class="move-stat-label">PRECISIÓN</div>
                        <div class="move-stat-value">${info.precision}</div>
                    </div>
                    <div class="move-stat">
                        <div class="move-stat-label">PP</div>
                        <div class="move-stat-value">${info.pp}</div>
                    </div>
                    <div class="move-stat">
                        <div class="move-stat-label">PRIORIDAD</div>
                        <div class="move-stat-value">${info.prioridad}</div>
                    </div>
                </div>
                <div class="move-effect">
                    <p>${info.efecto}</p>
                </div>
            </div>
        </div>`;
    }

    // Función para actualizar el modal con la carta de movimiento
async function actualizarModal(modal, selectId) {
    const select = document.getElementById(selectId);
    const movimientoNombre = select.value;

    if (!movimientoNombre) {
        modal.innerHTML = `
        <div class="modal-contenido">
            <span class="cerrar">&times;</span>
            <div class="modal-header">
                <h2>Movimiento no seleccionado</h2>
            </div>
            <div class="move-details">
                <div class="move-effect">
                    Por favor selecciona un movimiento primero.
                </div>
            </div>
        </div>`;

        // 🔧 Aquí agregamos el evento cerrar ANTES del return
        const cerrarBtn = modal.querySelector('.cerrar');
        if (cerrarBtn) {
            cerrarBtn.onclick = function () {
                modal.style.display = "none";
            };
        }

        return;
    }

    const info = await obtenerInfoMovimiento(movimientoNombre);
    modal.innerHTML = crearCartaMovimiento(info);

    const cerrarBtn = modal.querySelector('.cerrar');
    if (cerrarBtn) {
        cerrarBtn.onclick = function () {
            modal.style.display = "none";
        };
    }

    return;
}

    // Función para abrir el modal con animación
    async function abrirModalConInfo(modal, selectId) {
        await actualizarModal(modal, selectId);
        modal.style.display = "block";
        
        // Aplicar animación
        const contenido = modal.querySelector('.modal-contenido');
        if (contenido) {
            contenido.style.animation = 'modalFadeIn 0.4s ease-out';
        }
    }

    // Asignar eventos a los botones para abrir los modales
    if (botonModal1) botonModal1.addEventListener('click', () => abrirModalConInfo(modal1, "movimientos1"));
    if (botonModal2) botonModal2.addEventListener('click', () => abrirModalConInfo(modal2, "movimientos2"));
    if (botonModal3) botonModal3.addEventListener('click', () => abrirModalConInfo(modal3, "movimientos3"));
    if (botonModal4) botonModal4.addEventListener('click', () => abrirModalConInfo(modal4, "movimientos4"));

    // Cerrar modal si se hace clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal1) modal1.style.display = "none";
        if (event.target === modal2) modal2.style.display = "none";
        if (event.target === modal3) modal3.style.display = "none";
        if (event.target === modal4) modal4.style.display = "none";
    });
});