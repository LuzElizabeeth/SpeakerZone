<?php
// Ejemplo de conferencias (en producción, obtén esto de la base de datos)
$conferencias = [
    [
        "titulo" => "Inteligencia Artificial en la Educación",
        "descripcion" => "Explora cómo la IA está revolucionando el aprendizaje.",
        "fecha" => "2025-06-05",
        "ponente" => "Dra. Ana Robles"
    ],
    [
        "titulo" => "Desarrollo Web Moderno",
        "descripcion" => "Tendencias y herramientas para el 2025.",
        "fecha" => "2025-06-10",
        "ponente" => "Ing. Luis Méndez"
    ]
];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Bienvenido a SpeakerZone</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* Barra superior */
        .topbar {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 22px 40px 0 0;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
        }
        .topbar .btn {
            margin-left: 10px;
        }
        .btn {
            padding: 9px 24px;
            background: linear-gradient(90deg,#6366f1 0%, #06b6d4 100%);
            color: #fff;
            border: none;
            border-radius: 7px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(80,86,150,0.07);
            transition: background 0.15s, transform 0.1s;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: linear-gradient(90deg,#312e81 0%, #0ea5e9 100%);
            transform: scale(1.04);
            color: #fff;
        }
        /* Hero principal */
        .hero {
            margin: 110px auto 0 auto;
            max-width: 600px;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 6px 32px rgba(80,86,150,0.12), 0 1.5px 3px rgba(0,0,0,0.04);
            padding: 48px 36px 38px 36px;
            text-align: center;
        }
        .hero h1 {
            font-size: 2.4em;
            color: #312e81;
            margin-bottom: 16px;
        }
        .hero p {
            color: #374151;
            font-size: 1.13em;
            margin-bottom: 32px;
            line-height: 1.7;
        }
        .hero-img {
            width: 110px;
            margin-bottom: 18px;
            filter: drop-shadow(0 5px 15px #6366f13a);
        }
        .accent {
            color: #0ea5e9;
            font-weight: bold;
        }
        /* Lista de conferencias */
        .conferencias-section {
            margin: 40px auto 0 auto;
            max-width: 750px;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 6px 32px rgba(80,86,150,0.11), 0 1.5px 3px rgba(0,0,0,0.03);
            padding: 34px 30px 28px 30px;
        }
        .conferencias-section h2 {
            color: #4338ca;
            margin-bottom: 16px;
        }
        .conferencias-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .conferencia-item {
            border-bottom: 1px solid #f3f4f6;
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .conferencia-item:last-child {
            border-bottom: none;
        }
        .conferencia-titulo {
            font-size: 1.17em;
            color: #312e81;
            font-weight: bold;
        }
        .conferencia-desc {
            color: #374151;
            font-size: 1em;
        }
        .conferencia-meta {
            color: #0ea5e9;
            font-size: 0.97em;
        }
        @media (max-width: 700px) {
            .hero, .conferencias-section {
                max-width: 99vw;
                padding: 22px 8vw 16px 8vw;
            }
            .topbar {
                padding-right: 6vw;
                padding-top: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="topbar">
        <a href="login.php" class="btn">Iniciar sesión</a>
        <a href="register.php" class="btn">Registrarse</a>
    </div>
    <div class="hero">
        <img src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png" alt="Logo SpeakerZone" class="hero-img" />
        <h1>Bienvenido a <span class="accent">SpeakerZone</span></h1>
        <p>
            La plataforma universitaria donde presentadores y asistentes se conectan para compartir ideas y gestionar conferencias.<br><br>
            <b>Descubre eventos, aprende y haz networking con otros estudiantes y expertos.</b>
        </p>
    </div>
    <div class="conferencias-section">
        <h2>Conferencias disponibles</h2>
        <ul class="conferencias-list">
            <?php foreach ($conferencias as $c): ?>
            <li class="conferencia-item">
                <div class="conferencia-titulo"><?= htmlspecialchars($c["titulo"]) ?></div>
                <div class="conferencia-desc"><?= htmlspecialchars($c["descripcion"]) ?></div>
                <div class="conferencia-meta">
                    <span>Fecha: <?= htmlspecialchars($c["fecha"]) ?></span> |
                    <span>Ponente: <?= htmlspecialchars($c["ponente"]) ?></span>
                </div>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
</body>
</html>