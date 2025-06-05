<?php
session_start();
if (!isset($_SESSION["usuario_id"]) || $_SESSION["usuario_tipo"] !== "presentador") {
    header("Location: login.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "SpeakerZone_db");
if ($conn->connect_error) die("Error de conexión: " . $conn->connect_error);

// Validar conferencia
$id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

// Obtener la conferencia y asegurarse que pertenece al presentador actual
$stmt = $conn->prepare("SELECT * FROM conferencias WHERE id=? AND presentador_id=?");
$stmt->bind_param("ii", $id, $_SESSION["usuario_id"]);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
    $stmt->close();
    $conn->close();
    header("Location: index.php?msg=No tienes permisos para editar esta conferencia.");
    exit();
}
$conferencia = $res->fetch_assoc();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $titulo = $conn->real_escape_string($_POST["titulo"]);
    $descripcion = $conn->real_escape_string($_POST["descripcion"]);
    $modalidad = $conn->real_escape_string($_POST["modalidad"]);
    $fecha = $conn->real_escape_string($_POST["fecha"] . " " . $_POST["hora"]);
    $lugar = $conn->real_escape_string($_POST["lugar"]);

    $stmt2 = $conn->prepare("UPDATE conferencias SET titulo=?, descripcion=?, modalidad=?, fecha=?, lugar=? WHERE id=? AND presentador_id=?");
    $stmt2->bind_param("ssssssi", $titulo, $descripcion, $modalidad, $fecha, $lugar, $id, $_SESSION["usuario_id"]);
    $stmt2->execute();
    $stmt2->close();
    $stmt->close();
    $conn->close();
    header("Location: home.php?msg=Conferencia actualizada correctamente.");
    exit();
}
$stmt->close();
$conn->close();

// Separar fecha y hora
$fecha_val = "";
$hora_val = "";
if (!empty($conferencia["fecha"])) {
    $fecha_parts = explode(' ', $conferencia["fecha"]);
    $fecha_val = $fecha_parts[0];
    $hora_val = isset($fecha_parts[1]) ? substr($fecha_parts[1], 0, 5) : "";
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Conferencia · SpeakerZone</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .edit-container {
            width: 100%;
            max-width: 500px;
            margin: 30px auto;
            background: #fff;
            border-radius: 10px;
            padding: 2em 2.5em;
            box-shadow: 0 2px 16px #0001;
        }
        label { font-weight: bold; margin-top:1em; display:block;}
        input, textarea, select { width: 100%; padding: 8px; margin: 8px 0 15px 0;}
        .row-flex {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 20px;
        }


    .row-flex {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 20px;
    }
    .row-flex input[type="date"],
    .row-flex input[type="time"] {
        width: 50%;
        margin: 0;
    }
    @media (max-width: 600px) {
        .row-flex { flex-direction: column; gap: 0;}
        .row-flex input[type="date"],
        .row-flex input[type="time"] {
            width: 100%;
            margin-bottom: 10px;
        }
    }


        .btn-group {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-top: 18px;
        }
        .btn {
            background: #4a6fa5;
            color: #fff; border: none; border-radius:6px;
            padding: 10px 20px; cursor:pointer; text-decoration:none; text-align:center; display:inline-block;
            transition: background .2s;
            font-size: 1rem;
        }
        .btn.cancelar {
            background: #dc3545;
        }
        .btn:hover { background:#166088; }
        .btn.cancelar:hover { background: #a71d2a; }
        h2 { color: #4338ca; margin-bottom: 1em;}
        @media (max-width: 600px) {
            .edit-container { padding: 1.2em; }
            .row-flex { flex-direction: column; gap: 0;}
            .row-flex input[type="date"],
            .row-flex input[type="time"] {
                width: 100%;
                margin-bottom: 10px;
            }
            .btn-group { flex-direction: column; gap: 10px; }
        }
    </style>
</head>
<body>
    <div class="edit-container">
        <h2>Editar conferencia</h2>
        <form method="POST">
            <label>Título</label>
            <input type="text" name="titulo" value="<?=htmlspecialchars($conferencia["titulo"])?>" required>
            <label>Descripción</label>
            <textarea name="descripcion" required><?=htmlspecialchars($conferencia["descripcion"])?></textarea>
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
            <label>Fecha y hora</label>
<div class="row-flex">
    <input type="date" name="fecha" value="<?=htmlspecialchars($fecha_val)?>" required>
    <input type="time" name="hora" value="<?=htmlspecialchars($hora_val)?>" required>
</div>
            <label>Lugar</label>
            <input type="text" name="lugar" value="<?=htmlspecialchars($conferencia["lugar"])?>">
            <div class="btn-group">
                
                <a href="home.php" class="btn guardar">Guardar cambios</a>
                <a href="home.php" class="btn cancelar">Cancelar</a>
            </div>
        </form>
    </div>
</body>
</html>