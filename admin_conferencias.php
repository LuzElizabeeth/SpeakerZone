<?php
session_start();
if (!isset($_SESSION["usuario_id"]) || $_SESSION["usuario_tipo"] != "presentador") {
    header("Location: login.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

// Determinar el modo de operación
$mode = 'new';
$conferencia_id = null;
$conferencia = null;

if (isset($_GET['conferencia_id'])) {
    $mode = 'edit';
    $conferencia_id = intval($_GET['conferencia_id']);
    
    // Obtener datos de la conferencia y verificar propiedad
    $stmt = $conn->prepare("SELECT * FROM conferencias WHERE id = ? AND presentador_id = ?");
    $stmt->bind_param("ii", $conferencia_id, $_SESSION['usuario_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $conferencia = $result->fetch_assoc();
    } else {
        header("Location: index.php?msg=No tienes permiso para editar esta conferencia");
        exit();
    }
} elseif (isset($_GET['mode']) && $_GET['mode'] == 'list') {
    $mode = 'list';
    
    // Obtener todas las conferencias del presentador
    $stmt = $conn->prepare("SELECT * FROM conferencias WHERE presentador_id = ? ORDER BY fecha DESC");
    $stmt->bind_param("i", $_SESSION['usuario_id']);
    $stmt->execute();
    $conferencias = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

// Procesar formulario de guardar
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $titulo = $_POST['titulo'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    $modalidad = $_POST['modalidad'] ?? '';
    $fecha = $_POST['fecha'] ?? '';
    $lugar = $_POST['lugar'] ?? '';
    $presentador_id = $_SESSION['usuario_id'];
    
    if ($mode == 'edit' && isset($_POST['conferencia_id'])) {
        // Actualizar conferencia existente
        $stmt = $conn->prepare("UPDATE conferencias SET titulo=?, descripcion=?, modalidad=?, fecha=?, lugar=? WHERE id=? AND presentador_id=?");
        $stmt->bind_param("sssssii", $titulo, $descripcion, $modalidad, $fecha, $lugar, $_POST['conferencia_id'], $presentador_id);
        $stmt->execute();
        
        header("Location: index.php?msg=Conferencia actualizada correctamente");
        exit();
    } else {
        // Crear nueva conferencia
        $stmt = $conn->prepare("INSERT INTO conferencias (titulo, descripcion, modalidad, fecha, lugar, presentador_id) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssi", $titulo, $descripcion, $modalidad, $fecha, $lugar, $presentador_id);
        $stmt->execute();
        
        header("Location: index.php?msg=Conferencia creada correctamente");
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Conferencias - SpeakerZone</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        /* Usar los mismos estilos de index.php o personalizar según necesites */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f5f7fa;
            color: #343a40;
        }
        
        .container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #166088;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid #4fc3f7;
            padding-bottom: 0.5rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        input[type="text"],
        input[type="date"],
        textarea,
        select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        
        textarea {
            min-height: 120px;
        }
        
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #166088;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        
        .btn:hover {
            background-color: #0d4b7a;
        }
        
        .btn-secondary {
            background-color: #6c757d;
        }
        
        .btn-secondary:hover {
            background-color: #5a6268;
        }
        
        .conferencias-list {
            margin-top: 2rem;
        }
        
        .conferencia-item {
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 1rem;
            background-color: #f8f9fa;
        }
        
        .conferencia-item h3 {
            margin-top: 0;
            color: #166088;
        }
        
        .conferencia-meta {
            display: flex;
            gap: 1rem;
            margin-top: 0.5rem;
            font-size: 0.9em;
            color: #6c757d;
        }
        
        .actions {
            margin-top: 1rem;
            display: flex;
            gap: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <?php if ($mode == 'list'): ?>
            <h1><i class="fas fa-tasks"></i> Mis Conferencias</h1>
            
            <a href="admin_conferencias.php" class="btn"><i class="fas fa-plus"></i> Nueva Conferencia</a>
            
            <div class="conferencias-list">
                <?php foreach ($conferencias as $conf): ?>
                    <div class="conferencia-item">
                        <h3><?php echo htmlspecialchars($conf['titulo']); ?></h3>
                        <p><?php echo htmlspecialchars($conf['descripcion']); ?></p>
                        <div class="conferencia-meta">
                            <span><i class="fas fa-calendar"></i> <?php echo date('d M Y', strtotime($conf['fecha'])); ?></span>
                            <span><i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($conf['lugar']); ?></span>
                            <span><i class="fas fa-network-wired"></i> <?php echo htmlspecialchars($conf['modalidad']); ?></span>
                        </div>
                        <div class="actions">
                            <a href="admin_conferencias.php?conferencia_id=<?php echo $conf['id']; ?>" class="btn">
                                <i class="fas fa-edit"></i> Editar
                            </a>
                            <form method="POST" action="eliminar_conferencia.php" style="display:inline;">
                                <input type="hidden" name="conferencia_id" value="<?php echo $conf['id']; ?>">
                                <button type="submit" class="btn btn-secondary" onclick="return confirm('¿Estás seguro de eliminar esta conferencia?');">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            
        <?php else: ?>
            <h1>
                <i class="fas fa-<?php echo $mode == 'edit' ? 'edit' : 'plus-circle'; ?>"></i> 
                <?php echo $mode == 'edit' ? 'Editar Conferencia' : 'Nueva Conferencia'; ?>
            </h1>
            
            <form method="POST" action="admin_conferencias.php<?php echo $mode == 'edit' ? '?conferencia_id='.$conferencia_id : ''; ?>">
                <?php if ($mode == 'edit'): ?>
                    <input type="hidden" name="conferencia_id" value="<?php echo $conferencia_id; ?>">
                <?php endif; ?>
                
                <div class="form-group">
                    <label for="titulo">Título:</label>
                    <input type="text" id="titulo" name="titulo" required 
                           value="<?php echo $mode == 'edit' ? htmlspecialchars($conferencia['titulo']) : ''; ?>">
                </div>
                
                <div class="form-group">
                    <label for="descripcion">Descripción:</label>
                    <textarea id="descripcion" name="descripcion" required><?php 
                        echo $mode == 'edit' ? htmlspecialchars($conferencia['descripcion']) : ''; 
                    ?></textarea>
                </div>
                
                <div class="form-group">
                    <label for="modalidad">Modalidad:</label>
                    <select id="modalidad" name="modalidad" required>
                        <option value="Presencial" <?php 
                            echo ($mode == 'edit' && $conferencia['modalidad'] == 'Presencial') ? 'selected' : ''; 
                        ?>>Presencial</option>
                        <option value="Virtual" <?php 
                            echo ($mode == 'edit' && $conferencia['modalidad'] == 'Virtual') ? 'selected' : ''; 
                        ?>>Virtual</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="fecha">Fecha:</label>
                    <input type="date" id="fecha" name="fecha" required 
                           value="<?php echo $mode == 'edit' ? htmlspecialchars($conferencia['fecha']) : ''; ?>">
                </div>
                
                <div class="form-group">
                    <label for="lugar">Lugar (o enlace si es virtual):</label>
                    <input type="text" id="lugar" name="lugar" required 
                           value="<?php echo $mode == 'edit' ? htmlspecialchars($conferencia['lugar']) : ''; ?>">
                </div>
                
                <button type="submit" class="btn">
                    <i class="fas fa-save"></i> <?php echo $mode == 'edit' ? 'Actualizar' : 'Crear'; ?>
                </button>
                
                <a href="index.php" class="btn btn-secondary">
                    <i class="fas fa-times"></i> Cancelar
                </a>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
<?php $conn->close(); ?>