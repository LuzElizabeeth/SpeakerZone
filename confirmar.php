<?php
$mensaje = "";
$exito = false;

// Procesar el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["token"])) {
    $conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
    if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

    $token = $conn->real_escape_string($_POST["token"]);

    // Buscar usuario con ese token
    $sql = "SELECT id, token_expira, confirmado FROM usuarios WHERE token_confirmacion = '$token' LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $usuario = $result->fetch_assoc();

        if ($usuario["confirmado"]) {
            $mensaje = "Tu cuenta ya ha sido confirmada anteriormente.";
        } elseif (strtotime($usuario["token_expira"]) < time()) {
            $mensaje = "Este token ha expirado. Solicita uno nuevo.";
        } else {
            // Confirmar cuenta
            $id = $usuario["id"];
            $update = "UPDATE usuarios SET confirmado = 1, token_confirmacion = NULL, token_expira = NULL WHERE id = $id";
            if ($conn->query($update)) {
                $mensaje = "¡Cuenta confirmada con éxito! Ya puedes iniciar sesión.";
                $exito = true;
            } else {
                $mensaje = "Error al confirmar la cuenta.";
            }
        }
    } else {
        $mensaje = "Token inválido. Verifica que lo hayas copiado correctamente.";
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Confirmar cuenta</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 40px; }
        form { margin-top: 20px; }
        input[type="text"] { padding: 8px; width: 300px; }
        button { padding: 10px 20px; margin-top: 10px; }
        .mensaje { margin-top: 20px; font-weight: bold; }
    </style>
</head>
<body>
    <h2>Confirmar cuenta</h2>
    <p>Introduce el token de confirmación que recibiste por correo electrónico:</p>
    <form method="POST">
        <input type="text" name="token" placeholder="Token de confirmación" required>
        <br>
        <button type="submit">Confirmar</button>
    </form>

    <?php if ($mensaje): ?>
        <div class="mensaje" style="color: <?= $exito ? 'green' : 'red' ?>;">
            <?= htmlspecialchars($mensaje) ?>
        </div>
    <?php endif; ?>

    <p><a href="login.php">Volver al inicio de sesión</a></p>
</body>
</html>
