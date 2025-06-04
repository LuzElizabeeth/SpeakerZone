<?php
session_start();
if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

$sql = "SELECT c.*, u.nombre as presentador FROM conferencias c LEFT JOIN usuarios u ON c.presentador_id = u.id ORDER BY c.fecha DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio - SpeakerZone</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #4a6fa5;
            --secondary-color: #166088;
            --accent-color: #4fc3f7;
            --light-color: #f8f9fa;
            --dark-color: #343a40;
            --success-color: #28a745;
            --warning-color: #ffc107;
            --danger-color: #dc3545;
            --border-radius: 8px;
            --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            color: var(--dark-color);
            line-height: 1.6;
        }
        
        .container-bg {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 20px;
        }
        
        .main-card {
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        h2, h3 {
            color: var(--secondary-color);
            margin-bottom: 1rem;
        }
        
        h2 {
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 0.5rem;
            font-size: 1.8rem;
        }
        
        h3 {
            font-size: 1.4rem;
            margin-top: 1.5rem;
        }
        
        .success-msg {
            background-color: #d4edda;
            color: var(--success-color);
            padding: 0.75rem;
            border-radius: var(--border-radius);
            margin: 1rem 0;
            border-left: 4px solid var(--success-color);
        }
        
        .table-responsive {
            overflow-x: auto;
            margin: 1.5rem 0;
        }
        
        .styled-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 0.9em;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
        }
        
        .styled-table thead tr {
            background-color: var(--primary-color);
            color: white;
            text-align: left;
        }
        
        .styled-table th,
        .styled-table td {
            padding: 12px 15px;
        }
        
        .styled-table tbody tr {
            border-bottom: 1px solid #dddddd;
        }
        
        .styled-table tbody tr:nth-of-type(even) {
            background-color: #f8f9fa;
        }
        
        .styled-table tbody tr:last-of-type {
            border-bottom: 2px solid var(--primary-color);
        }
        
        .styled-table tbody tr:hover {
            background-color: #f1f7fd;
        }
        
        .action-btn, .main-btn {
            display: inline-block;
            padding: 8px 16px;
            border-radius: var(--border-radius);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .action-btn {
            background-color: var(--accent-color);
            color: white;
        }
        
        .action-btn:hover {
            background-color: #3da8d8;
            transform: translateY(-2px);
        }
        
        .main-btn {
            background-color: var(--success-color);
            color: white;
            padding: 10px 20px;
            margin-top: 1rem;
        }
        
        .main-btn:hover {
            background-color: #218838;
            transform: translateY(-2px);
        }
        
        .action-link {
            color: var(--secondary-color);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .action-link:hover {
            color: var(--accent-color);
            text-decoration: underline;
        }
        
        .logout-link {
            margin-top: 2rem;
            text-align: right;
        }
        
        .logout-link a {
            color: var(--danger-color);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .logout-link a:hover {
            text-decoration: underline;
        }
        
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge-online {
            background-color: #d4edda;
            color: var(--success-color);
        }
        
        .badge-presencial {
            background-color: #cce5ff;
            color: #0062cc;
        }
        
        @media (max-width: 768px) {
            .styled-table {
                display: block;
            }
            
            .styled-table thead {
                display: none;
            }
            
            .styled-table tbody tr {
                display: block;
                margin-bottom: 1rem;
                border: 1px solid #ddd;
                border-radius: var(--border-radius);
            }
            
            .styled-table td {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                text-align: right;
                border-bottom: 1px solid #eee;
            }
            
            .styled-table td::before {
                content: attr(data-label);
                font-weight: bold;
                margin-right: auto;
                text-align: left;
                padding-right: 1rem;
                color: var(--primary-color);
            }
            
            .styled-table td:last-child {
                border-bottom: none;
            }
        }
    </style>
</head>
<body>
    <div class="container-bg">
        <div class="main-card">
            <div class="header-section">
                <h2><i class="fas fa-user-circle"></i> Bienvenido, <?php echo htmlspecialchars($_SESSION["usuario_nombre"]); ?>!</h2>
                <p class="user-role"><?php echo $_SESSION["usuario_tipo"] == "presentador" ? "Presentador" : "Asistente"; ?></p>
            </div>
            
            <?php if (isset($_GET['msg'])): ?>
                <div class="success-msg">
                    <i class="fas fa-check-circle"></i> <?php echo htmlspecialchars($_GET['msg']); ?>
                </div>
            <?php endif; ?>
            
            <h3><i class="fas fa-calendar-alt"></i> Conferencias disponibles</h3>
            
            <div class="table-responsive">
                <table class="styled-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Modalidad</th>
                            <th>Fecha</th>
                            <th>Lugar</th>
                            <th>Presentador</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
<?php while ($row = $result->fetch_assoc()): ?>
    <tr>
        <td data-label="Título">
            <strong><?php echo htmlspecialchars($row["titulo"]); ?></strong>
        </td>
        <td data-label="Descripción">
            <?php echo htmlspecialchars(substr($row["descripcion"], 0, 50)); ?>
            <?php echo strlen($row["descripcion"]) > 50 ? '...' : ''; ?>
        </td>
        <td data-label="Modalidad">
            <span class="badge <?php echo $row["modalidad"] == "Virtual" ? 'badge-online' : 'badge-presencial'; ?>">
                <?php echo htmlspecialchars($row["modalidad"]); ?>
            </span>
        </td>
        <td data-label="Fecha"><?php echo date('d M Y', strtotime($row["fecha"])); ?></td>
        <td data-label="Lugar"><?php echo htmlspecialchars($row["lugar"]); ?></td>
        <td data-label="Presentador"><?php echo htmlspecialchars($row["presentador"]); ?></td>
        <td data-label="Acciones">
            <?php if ($_SESSION["usuario_tipo"] == "asistente"): ?>
                <form method="POST" action="inscribirse.php" style="display:inline;">
                    <input type="hidden" name="conferencia_id" value="<?php echo $row["id"]; ?>">
                    <button type="submit" class="action-btn" title="Inscribirse a esta conferencia">
                        <i class="fas fa-user-plus"></i> Inscribirse
                    </button>
                </form>
            <?php elseif ($_SESSION["usuario_tipo"] == "presentador" && $_SESSION["usuario_id"] == $row["presentador_id"]): ?>
                <a href="editar_conferencia.php?id=<?php echo $row["id"]; ?>" class="action-link" title="Editar esta conferencia">
                    <i class="fas fa-edit"></i> Editar
                </a>
            <?php endif; ?>
        </td>
    </tr>
<?php endwhile; ?>
</tbody>
                </table>
            </div>
            
            <?php if ($_SESSION["usuario_tipo"] == "presentador"): ?>
                <form method="get" action="admin_conferencias.php" style="margin-top:20px;">
                    <button type="submit" class="main-btn">
                        <i class="fas fa-plus-circle"></i> Crear nueva conferencia
                    </button>
                </form>
            <?php endif; ?>
            
            <p class="logout-link">
                <a href="logout.php">
                    <i class="fas fa-sign-out-alt"></i> Cerrar sesión
                </a>
            </p>
        </div>
    </div>
</body>
</html>
<?php $conn->close(); ?>