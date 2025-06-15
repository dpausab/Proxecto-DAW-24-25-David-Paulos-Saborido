<?php
session_start();

include_once("controller/Controller.php");
include_once("controller/RouteController.php");
include_once("controller/ServiceController.php");
include_once("controller/AuthController.php");
include_once("controller/UserController.php");
include_once("controller/UbicacionController.php");
include_once("controller/RolController.php");

function getIds(array $uri):array{
    $ids = [];
    for($i=count($uri)-1;$i>=0;$i--){
        if(intval($uri[$i])){
            $ids[] = $uri[$i];
        }
    }
    return array_reverse($ids);
}

/**
 * Este fichero captura las peticiones de datos.
 * Se hace parse a la URI para conseguir los parámetros necesarios.
 */
$metodo = $_SERVER["REQUEST_METHOD"];
$uri = $_SERVER["REQUEST_URI"];
$path = parse_url($uri, PHP_URL_PATH);
$uri = explode("/", $path);
$endpoint = $uri[2];
$accion = $uri[3];
$id = null;
$controlador = null;


if (count($uri) >= 4) {
    try {
        $id = getIds($uri);
    } catch (Throwable $th) {

        Controller::sendNotFound("Error en la peticion. El parámetro debe ser un id correcto.");
        die();
    }
}

try {
    $controlador = Controller::getController($endpoint);
    $json = null;
    if ($endpoint != "auth" && !isset($_SESSION['user'])) {
        http_response_code(403);
        include_once('../html/403.php');
        return;
    }

    if (method_exists($controlador, $accion)) {
        if ($endpoint != "auth") {
            $user = AuthController::getSessionUser();
            if (!isset($user)) {
                http_response_code(403);
                include_once('../html/403.php');
                return;
            }
            if (!AuthController::hasPermission($user->getId(), $endpoint, $metodo)) {
                http_response_code(403);
                include_once('../html/403.php');
                return;
            }
        }
        if (in_array($metodo, ['POST', 'PUT', 'PATCH'])) {
            $json = file_get_contents('php://input');
            $controlador->$accion($json, $id ?? null);
        } else {
            if ($accion === 'delete' && $metodo!='DELETE') {
                http_response_code(403);
                include_once('../html/403.php');
                return;
            }
            $controlador->$accion($id);
        }
    } else {
        http_response_code(404);
        echo json_encode(['Error' => 'La acción especificada no es válida.']);
    }

} catch (ControllerException $th) {
    Controller::sendNotFound("Error obteniendo el endpoint " . $endpoint);
    die();
}

