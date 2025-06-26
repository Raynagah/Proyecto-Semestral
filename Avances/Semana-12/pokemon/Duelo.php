<?php
// Configuración de la base de datos
$host = '127.0.0.1';
$usuario = 'root';
$password = '';
$basedatos = 'duelo';
$puerto = 3306;

// Conectar a la base de datos
$conn = new mysqli($host, $usuario, $password, $basedatos, $puerto);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

// Obtener pokémon del jugador (id=1)
$sql_jugador = "SELECT * FROM pokemones WHERE id = 1";
$result_jugador = $conn->query($sql_jugador);
$jugador = $result_jugador->fetch_assoc();

// Obtener pokémon del rival (id=2)
$sql_rival = "SELECT * FROM pokemones WHERE id = 2";
$result_rival = $conn->query($sql_rival);
$rival = $result_rival->fetch_assoc();

// Si no se encuentra alguno, redirigir a index
if (!$jugador || !$rival) {
    header('Location: index.html');
    exit;
}

// Cerrar conexión
$conn->close();

// Construir URLs de los sprites
$sprite_jugador = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/{$jugador['pokedex']}.png";
$sprite_rival = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{$rival['pokedex']}.png";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Duelo Pokémon</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="css/duelo.css">
</head>
<body>
    <div class="duelo-container">
        <div class="header">
            <h1><i class="fas fa-bolt"></i> DUELO POKÉMON <i class="fas fa-shield-alt"></i></h1>
        </div>
        
        <!-- Sección Pokémon Rival (id=2) -->
        <div class="rival-section">
            <div class="pokemon-display rival">
                <div class="pokemon-info">
                    <h2><?php echo htmlspecialchars($rival['nombre']); ?> <span class="type-icon" id="rival-type-icon"></span></h2>
                    <div class="health-bar-container">
                        <div class="health-bar" id="rival-health-bar" style="width: 100%"></div>
                    </div>
                    <div class="health-text" id="rival-health-text">200 / 200 HP</div>
                </div>
                <img src="<?php echo $sprite_rival; ?>" class="pokemon-sprite" id="rival-sprite" alt="Pokémon Rival">
            </div>
        </div>
        
        <!-- Zona de Batalla -->
        <div class="battle-section">
            <div class="battle-arena">
                <div class="arena-pattern"></div>
                <div class="battle-circle">
                    <div class="vs-text">VS</div>
                </div>
            </div>
        </div>
        
        <!-- Sección Pokémon Jugador (id=1) -->
        <div class="player-section">
            <div class="pokemon-display player">
                <img src="<?php echo $sprite_jugador; ?>" class="pokemon-sprite" id="player-sprite" alt="Pokémon Jugador">
                <div class="pokemon-info">
                    <h2><?php echo htmlspecialchars($jugador['nombre']); ?> <span class="type-icon" id="player-type-icon"></span></h2>
                    <div class="health-bar-container">
                        <div class="health-bar" id="player-health-bar" style="width: 100%"></div>
                    </div>
                    <div class="health-text" id="player-health-text">200 / 200 HP</div>
                </div>
            </div>
        </div>
        
        <!-- Botones de Movimientos -->
        <div class="moves-container">
            <button class="move-btn" id="move-1"><?php echo htmlspecialchars($jugador['ataque1']); ?> <span class="type-icon" id="move-type-1"></span></button>
            <button class="move-btn" id="move-2"><?php echo htmlspecialchars($jugador['ataque2']); ?> <span class="type-icon" id="move-type-2"></span></button>
            <button class="move-btn" id="move-3"><?php echo htmlspecialchars($jugador['ataque3']); ?> <span class="type-icon" id="move-type-3"></span></button>
            <button class="move-btn" id="move-4"><?php echo htmlspecialchars($jugador['ataque4']); ?> <span class="type-icon" id="move-type-4"></span></button>
        </div>
        
        <!-- Botones de Control -->
        <div class="control-buttons">
            <button class="control-btn terminar-btn" onclick="terminarBatalla()"><i class="fas fa-flag"></i> Terminar Batalla</button>
            <button class="control-btn volver-btn" onclick="volverAlMenu()"><i class="fas fa-home"></i> Volver al Menú</button>
        </div>
        
        <!-- Mensaje de batalla -->
        <div class="battle-message" id="battleMessage">¡Comienza la batalla!</div>
    </div>
    
    <script>
        // Datos de los Pokémon desde PHP
        const pokemonJugador = {
            id: <?php echo $jugador['id']; ?>,
            nombre: "<?php echo htmlspecialchars($jugador['nombre']); ?>",
            pokedex: <?php echo $jugador['pokedex']; ?>,
            vidaActual: 200,
            vidaMaxima: 200,
            movimientos: [
                "<?php echo htmlspecialchars($jugador['ataque1']); ?>",
                "<?php echo htmlspecialchars($jugador['ataque2']); ?>",
                "<?php echo htmlspecialchars($jugador['ataque3']); ?>",
                "<?php echo htmlspecialchars($jugador['ataque4']); ?>"
            ]
        };
        
        const pokemonRival = {
            id: <?php echo $rival['id']; ?>,
            nombre: "<?php echo htmlspecialchars($rival['nombre']); ?>",
            pokedex: <?php echo $rival['pokedex']; ?>,
            vidaActual: 200,
            vidaMaxima: 200,
            movimientos: [
                "<?php echo htmlspecialchars($rival['ataque1']); ?>",
                "<?php echo htmlspecialchars($rival['ataque2']); ?>",
                "<?php echo htmlspecialchars($rival['ataque3']); ?>",
                "<?php echo htmlspecialchars($rival['ataque4']); ?>"
            ]
        };
        
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

        window.addEventListener('DOMContentLoaded', traducirMovimientosEnPantalla);
        
        
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

        
        // Asignar eventos a los botones de movimiento
        document.querySelectorAll('.move-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (pokemonJugador.vidaActual > 0 && pokemonRival.vidaActual > 0) {
                    simularAtaque(index);
                }
            });
        });
        
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
        
        // Inicializar la página
        window.onload = inicializarTipos;
    </script>
</body>
</html>