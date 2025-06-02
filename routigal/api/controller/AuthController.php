<?php

include_once("Controller.php");
include_once("model/AuthModel.php");
include_once("model/UserModel.php");

class AuthController {

    public function login($data){
        $respuesta = false;
        if(isset($data)) {
            $json = json_decode($data, true);
            if (isset($json['user']) && isset($json['pwd'])) {
                $respuesta = AuthModel::login($json['user'], sha1($json['pwd']));
            }
        } 
        if ($respuesta) {
            $_SESSION['user'] = [
                'id' => $respuesta['id'],
                'nombre' => $respuesta['nombre'],
                'rol' => $respuesta['id_rol']
            ];
        }
        echo json_encode(['respuesta' => $respuesta]);
    }

    public static function getSessionUser() {
        if (isset($_SESSION['user'])) {
            $respuesta = UserModel::get($_SESSION['user']['id']);
            return $respuesta;
        } 

        return null;
    }

    public static function getLoggedUser() {
        if (isset($_SESSION['user'])) {
            echo json_encode($_SESSION['user']);
            return;
        } 

        echo json_encode(null);
    }

    public static function hasPermission($userId, $endpoint, $method) {
        $respuesta = false;
        try {
            $respuesta = AuthModel::hasPermission($userId, $endpoint, $method);
        } catch (\Throwable $th) {
            echo json_encode(['mensaje' => 'Error en la comprobación de permisos.']);
            $respuesta = false;
        } 
        return $respuesta;
    }

    public function logout(){
        session_destroy();
        session_unset();

        header("Location: /html/dashboard.php");
    }

}