<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// Verifica que el usuario esté logueado y sea asistente
if (!isset($_SESSION["usuario_id"]) || $_SESSION["usuario_tipo"] !== "asistente") {
    die("Debes iniciar sesión como asistente para inscribirte.");
}

// Validación del ID de conferencia recibido por POST
if (!isset($_POST["conferencia_id"])) {
    die("Conferencia no especificada.");
}

$usuario_id = $_SESSION["usuario_id"];
$conferencia_id = intval($_POST["conferencia_id"]);

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Verifica que la conferencia exista
$stmt = $conn->prepare("SELECT id FROM conferencias WHERE id = ?");
$stmt->bind_param("i", $conferencia_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    die("La conferencia no existe.");
}
$stmt->close();

// Verifica si ya está inscrito el usuario a esta conferencia
$stmt = $conn->prepare("SELECT id FROM inscripciones WHERE usuario_id = ? AND conferencia_id = ?");
$stmt->bind_param("ii", $usuario_id, $conferencia_id);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    $stmt->close();
    $conn->close();
    die("Ya estás inscrito en esta conferencia.");
}
$stmt->close();

// Inserta la inscripción
$stmt = $conn->prepare("INSERT INTO inscripciones (usuario_id, conferencia_id, fecha_inscripcion) VALUES (?, ?, NOW())");
$stmt->bind_param("ii", $usuario_id, $conferencia_id);
if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    // Puedes hacer header() aquí si todo está OK
    header("Location: index.php?msg=¡Inscripción exitosa! Recibirás un correo con la confirmación.");
    exit();
} else {
    $stmt->close();
    $conn->close();
    die("Error al registrar la inscripción, intenta de nuevo.");
}
?>