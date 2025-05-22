<?php
session_start();
if (!isset($_SESSION["usuario_tipo"]) || $_SESSION["usuario_tipo"] !== "admin") {
    header("Location: login.php");
    exit();
}
$conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

$id = intval($_GET["id"]);

// Obtener presentadores
$presentadores = [];
$res = $conn->query("SELECT id, nombre FROM usuarios WHERE tipo='presentador'");
if ($res) while ($p = $res->fetch_assoc()) $presentadores[] = $p;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $titulo = $conn->real_escape_string($_POST["titulo"]);
    $descripcion = $conn->real_escape_string($_POST["descripcion"]);
    $modalidad = $conn->real_escape_string($_POST["modalidad"]);
    $fecha = $conn->real_escape_string($_POST["fecha"] . " " . $_POST["hora"]);
    $lugar = $conn->real_escape_string($_POST["lugar"]);
    $presentador_id = intval($_POST["presentador_id"]);
    $conn->query("UPDATE conferencias SET titulo='$titulo', descripcion='$descripcion', modalidad='$modalidad', fecha='$fecha', lugar='$lugar', presentador_id=$presentador_id WHERE id=$id");
    header("Location: admin_conferencias.php");
    exit();
}
$res = $conn->query("SELECT * FROM conferencias WHERE id=$id");
$conferencia = $res->fetch_assoc();
$conn->close();
// Separar fecha y hora
list($fecha_val, $hora_val) = explode(' ', $conferencia["fecha"]);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Conferencia - Admin · SpeakerZone</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="edit-container">
        <h2 style="color:#4338ca;">Editar conferencia</h2>
        <form method="POST">
            <label>Título</label>
            <input type="text" name="titulo" value="<?=htmlspecialchars($conferencia["titulo"])?>" required>
            <label>Descripción</label>
            <textarea name="descripcion"><?=htmlspecialchars($conferencia["descripcion"])?></textarea>
            <label>Modalidad</label>
            <select name="modalidad" required>
                <option value="en linea" <?=($conferencia["modalidad"]=="en linea"?"selected":"")?>>En línea</option>
                <option value="presencial" <?=($conferencia["modalidad"]=="presencial"?"selected":"")?>>Presencial</option>
            </select>
            <label>Fecha y hora</label>
            <input type="date" name="fecha" value="<?=htmlspecialchars($fecha_val)?>" required style="width:48%;display:inline-block;">
            <input type="time" name="hora" value="<?=htmlspecialchars($hora_val)?>" required style="width:48%;display:inline-block;float:right;">
            <label>Lugar</label>
            <input type="text" name="lugar" value="<?=htmlspecialchars($conferencia["lugar"])?>">
            <label>Presentador</label>
            <select name="presentador_id">
                <option value="">Sin presentador</option>
                <?php foreach($presentadores as $p): ?>
                    <option value="<?= $p["id"] ?>" <?=($conferencia["presentador_id"]==$p["id"]?"selected":"")?>><?= htmlspecialchars($p["nombre"]) ?></option>
                <?php endforeach; ?>
            </select>
            <button type="submit" class="btn">Guardar cambios</button>
            <a href="admin_conferencias.php" class="btn">Cancelar</a>
        </form>
    </div>
</body>
</html>