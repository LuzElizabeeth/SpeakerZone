<?php
session_start();
$conn = new mysqli("172.17.0.2", "root", "password", "SpeakerZone_db");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

// Obtener todas las conferencias con nombre del presentador
$conferencias = [];
$res = $conn->query(
    "SELECT c.*, u.nombre as presentador_nombre 
     FROM conferencias c 
     LEFT JOIN usuarios u ON c.presentador_id = u.id 
     ORDER BY c.fecha"
);
if ($res) while ($c = $res->fetch_assoc()) $conferencias[] = $c;

$conn->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Conferencias disponibles · SpeakerZone</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .conferencias-section {
            margin: 80px auto 0 auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 6px 32px rgba(80,86,150,0.09), 0 1.5px 3px rgba(0,0,0,0.03);
            padding: 36px 30px 28px 30px;
        }
        .conferencias-section h2 {
            color: #4338ca;
            margin-bottom: 18px;
        }
        .conferencias-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .conferencia-item {
            border: 2px solid #0000004a;
            border-radius: 8px;
            padding: 0 0 18px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .conferencia-titulo {
            font-size: 1.18em;
            color: #312e81;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .conferencia-meta {
            color: #0ea5e9;
            font-size: 0.98em;
            margin-bottom: 3px;
        }
        .conferencia-desc {
            color: #374151;
            font-size: 1em;
        }
        img {
            width: 400px;
        }
        @media (max-width: 700px) {
            .conferencias-section {
                max-width: 99vw;
                padding: 22px 5vw 16px 5vw;
            }
        }
        .conferencia-titulo {
            margin: 0;
            font-size: 2rem;
            color: #00f;
        }
    </style>
</head>
<body>
    <div class="conferencias-section">
        <h2>Conferencias disponibles</h2>
        <?php if (count($conferencias) === 0): ?>
            <p>No hay conferencias registradas todavía.</p>
        <?php else: ?>
        <ul class="conferencias-list">
            <?php foreach ($conferencias as $c): ?>
            <li class="conferencia-item">
                <img src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F933364723%2F563548210565%2F1%2Foriginal.20250111-225746?w=600&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C101%2C1600%2C800&s=d88d2de624e45fe8fdb98b91b4f7c16b" alt="">
                <p class="conferencia-titulo"><?= htmlspecialchars($c["titulo"]) ?></p>
                <div class="conferencia-meta">
                    <span><?= ucfirst($c["modalidad"]) ?></span> |
                    <span><?= date('d/m/Y H:i', strtotime($c["fecha"])) ?></span> |
                    <span><?= $c["lugar"] ? htmlspecialchars($c["lugar"]) : "Pendiente" ?></span> |
                    <span>Ponente: <?= $c["presentador_nombre"] ? htmlspecialchars($c["presentador_nombre"]) : "Por definir" ?></span>
                </div>
                <?php if ($c["descripcion"]): ?>
                <div class="conferencia-desc"><?= nl2br(htmlspecialchars($c["descripcion"])) ?></div>
                <?php endif; ?>
            </li>
            <?php endforeach; ?>
        </ul>
        <?php endif; ?>
    </div>
</body>
</html>