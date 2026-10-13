<?php
// Indicamos al cliente (Postman, Browser, React) que devolvemos un JSON
header("Content-Type: application/json; charset=utf-8");

// Requerimos el archivo modelos.php
require_once 'modelos.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Método no permitido'
    ]);
    exit;
}

$valores = $_POST;

if(isset($valores['rol'])) {
    unset($valores['rol']);
}

$nombre = trim($_POST['nombre'] ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$usuario = trim($_POST['usuario'] ?? '');
$password = $_POST['password'] ?? '';

if ($nombre === '' || $apellido === '' || $usuario === '' || $password === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Completa todos los campos obligatorios'
    ]);
    exit;
}

if (strlen($nombre) > 50 || strlen($apellido) > 50 || strlen($usuario) > 50) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Uno o más campos superan la longitud permitida'
    ]);
    exit;
}

$usuarios = new Modelo('usuarios');             // Creamos el objeto $usuarios
$usuarios->setCampos('id');                     // Seteamos sólo el campo id
$usuarios->setCriterio("usuario='$usuario'");   // Seteamos el criterio
$usuarios->setLimite(1);                        // Seteamos el límite
$consulta = $usuarios->seleccionar();           // Seleccionamos el id de usuarios obteniendo sólo 1

if (!empty($consulta)) {                        // Si encontró uno
    http_response_code(409);
    echo json_encode([
        'success' => false, 
        'message' => 'Ese nombre de usuario ya está registrado'
    ]);
    exit;
}

$id = $usuarios->insertar($valores);            // Insertamos los datos del formulario
if($id > 0) {
    $respuesta = [
        'success' => true,
        'message' => 'Registro insertado correctamente',
        'id' => $id
    ];                    
} else {
    $respuesta = [
        'success' => false,
        'message' => 'Error al insertar el registro'
    ];
}
echo json_encode($respuesta);

?>