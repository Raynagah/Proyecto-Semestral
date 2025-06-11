<?php
// Mostrar errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = '127.0.0.1';
$usuario = 'root';
$password = '';
$basedatos = 'duelo';
$puerto = 4406;

$conn = new mysqli($host, $usuario, $password, $basedatos, $puerto);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

// 4) Comprobar que realmente hay datos
if (empty($_POST['nombre']) || empty($_POST['pokedex'])) {
    die("No llegaron 'nombre' ni 'pokedex'. Revisa debug_post.log");
}

// 5) Preparar datos
$id      = 1;
$nombre  = $conn->real_escape_string($_POST['nombre']);
$pokedex = intval($_POST['pokedex']);
$mov1    = $conn->real_escape_string($_POST['movimiento1'] ?? '');
$mov2    = $conn->real_escape_string($_POST['movimiento2'] ?? '');
$mov3    = $conn->real_escape_string($_POST['movimiento3'] ?? '');
$mov4    = $conn->real_escape_string($_POST['movimiento4'] ?? '');

// 6) Preparar y ejecutar sentencia
$sql = "
  INSERT INTO pokemones
    (id, nombre, pokedex, ataque1, ataque2, ataque3, ataque4)
  VALUES
    (?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    nombre  = VALUES(nombre),
    pokedex = VALUES(pokedex),
    ataque1 = VALUES(ataque1),
    ataque2 = VALUES(ataque2),
    ataque3 = VALUES(ataque3),
    ataque4 = VALUES(ataque4)
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isissss", $id, $nombre, $pokedex, $mov1, $mov2, $mov3, $mov4);

if (!$stmt->execute()) {
    // Si hay error al ejecutar, lo muestro y detengo
    die("Error al guardar: " . $stmt->error);
}

// 7) Log de éxito
file_put_contents(__DIR__.'/debug_post.log', date('c') . " Guarda OK: id=$id, nombre=$nombre\n", FILE_APPEND);

// 8) Redirigir
header('Location: ../EleccionRivalEvE.html', true, 303);
exit;
?>
