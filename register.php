<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Conexión a la base de datos
    $conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
    if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

    // Recoger datos del formulario
    $nombre = $conn->real_escape_string($_POST["nombre"]);
    $email = $conn->real_escape_string($_POST["email"]);
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $tipo = $conn->real_escape_string($_POST["tipo"]);

    // Generar token de confirmación y fecha de expiración (ej. 24h)
    $token = bin2hex(random_bytes(16));
    $expira = date("Y-m-d H:i:s", time() + 86400); // +1 día

    // Insertar en la base de datos
    $sql = "INSERT INTO usuarios (nombre, email, password, tipo, token_confirmacion, token_expira) 
            VALUES ('$nombre', '$email', '$password', '$tipo', '$token', '$expira')";

    if ($conn->query($sql) === TRUE) {
        // Enviar correo de confirmación

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'speakerzone0@gmail.com';
            $mail->Password = 'mhmt erxk nioq lszk'; // NO tu clave normal
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom('TU_CORREO@gmail.com', 'SpeakerZone');
            $mail->addAddress($email, $nombre);

            $mail->isHTML(true);
            $mail->Subject = 'Confirma tu cuenta en SpeakerZone';
            $mail->Body    = "
                <h2>Hola, $nombre</h2>
                <p>Gracias por registrarte en SpeakerZone.</p>
                <p>Tu token de confirmacion es el siguiente. No lo compartas con nadie.</p>
                <b>$token</b>
                <p>Este enlace expirará en 24 horas.</p>
            ";

            $mail->send();
            header("Location: confirmar.php");
            exit();
        } catch (Exception $e) {
            $error = "No se pudo enviar el correo de confirmación. Error: " . $mail->ErrorInfo;
        }
    } else {
        $error = "Error al registrar: " . $conn->error;
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