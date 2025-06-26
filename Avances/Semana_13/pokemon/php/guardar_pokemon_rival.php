<?php
// Mostrar errores para depuración
file_put_contents(__DIR__.'/debug_post.log', print_r($_POST, true));
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = '127.0.0.1';
$usuario = 'root';
$password = '';
$basedatos = 'duelo';
$puerto = 3306;

$conn = new mysqli($host, $usuario, $password, $basedatos, $puerto);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

// Verificar que se recibieron los datos necesarios
if (empty($_POST['nombre']) || empty($_POST['pokedex'])) {
    die("No llegaron 'nombre' ni 'pokedex'. Revisa debug_post_rival.log");
}

// Preparar datos
$id = 2; // Aquí el id es 2 porque es el rival
$nombre = $conn->real_escape_string($_POST['nombre']);
$pokedex = intval($_POST['pokedex']);
$mov1 = $conn->real_escape_string($_POST['movimiento1'] ?? '');
$mov2 = $conn->real_escape_string($_POST['movimiento2'] ?? '');
$mov3 = $conn->real_escape_string($_POST['movimiento3'] ?? '');
$mov4 = $conn->real_escape_string($_POST['movimiento4'] ?? '');

// Preparar y ejecutar sentencia con ON DUPLICATE KEY UPDATE (si id es PRIMARY KEY)
$sql = "
  INSERT INTO pokemones
    (id, nombre, pokedex, ataque1, ataque2, ataque3, ataque4)
  VALUES
    (?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    pokedex = VALUES(pokedex),
    ataque1 = VALUES(ataque1),
    ataque2 = VALUES(ataque2),
    ataque3 = VALUES(ataque3),
    ataque4 = VALUES(ataque4)
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("Error al preparar la consulta: " . $conn->error);
}

$stmt->bind_param("isissss", $id, $nombre, $pokedex, $mov1, $mov2, $mov3, $mov4);

if (!$stmt->execute()) {
    die("Error al guardar: " . $stmt->error);
}

// Log de éxito
file_put_contents(__DIR__ . '/debug_post_rival.log', date('c') . " Guarda OK: id=$id, nombre=$nombre\n", FILE_APPEND);

// Redirigir a la página rival después de guardar
header('Location: ../Duelo.html', true, 303);
exit;
