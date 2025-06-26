<?php
// Mostrar errores para depuración
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

// Eliminar todos los registros de la tabla pokemones
$sql = "TRUNCATE TABLE pokemones";
if (!$conn->query($sql)) {
    die("Error al borrar los pokemones: " . $conn->error);
}

// Obtener la página a redirigir desde GET (validar para evitar inyección)
$paginas_validas = [
    'EleccionJugadorRvR.html',
    'EleccionJugadorEvR.html',
    'EleccionJugadorEvE.html'
];

$redirect = $_GET['redir'] ?? '';
if (!in_array($redirect, $paginas_validas)) {
    $redirect = 'index.html'; // fallback seguro
}

// Redirigir a la página seleccionada
header("Location: ../$redirect");
exit;
