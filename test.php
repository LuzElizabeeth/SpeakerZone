<?php
// Incluir los archivos necesarios
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configuración SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'speakerzone0@gmail.com';
    $mail->Password = 'mhmt erxk nioq lszk'; // NO tu clave normal
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Datos del mensaje
    $mail->setFrom('tu_correo@gmail.com', 'Tu Nombre');
    $mail->addAddress('destino@example.com', 'Receptor');
    $mail->Subject = 'Correo desde PHPMailer sin Composer';
    $mail->Body    = '¡Hola! Este correo fue enviado sin usar Composer.';

    $mail->send();
    echo 'Correo enviado correctamente';
} catch (Exception $e) {
    echo 'Error al enviar: ' . $mail->ErrorInfo;
}
