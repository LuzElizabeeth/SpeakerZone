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
    <!-- Iconos de Font Awesome para el icono de casita -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        .home-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #4a6fa5;
            color: #fff;
            padding: 10px 24px;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 500;
            border: none;
            text-decoration: none;
            box-shadow: 0 2px 8px #0001;
            margin-bottom: 30px;
            margin-top: 30px;
            transition: background 0.2s;
        }
        .home-btn i {
            font-size: 1.3em;
        }
        .home-btn:hover {
            background: #166088;
            color: #fff;
            text-decoration: none;
        }
        .container-bg {
            margin-top: 0;
        }
    </style>
</head>
<body>
    <!-- Botón fuera de la card -->
    <div style="width:100%; display:flex; justify-content:center;">
        <a href="index.php" class="home-btn">
            <i class="fas fa-home"></i> Ir a inicio
        </a>
    </div>
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
        </div>
    </div>
</body>
</html>