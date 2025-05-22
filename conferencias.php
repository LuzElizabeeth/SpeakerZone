<?php
session_start();
$conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
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
            max-width: 800px;
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
        }
        .conferencia-item {
            border-bottom: 1px solid #f3f4f6;
            padding: 18px 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .conferencia-item:last-child {
            border-bottom: none;
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
        @media (max-width: 700px) {
            .conferencias-section {
                max-width: 99vw;
                padding: 22px 5vw 16px 5vw;
            }
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
                <div class="conferencia-titulo"><?= htmlspecialchars($c["titulo"]) ?></div>
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