<?php
session_start();
if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

$sql = "SELECT c.*, u.nombre as presentador FROM conferencias c LEFT JOIN usuarios u ON c.presentador_id = u.id ORDER BY c.fecha DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Inicio - SpeakerZone</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2>Bienvenido, <?php echo $_SESSION["usuario_nombre"]; ?>!</h2>
    <?php if (isset($_GET['msg'])) echo "<p style='color:green'>".htmlspecialchars($_GET['msg'])."</p>"; ?>
    <h3>Conferencias disponibles</h3>
    <table border="1">
        <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Modalidad</th>
            <th>Fecha</th>
            <th>Lugar</th>
            <th>Presentador</th>
            <th>Acciones</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?php echo htmlspecialchars($row["titulo"]); ?></td>
            <td><?php echo htmlspecialchars($row["descripcion"]); ?></td>
            <td><?php echo htmlspecialchars($row["modalidad"]); ?></td>
            <td><?php echo htmlspecialchars($row["fecha"]); ?></td>
            <td><?php echo htmlspecialchars($row["lugar"]); ?></td>
            <td><?php echo htmlspecialchars($row["presentador"]); ?></td>
            <td>
                <?php if ($_SESSION["usuario_tipo"] == "asistente"): ?>
                    <form method="POST" action="inscribirse.php" style="display:inline;">
                        <input type="hidden" name="conferencia_id" value="<?php echo $row["id"]; ?>">
                        <button type="submit">Inscribirse</button>
                    </form>
                <?php endif; ?>
                <?php if ($_SESSION["usuario_tipo"] == "presentador" && $_SESSION["usuario_id"] == $row["presentador_id"]): ?>
                    <a href="editar_conferencia.php?id=<?php echo $row["id"]; ?>">Editar</a>
                <?php endif; ?>
            </td>
        </tr>
        <?php endwhile; ?>
    </table>
    <?php if ($_SESSION["usuario_tipo"] == "presentador"): ?>
        <!-- Cambiado a formulario que redirecciona a admin_conferencias.php -->
        <form method="get" action="admin_conferencias.php" style="margin-top:20px;">
            <button type="submit">Crear nueva conferencia</button>
        </form>
    <?php endif; ?>
    <p><a href="logout.php">Cerrar sesión</a></p>
</body>
</html>
<?php $conn->close(); ?>