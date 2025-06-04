<?php
session_start();
if (!isset($_SESSION["usuario_id"]) || $_SESSION["usuario_tipo"] != "presentador") {
    header("Location: login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["conferencia_id"])) {
    $conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
    
    // Verificar que el presentador es el dueño de la conferencia
    $stmt = $conn->prepare("DELETE FROM conferencias WHERE id = ? AND presentador_id = ?");
    $stmt->bind_param("ii", $_POST["conferencia_id"], $_SESSION["usuario_id"]);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        header("Location: index.php?msg=Conferencia eliminada correctamente");
    } else {
        header("Location: index.php?msg=Error al eliminar la conferencia o no tienes permiso");
    }
    exit();
}

header("Location: index.php");
?>