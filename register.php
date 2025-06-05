<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
    if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

    $nombre = $conn->real_escape_string($_POST["nombre"]);
    $email = $conn->real_escape_string($_POST["email"]);
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $tipo = $conn->real_escape_string($_POST["tipo"]);

    // Verificar si el email ya está registrado
    $check = $conn->query("SELECT id FROM usuarios WHERE email = '$email' LIMIT 1");
    if ($check && $check->num_rows > 0) {
        $error = "El correo ya está registrado. <a href='login.php'>Inicia sesión</a> o utiliza otro correo.";
    } else {
        $token = bin2hex(random_bytes(16));
        $expira = date("Y-m-d H:i:s", time() + 86400);

        $sql = "INSERT INTO usuarios (nombre, email, password, tipo, token_confirmacion, token_expira) 
                VALUES ('$nombre', '$email', '$password', '$tipo', '$token', '$expira')";

        if ($conn->query($sql) === TRUE) {
            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'speakerzone0@gmail.com';
                $mail->Password = 'mhmt erxk nioq lszk';
                $mail->SMTPSecure = 'tls';
                $mail->Port = 587;

                $mail->setFrom('TU_CORREO@gmail.com', 'SpeakerZone');
                $mail->addAddress($email, $nombre);

                $mail->isHTML(true);
                $mail->Subject = 'Confirma tu cuenta en SpeakerZone';
                $mail->Body    = "
                    <h2>Hola, $nombre</h2>
                    <p>Gracias por registrarte en SpeakerZone.</p>
                    <p>Tu token de confirmación es el siguiente. No lo compartas con nadie.</p>
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
    <div class="container-bg">
        <div class="form-card">
            <h2>Registro a SpeakerZone</h2>
            <?php if (isset($error)) echo "<p class='error-msg'>$error</p>"; ?>
            <form method="POST" class="registro-form">
                <label>Nombre:</label>
                <input type="text" name="nombre" required>
                <label>Email:</label>
                <input type="email" name="email" required>
                <label>Contraseña:</label>
                <input type="password" name="password" required>
                <label>Tipo de usuario:</label>
                <select name="tipo" required>
                    <option value="presentador">Presentador</option>
                    <option value="asistente">Asistente</option>
                    <option value="organizador">Organizador</option>
                </select>
                <button type="submit">Registrarse</button>
            </form>
            <p class="login-link">¿Ya tienes cuenta? <a href="login.php">Inicia sesión</a></p>
        </div>
    </div>
</body>
</html>