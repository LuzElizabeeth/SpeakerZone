<?php
session_start();
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
    if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

    $email = $conn->real_escape_string($_POST["email"]);
    $password = $_POST["password"];

    $sql = "SELECT * FROM usuarios WHERE email='$email'";
    $result = $conn->query($sql);
    if ($result && $row = $result->fetch_assoc()) {
        if (!password_verify($password, $row["password"])) {
            $error = "Contraseña incorrecta.";
        } elseif (!$row["confirmado"]) {
            $error = "Debes confirmar tu cuenta antes de iniciar sesión. Revisa tu correo.";
        } else {
            $_SESSION["usuario_id"] = $row["id"];
            $_SESSION["usuario_nombre"] = $row["nombre"];
            $_SESSION["usuario_tipo"] = $row["tipo"];
            header("Location: home.php");
            exit();
        }
    } else {
        $error = "Usuario no encontrado.";
    }

    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Iniciar Sesión - SpeakerZone</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container-bg">
        <div class="form-card">
            <h2>Iniciar Sesión</h2>
            <?php if (isset($error)) echo "<p class='error-msg'>$error</p>"; ?>
            <form method="POST" class="registro-form">
                <label>Email:</label>
                <input type="email" name="email" required>
                <label>Contraseña:</label>
                <input type="password" name="password" required>
                <button type="submit">Ingresar</button>
            </form>
            <p class="login-link">¿No tienes cuenta? <a href="register.php">Regístrate aquí</a></p>
            <!-- Botón para regresar a la página de inicio -->
            <div style="text-align:center; margin-top:20px;">
                <a href="index.php" class="btn" style="background:#4a6fa5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Regresar al inicio</a>
            </div>
        </div>
    </div>
</body>
</html>