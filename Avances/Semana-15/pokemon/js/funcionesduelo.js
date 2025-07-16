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
    // Si ya es un nombre en español, no traducir
    if(!nombreIngles.match(/^[A-Za-z]/)) return nombreIngles;
    
    try {
        const nombreFormateado = nombreIngles
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s/g, '-')
            .replace(/[^\w-]/g, '');

        const response = await fetch(`https://pokeapi.co/api/v2/move/${nombreFormateado}`);
        if(!response.ok) return nombreIngles;
        
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
    // Al inicio del ataque
    document.querySelectorAll('.move-btn').forEach(btn => btn.disabled = true);
    document.querySelectorAll('.control-btn').forEach(btn => btn.disabled = false); // Asegurar que los de control estén habilitados
    
    const moveNameIngles = pokemonJugador.movimientos[moveIndex];
    const moveNameEspanol = await traducirMovimiento(moveNameIngles);
    

    const battleMessage = document.getElementById('battleMessage');
    battleMessage.textContent = `¡${pokemonJugador.nombre} usó ${moveNameEspanol}!`;
    battleMessage.style.display = 'block';
    
    // Animación del Pokémon jugador atacando
    const playerSprite = document.getElementById('player-sprite');
    playerSprite.classList.add('attack-effect');
    
    setTimeout(() => {
        playerSprite.classList.remove('attack-effect');
        
        // Cálculo de daño
        const damage = Math.floor(Math.random() * 20) + 20;
        const isCritical = Math.random() < 0.1; // 10% de probabilidad de crítico
        const actualDamage = isCritical ? damage * 1.5 : damage;
        
        pokemonRival.vidaActual = Math.max(0, pokemonRival.vidaActual - actualDamage);
        
        // Actualizar barra de vida del rival
        actualizarBarraVida('rival', pokemonRival.vidaActual, pokemonRival.vidaMaxima);
        
        // Animaciones de daño en el rival
        const rivalSprite = document.getElementById('rival-sprite');
        rivalSprite.classList.add('damage-effect', 'shake-horizontal');
        
        // Crear efecto visual de golpe
        const hitEffect = document.createElement('div');
        hitEffect.className = 'hit-effect';
        rivalSprite.parentElement.appendChild(hitEffect);
        
        // Mostrar número de daño
        const damageNumber = document.createElement('div');
        damageNumber.className = 'damage-number';
        damageNumber.textContent = `-${Math.round(actualDamage)}`;
        if (isCritical) {
            damageNumber.textContent += '!';
            damageNumber.classList.add('critical-hit');
        }
        damageNumber.style.left = `${Math.random() * 70 + 15}%`;
        damageNumber.style.top = '30%';
        rivalSprite.parentElement.appendChild(damageNumber);

        setTimeout(() => {
            rivalSprite.classList.remove('damage-effect', 'shake-horizontal');
            hitEffect.remove();
            damageNumber.remove();

            if (pokemonRival.vidaActual <= 0) {
    battleMessage.textContent = `¡${pokemonRival.nombre} fue derrotado!`;
    setTimeout(() => {
        battleMessage.textContent = '¡Has ganado el combate! Redirigiendo al menú...';
        
        // Mostrar cuenta regresiva opcional
        let segundos = 5;
        const intervalo = setInterval(() => {
            battleMessage.textContent = `¡Has ganado! Redirigiendo en ${segundos--}...`;
            if (segundos < 0) clearInterval(intervalo);
        }, 1000);
        
        redirigirAlMenu();
    }, 1000);
} else {
                // Continuar con el turno del rival
                setTimeout(() => simularAtaqueRival(), 1000);
            }
        }, 1000);
    }, 500);
}

// Función para simular ataque del rival
 async function simularAtaqueRival() {

    const moveIndex = Math.floor(Math.random() * pokemonRival.movimientos.length);
    const moveNameIngles = pokemonRival.movimientos[moveIndex];
    const moveNameEspanol = await traducirMovimiento(moveNameIngles);
    
    const battleMessage = document.getElementById('battleMessage');
    battleMessage.textContent = `¡${pokemonRival.nombre} usó ${moveNameEspanol}!`;
    battleMessage.style.display = 'block';

    // Animación de ataque del rival
    const rivalSprite = document.getElementById('rival-sprite');
    rivalSprite.classList.add('attack-effect');

    setTimeout(() => {
        rivalSprite.classList.remove('attack-effect');

        // Calcular daño
        const damage = Math.floor(Math.random() * 20) + 15;
        pokemonJugador.vidaActual = Math.max(0, pokemonJugador.vidaActual - damage);
        
        // Actualizar barra de vida del jugador
        actualizarBarraVida('player', pokemonJugador.vidaActual, pokemonJugador.vidaMaxima);

        // Animación de daño en el jugador
        const playerSprite = document.getElementById('player-sprite');
        playerSprite.classList.add('damage-effect', 'shake-horizontal');

        // Efecto visual de golpe
        const hitEffect = document.createElement('div');
        hitEffect.className = 'hit-effect';
        playerSprite.parentElement.appendChild(hitEffect);

        // Número de daño
        const damageNumber = document.createElement('div');
        damageNumber.className = 'damage-number';
        damageNumber.textContent = `-${damage}`;
        damageNumber.style.left = `${Math.random() * 70 + 15}%`;
        damageNumber.style.top = '30%';
        playerSprite.parentElement.appendChild(damageNumber);

        setTimeout(() => {
            playerSprite.classList.remove('damage-effect', 'shake-horizontal');
            hitEffect.remove();
            damageNumber.remove();

            if (pokemonJugador.vidaActual <= 0) {
    battleMessage.textContent = `¡${pokemonJugador.nombre} fue derrotado!`;
    setTimeout(() => {
        battleMessage.textContent = '¡Has perdido el combate! Redirigiendo al menú...';
        
        // Mostrar cuenta regresiva opcional
        let segundos = 5;
        const intervalo = setInterval(() => {
            battleMessage.textContent = `¡Has perdido! Redirigiendo en ${segundos--}...`;
            if (segundos < 0) clearInterval(intervalo);
        }, 1000);
        
        redirigirAlMenu();
    }, 1000);
} else {
                // Habilitar botones para nuevo turno
                document.querySelectorAll('.move-btn').forEach(btn => {
                    btn.disabled = false;
                });
                battleMessage.textContent = '¿Qué movimiento usarás?';
            }
        }, 1000);
    }, 500);
}
function manejarFinCombate(ganador) {
    const battleMessage = document.getElementById('battleMessage');
    const mensaje = ganador ? '¡Has ganado el combate!' : '¡Has perdido el combate!';
    
    battleMessage.textContent = `${mensaje} Redirigiendo al menú en 5 segundos...`;
    
    // Deshabilitar todos los botones
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);
    
    // Mostrar cuenta regresiva
    let segundos = 5;
    const intervalo = setInterval(() => {
        battleMessage.textContent = `${mensaje} Redirigiendo en ${segundos--}...`;
        if (segundos < 0) clearInterval(intervalo);
    }, 1000);
    
    // Redirigir después de 5 segundos
    setTimeout(() => {
        window.location.href = 'PaginaEleccion.html'; // Ajusta esta URL
    }, 5000);
}

function actualizarBarraVida(target, vidaActual, vidaMaxima) {
            const healthBar = document.getElementById(`${target}-health-bar`);
            const healthText = document.getElementById(`${target}-health-text`);
            const porcentaje = (vidaActual / vidaMaxima) * 100;

            healthBar.style.width = `${porcentaje}%`;
            healthText.textContent = `${vidaActual} / ${vidaMaxima} HP`;
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

function redirigirAlMenu() {
    setTimeout(() => {
        window.location.href = 'PaginaEleccion.html'; // Ajusta esta URL a tu menú principal
    }, 5000); // 5000 milisegundos = 5 segundos
}

// Inicializar traducciones al cargar
document.addEventListener('DOMContentLoaded', traducirMovimientosEnPantalla);
