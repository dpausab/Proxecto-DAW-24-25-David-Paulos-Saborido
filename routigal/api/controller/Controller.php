<?php

/**
 * Definicion de los nombres asociados a cada controlador en la URI.
 */
define("CONTROLLER_SERVICE", "servicios");
define("CONTROLLER_ROUTE", "rutas");
define("CONTROLLER_AUTH", "auth");

class ControllerException extends Exception{
    function __construct()
    {
        parent::__construct("Error obteniendo el controlador solicitado.");
    }
}

abstract class Controller
{

    public static function sendNotFound($mensaje)
    {
        error_log($mensaje);
        header("HTTP/1.1 404 Not Found");
        $mensaje = ["error" => $mensaje];
        echo json_encode($mensaje, JSON_PRETTY_PRINT);
    }

    public static function getController($nombre)
    {
        $controller = null;
        switch ($nombre) {
            case CONTROLLER_SERVICE:
                $controller = new ServiceController();
                break;
            case CONTROLLER_ROUTE:
                $controller = new RouteController();
                break;
            case CONTROLLER_AUTH:
                $controller = new AuthController();
                break;
            default:
                throw new ControllerException();
        }
        return $controller;
    }

    public abstract function get($id);
    public abstract function getAll();
    public abstract function delete($id);
    public abstract function update($id, $object);
    public abstract function insert($object);


}
