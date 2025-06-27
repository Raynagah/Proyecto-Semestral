// Mapa de tipos de Pokémon para iconos
const typeIcons = {
    'Fuego': 'img/tipoPokemon/Fuego.webp',
    'Agua': 'img/tipoPokemon/Agua.webp',
    'Planta': 'img/tipoPokemon/Planta.webp',
    'Eléctrico': 'img/tipoPokemon/Eléctrico.webp',
    'Hielo': 'img/tipoPokemon/Hielo.webp',
    'Lucha': 'img/tipoPokemon/Lucha.webp',
    'Veneno': 'img/tipoPokemon/Veneno.webp',
    'Tierra': 'img/tipoPokemon/Tierra.webp',
    'Volador': 'img/tipoPokemon/Volador.webp',
    'Psíquico': 'img/tipoPokemon/Psíquico.webp',
    'Bicho': 'img/tipoPokemon/Bicho.webp',
    'Roca': 'img/tipoPokemon/Roca.webp',
    'Fantasma': 'img/tipoPokemon/Fantasma.webp',
    'Dragón': 'img/tipoPokemon/Dragón.webp',
    'Siniestro': 'img/tipoPokemon/Siniestro.webp',
    'Acero': 'img/tipoPokemon/Acero.webp',
    'Hada': 'img/tipoPokemon/Hada.webp',
    'Normal': 'img/tipoPokemon/Normal.webp'
};

function traducirTipo(tipoEnIngles) {
    const traducciones = {
        'normal': 'Normal',
        'fire': 'Fuego',
        'water': 'Agua',
        'electric': 'Eléctrico',
        'grass': 'Planta',
        'ice': 'Hielo',
        'fighting': 'Lucha',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'flying': 'Volador',
        'psychic': 'Psíquico',
        'bug': 'Bicho',
        'rock': 'Roca',
        'ghost': 'Fantasma',
        'dragon': 'Dragón',
        'dark': 'Siniestro',
        'steel': 'Acero',
        'fairy': 'Hada'
    };
    return traducciones[tipoEnIngles.toLowerCase()] || 'Normal';
}

async function traducirMovimiento(nombreIngles) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${nombreIngles}`);
        const data = await response.json();
        const nombreEsp = data.names.find(n => n.language.name === 'es');
        return nombreEsp ? nombreEsp.name : nombreIngles;
    } catch (error) {
        console.error('Error traduciendo el movimiento:', error);
        return nombreIngles;
    }
}

// Reemplazar el texto de los botones al cargar la página
async function traducirMovimientosEnPantalla() {
    for (let i = 1; i <= 4; i++) {
        const boton = document.getElementById(`move-${i}`);
        const textoOriginal = boton.innerText.trim();
        const nombreFormateado = textoOriginal
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s/g, '-')
            .replace(/[^\w-]/g, '');

        const nombreTraducido = await traducirMovimiento(nombreFormateado);
        boton.childNodes[0].nodeValue = nombreTraducido + ' '; // Mantener el span del ícono
    }
}

// Función para inicializar tipos e iconos
async function inicializarTipos() {
    const tiposJugador = await obtenerTipoPokemonDesdeAPI(pokemonJugador.nombre);
    const tiposRival = await obtenerTipoPokemonDesdeAPI(pokemonRival.nombre);

    document.getElementById('player-type-icon').style.backgroundImage =
        `url('${typeIcons[formatearTipo(tiposJugador[0])] || typeIcons['Normal']}')`;

    document.getElementById('rival-type-icon').style.backgroundImage =
        `url('${typeIcons[formatearTipo(tiposRival[0])] || typeIcons['Normal']}')`;

    for (let i = 1; i <= 4; i++) {
        const moveName = pokemonJugador.movimientos[i - 1];
        const tipoMovimiento = await obtenerTipoMovimientoDesdeAPI(moveName);
        const typeIcon = document.getElementById(`move-type-${i}`);
        typeIcon.style.backgroundImage =
            `url('${typeIcons[formatearTipo(tipoMovimiento)] || typeIcons['Normal']}')`;
    }
}

function formatearTipo(tipoIngles) {
    const traducciones = {
        'normal': 'Normal',
        'fire': 'Fuego',
        'water': 'Agua',
        'electric': 'Eléctrico',
        'grass': 'Planta',
        'ice': 'Hielo',
        'fighting': 'Lucha',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'flying': 'Volador',
        'psychic': 'Psíquico',
        'bug': 'Bicho',
        'rock': 'Roca',
        'ghost': 'Fantasma',
        'dragon': 'Dragón',
        'dark': 'Siniestro',
        'steel': 'Acero',
        'fairy': 'Hada'
    };
    return traducciones[tipoIngles.toLowerCase()] || 'Normal';
}

// Función para simular un ataque
async function simularAtaque(moveIndex) {
    const moveNameIngles = pokemonJugador.movimientos[moveIndex];

    // Obtener el nombre en español desde la PokéAPI
    let moveNameEspanol = moveNameIngles; // Por defecto, usar el nombre original
    try {
        const nombreFormateado = moveNameIngles
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s/g, '-')
            .replace(/[^\w-]/g, '');

        const response = await fetch(`https://pokeapi.co/api/v2/move/${nombreFormateado}`);
        const data = await response.json();

        const nombreEnEspanol = data.names.find(n => n.language.name === 'es');
        if (nombreEnEspanol) {
            moveNameEspanol = nombreEnEspanol.name;
        }
    } catch (error) {
        console.error(`No se pudo traducir el movimiento '${moveNameIngles}' desde la API:`, error);
    }

    const battleMessage = document.getElementById('battleMessage');
    battleMessage.textContent = `¡${pokemonJugador.nombre} usó ${moveNameEspanol}!`;
    battleMessage.style.display = 'block';

    // Cálculo de daño
    const damage = Math.floor(Math.random() * 20) + 20;
    pokemonRival.vidaActual = Math.max(0, pokemonRival.vidaActual - damage);

    // Actualización de interfaz
    const rivalHealthBar = document.getElementById('rival-health-bar');
    const rivalHealthText = document.getElementById('rival-health-text');
    const healthPercentage = (pokemonRival.vidaActual / pokemonRival.vidaMaxima) * 100;

    rivalHealthBar.style.width = `${healthPercentage}%`;
    rivalHealthText.textContent = `${pokemonRival.vidaActual} / ${pokemonRival.vidaMaxima} HP`;

    // Animación de daño
    const attackAnimation = document.createElement('div');
    attackAnimation.className = 'attack-animation';
    attackAnimation.textContent = `-${damage}`;
    attackAnimation.style.color = '#ff3333';
    attackAnimation.style.left = '70%';
    attackAnimation.style.top = '30%';
    document.querySelector('.rival-section').appendChild(attackAnimation);

    setTimeout(() => {
        attackAnimation.remove();

        if (pokemonRival.vidaActual <= 0) {
            battleMessage.textContent = `¡${pokemonRival.nombre} fue derrotado!`;
            setTimeout(() => {
                alert(`¡Felicidades! Has derrotado a ${pokemonRival.nombre}`);
            }, 1000);
        } else {
            setTimeout(() => {
                simularAtaqueRival();
            }, 1000);
        }
    }, 1000);

    setTimeout(() => {
        battleMessage.style.display = 'none';
    }, 3000);
}

// Función para simular ataque del rival
async function simularAtaqueRival() {
    const moveIndex = Math.floor(Math.random() * pokemonRival.movimientos.length);
    const moveNameIngles = pokemonRival.movimientos[moveIndex];

    // Obtener el nombre del movimiento en español desde la PokéAPI
    let moveNameEspanol = moveNameIngles;
    try {
        const nombreFormateado = moveNameIngles
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s/g, '-')
            .replace(/[^\w-]/g, '');

        const response = await fetch(`https://pokeapi.co/api/v2/move/${nombreFormateado}`);
        const data = await response.json();

        const traduccion = data.names.find(n => n.language.name === 'es');
        if (traduccion) {
            moveNameEspanol = traduccion.name;
        }
    } catch (error) {
        console.error(`Error al traducir el movimiento del rival '${moveNameIngles}':`, error);
    }

    const battleMessage = document.getElementById('battleMessage');
    battleMessage.textContent = `¡${pokemonRival.nombre} usó ${moveNameEspanol}!`;
    battleMessage.style.display = 'block';

    // Calcular daño
    const damage = Math.floor(Math.random() * 20) + 15;
    pokemonJugador.vidaActual = Math.max(0, pokemonJugador.vidaActual - damage);

    // Actualizar vida en UI
    const playerHealthBar = document.getElementById('player-health-bar');
    const playerHealthText = document.getElementById('player-health-text');
    const healthPercentage = (pokemonJugador.vidaActual / pokemonJugador.vidaMaxima) * 100;

    playerHealthBar.style.width = `${healthPercentage}%`;
    playerHealthText.textContent = `${pokemonJugador.vidaActual} / ${pokemonJugador.vidaMaxima} HP`;

    // Animación visual del daño
    const attackAnimation = document.createElement('div');
    attackAnimation.className = 'attack-animation';
    attackAnimation.textContent = `-${damage}`;
    attackAnimation.style.color = '#ff3333';
    attackAnimation.style.left = '30%';
    attackAnimation.style.top = '70%';

    document.querySelector('.player-section').appendChild(attackAnimation);

    setTimeout(() => {
        attackAnimation.remove();

        if (pokemonJugador.vidaActual <= 0) {
            battleMessage.textContent = `¡${pokemonJugador.nombre} fue derrotado!`;
            setTimeout(() => {
                alert(`¡Oh no! ${pokemonJugador.nombre} ha sido derrotado`);
            }, 1000);
        }
    }, 1000);

    setTimeout(() => {
        battleMessage.style.display = 'none';
    }, 3000);
}

// Función para terminar la batalla
function terminarBatalla() {
    if (confirm('¿Estás seguro de que quieres terminar la batalla?')) {
        alert('La batalla ha terminado');
        volverAlMenu();
    }
}

// Función para volver al menú principal
function volverAlMenu() {
    window.location.href = 'PaginaEleccion.html';
}

// Funciones auxiliares para obtener tipos desde la API
async function obtenerTipoPokemonDesdeAPI(nombrePokemon) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);
        const data = await response.json();
        return data.types.map(t => t.type.name);
    } catch (error) {
        console.error('Error obteniendo tipo de Pokémon:', error);
        return ['normal'];
    }
}

async function obtenerTipoMovimientoDesdeAPI(nombreMovimiento) {
    try {
        const nombreFormateado = nombreMovimiento
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s/g, '-')
            .replace(/[^\w-]/g, '');

        const response = await fetch(`https://pokeapi.co/api/v2/move/${nombreFormateado}`);
        const data = await response.json();
        return data.type.name;
    } catch (error) {
        console.error('Error obteniendo tipo de movimiento:', error);
        return 'normal';
    }
}

// Inicializar traducciones al cargar
document.addEventListener('DOMContentLoaded', traducirMovimientosEnPantalla);