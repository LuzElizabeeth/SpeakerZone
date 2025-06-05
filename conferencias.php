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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conferencias disponibles · SpeakerZone</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #7c3aed;
            --primary-dark: #5b21b6;
            --accent: #06b6d4;
            --accent-light: #a7f3d0;
            --background: #f4f5fb;
            --card-bg: #fff;
            --text: #1e293b;
            --muted: #64748b;
            --border-radius: 18px;
            --shadow: 0 8px 18px 0 rgba(124,58,237, 0.09), 0 1.5px 2.5px 0 rgba(30,41,59,0.07);
        }
        * {
            margin: 0; padding: 0; box-sizing: border-box;
            font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background: linear-gradient(110deg, var(--primary) 0%, var(--accent) 100%);
            min-height: 100vh;
            color: var(--text);
        }
        .container {
            max-width: 1150px;
            margin: 0 auto;
            padding: 40px 16px;
        }
        .header {
            text-align: center;
            margin-bottom: 44px;
            color: white;
            text-shadow: 0 2px 18px rgba(124,58,237, 0.13);
        }
        .header h1 {
            font-size: 2.7rem;
            font-weight: 700;
        }
        .header p {
            margin-top: 8px;
            font-size: 1.18rem;
            color: #e0e7ef;
        }
        .conferencias-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 32px;
        }
        .conferencia-card {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            overflow: hidden;
            position: relative;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 2.5px solid transparent;
        }
        .conferencia-card:hover {
            transform: translateY(-7px) scale(1.015);
            box-shadow: 0 18px 32px 0 rgba(124,58,237, 0.18), 0 2.5px 5px 0 rgba(30,41,59,0.13);
            border-color: var(--primary);
        }
        .card-image {
            width: 100%;
            height: 180px;
            object-fit: cover;
            background: linear-gradient(110deg, #ede9fe 0%, #a7f3d0 100%);
            display: block;
        }
        .card-content {
            padding: 28px 22px 20px 22px;
        }
        .modalidad-badge {
            display: inline-block;
            margin-bottom: 13px;
            padding: 5px 16px;
            border-radius: 50px;
            font-size: 0.93rem;
            font-weight: 700;
            letter-spacing: 0.03em;
            background: var(--accent-light);
            color: var(--primary-dark);
            box-shadow: 0 0.5px 2px 0 #d1fae5;
        }
        .modalidad-badge.presencial {
            background: #fbbf24;
            color: #78350f;
        }
        .modalidad-badge.virtual {
            background: #6366f1;
            color: #eef2ff;
        }
        .card-title {
            font-size: 1.35rem;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--primary-dark);
            letter-spacing: 0.02em;
        }
        .card-meta {
            display: flex;
            gap: 18px 22px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }
        .meta-item {
            display: flex;
            align-items: center;
            font-size: 1rem;
            color: var(--muted);
            gap: 6px;
        }
        .meta-item i {
            color: var(--primary);
            font-size: 1.07em;
        }
        .card-description {
            margin-top: 10px;
            font-size: 1.03rem;
            color: var(--text);
            letter-spacing: 0.01em;
            line-height: 1.65;
            min-height: 40px;
        }
        .card-footer {
            padding-top: 10px;
            text-align: right;
        }
        .btn-detalle {
            background: var(--primary);
            color: #fff;
            padding: 7px 22px;
            border-radius: 6px;
            border: none;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 0.03em;
            cursor: pointer;
            transition: background 0.18s;
            text-decoration: none;
            display: inline-block;
        }
        .btn-detalle:hover {
            background: var(--primary-dark);
            color: #dbeafe;
        }
        .empty-state {
            text-align: center;
            padding: 65px 18px 60px 18px;
            background: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            grid-column: 1 / -1;
        }
        .empty-state i {
            font-size: 3.3rem;
            color: var(--primary);
            margin-bottom: 18px;
        }
        .empty-state h3 {
            color: var(--primary-dark);
            margin-bottom: 8px;
            font-weight: 700;
        }
        .empty-state p {
            color: var(--muted);
            font-size: 1.07rem;
        }
        @media (max-width: 768px) {
            .conferencias-grid { grid-template-columns: 1fr; }
            .header h1 { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fa-solid fa-microphone-lines"></i> Conferencias Disponibles</h1>
            <p>Descubre las próximas conferencias y eventos académicos</p>
        </div>
        
        <?php if (count($conferencias) === 0): ?>
            <div class="empty-state">
                <i class="far fa-calendar-alt"></i>
                <h3>No hay conferencias programadas</h3>
                <p>Actualmente no hay conferencias registradas.<br>Vuelve más tarde para ver las próximas actividades.</p>
            </div>
        <?php else: ?>
            <div class="conferencias-grid">
                <?php foreach ($conferencias as $c): 
                    $modalidadClass = strtolower($c["modalidad"]) === 'virtual' ? 'virtual' : 'presencial';
                ?>
                <div class="conferencia-card">
                    <img src="conferenciasimagen.jpg" alt="<?= htmlspecialchars($c["titulo"]) ?>" class="card-image" loading="lazy">
                    <div class="card-content">
                        <span class="modalidad-badge <?= $modalidadClass ?>">
                            <?= ucfirst($c["modalidad"]) ?>
                        </span>
                        <h3 class="card-title"><?= htmlspecialchars($c["titulo"]) ?></h3>
                        <div class="card-meta">
                            <div class="meta-item">
                                <i class="far fa-calendar"></i>
                                <span><?= date('d/m/Y H:i', strtotime($c["fecha"])) ?></span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span><?= $c["lugar"] ? htmlspecialchars($c["lugar"]) : "Por definir" ?></span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-user-tie"></i>
                                <span><?= $c["presentador_nombre"] ? htmlspecialchars($c["presentador_nombre"]) : "Ponente por definir" ?></span>
                            </div>
                        </div>
                        <?php if ($c["descripcion"]): ?>
                        <div class="card-description">
                            <?= nl2br(htmlspecialchars($c["descripcion"])) ?>
                        </div>
                        <?php endif; ?>
                        <!-- Puedes agregar un botón de detalles o inscripción aquí -->
                        <!--
                        <div class="card-footer">
                            <a href="#" class="btn-detalle"><i class="fa-regular fa-circle-info"></i> Más detalles</a>
                        </div>
                        -->
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>