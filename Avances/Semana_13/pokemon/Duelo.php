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
    
    <script src="js/funcionesduelo.js"></script>
    <script>
        // Pasar datos PHP a JavaScript
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
        
        // Inicializar la página
        window.onload = function() {
            inicializarTipos();
            // Asignar eventos a los botones de movimiento
            document.querySelectorAll('.move-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    if (pokemonJugador.vidaActual > 0 && pokemonRival.vidaActual > 0) {
                        simularAtaque(index);
                    }
                });
            });
        };
    </script>
</body>
</html>