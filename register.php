<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Conexión a la base de datos
    $conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
    if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

    $nombre = $conn->real_escape_string($_POST["nombre"]);
    $email = $conn->real_escape_string($_POST["email"]);
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $tipo = $conn->real_escape_string($_POST["tipo"]);

    $sql = "INSERT INTO usuarios (nombre, email, password, tipo) VALUES ('$nombre', '$email', '$password', '$tipo')";
    if ($conn->query($sql) === TRUE) {
        header("Location: login.php");
        exit();
    } else {
        $error = "Error: " . $conn->error;
    }
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registro - SpeakerZone</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2>Registro a la SpeakerZone</h2>
    <?php if (isset($error)) echo "<p style='color:red'>$error</p>"; ?>
    <form method="POST">
        <label>Nombre:</label><br>
        <input type="text" name="nombre" required><br>
        <label>Email:</label><br>
        <input type="email" name="email" required><br>
        <label>Contraseña:</label><br>
        <input type="password" name="password" required><br>
        <label>Tipo de usuario:</label><br>
        <select name="tipo" required>
            <option value="presentador">Presentador</option>
            <option value="asistente">Asistente</option>
            <option value="organizador">Organizador</option>
        </select><br><br>
        <button type="submit">Registrarse</button>
    </form>
    <p>¿Ya tienes cuenta? <a href="login.php">Inicia sesión</a></p>
</body>
</html>