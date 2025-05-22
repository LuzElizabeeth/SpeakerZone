<?php
session_start();
// Solo administradores pueden acceder
if (!isset($_SESSION["usuario_tipo"]) || $_SESSION["usuario_tipo"] !== "presentador") {
    header("Location: login.php");
    exit();
}

$conn = new mysqli("172.17.0.2", "root", "password", "SpeakerZone_db");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

// Crear nueva conferencia
if (isset($_POST["crear"])) {
    $titulo = $conn->real_escape_string($_POST["titulo"]);
    $descripcion = $conn->real_escape_string($_POST["descripcion"]);
    $modalidad = $conn->real_escape_string($_POST["modalidad"]);
    $fecha = $conn->real_escape_string($_POST["fecha"] . " " . $_POST["hora"]);
    $lugar = $conn->real_escape_string($_POST["lugar"]);
    $presentador_id = intval($_POST["presentador_id"]);

    $sql = "INSERT INTO conferencias (titulo, descripcion, modalidad, fecha, lugar, presentador_id) VALUES ('$titulo', '$descripcion', '$modalidad', '$fecha', '$lugar', $presentador_id)";
    $conn->query($sql);
}

// Eliminar conferencia
if (isset($_GET["eliminar"])) {
    $id = intval($_GET["eliminar"]);
    $conn->query("DELETE FROM conferencias WHERE id=$id");
}

// Obtener presentadores (usuarios tipo presentador)
$presentadores = [];
$res = $conn->query("SELECT id, nombre FROM usuarios WHERE tipo='presentador'");
if ($res) while ($p = $res->fetch_assoc()) $presentadores[] = $p;

// Obtener todas las conferencias
$conferencias = [];
$res = $conn->query(
    "SELECT c.*, u.nombre as presentador_nombre 
     FROM conferencias c 
     LEFT JOIN usuarios u ON c.presentador_id = u.id 
     ORDER BY c.fecha"
);
if ($res) while ($c = $res->fetch_assoc()) $conferencias[] = $c;

$conn->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Conferencias - Admin · SpeakerZone</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="topbar">
        <a href="logout.php" class="btn">Cerrar sesión</a>
    </div>
    <div class="admin-container">
        <div class="admin-header">
            <h1>Gestión de Conferencias</h1>
            <a href="index.php" class="btn">Volver a inicio</a>
        </div>
        <!-- Formulario para crear nueva conferencia -->
        <form method="POST" class="conferencia-form">
            <h2 style="color:#4338ca;">Crear nueva conferencia</h2>
            <input type="text" name="titulo" placeholder="Título" required>
            <textarea name="descripcion" placeholder="Descripción"></textarea>
            <select name="modalidad" required>
                <option value="">Selecciona modalidad</option>
                <option value="en linea">En línea</option>
                <option value="presencial">Presencial</option>
            </select>
            <label style="text-align:left;margin:0 0 4px 4px;">Fecha y hora</label>
            <input type="date" name="fecha" required style="width:48%;display:inline-block;">
            <input type="time" name="hora" required style="width:48%;display:inline-block;float:right;">
            <input type="text" name="lugar" placeholder="Lugar">
            <select name="presentador_id">
                <option value="">Sin presentador</option>
                <?php foreach($presentadores as $p): ?>
                    <option value="<?= $p["id"] ?>"><?= htmlspecialchars($p["nombre"]) ?></option>
                <?php endforeach; ?>
            </select>
            <button type="submit" name="crear" class="btn">Crear conferencia</button>
        </form>
        <!-- Tabla de conferencias existentes -->
        <h2 style="color:#4338ca;">Conferencias existentes</h2>
        <table class="conferencias-table">
            <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Modalidad</th>
                <th>Fecha y Hora</th>
                <th>Lugar</th>
                <th>Presentador</th>
                <th>Acciones</th>
            </tr>
            <?php foreach ($conferencias as $c): ?>
            <tr>
                <td><?=htmlspecialchars($c["titulo"])?></td>
                <td><?=htmlspecialchars($c["descripcion"])?></td>
                <td><?=htmlspecialchars($c["modalidad"])?></td>
                <td><?=date('Y-m-d H:i', strtotime($c["fecha"]))?></td>
                <td><?=htmlspecialchars($c["lugar"])?></td>
                <td><?=htmlspecialchars($c["presentador_nombre"] ?? '—')?></td>
                <td class="acciones">
                    <a href="editar_conferencia.php?id=<?=$c["id"]?>" class="edit-link">Editar</a>
                    <a href="admin_conferencias.php?eliminar=<?=$c["id"]?>" class="danger" onclick="return confirm('¿Eliminar esta conferencia?');">Eliminar</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </table>
    </div>
</body>
</html>