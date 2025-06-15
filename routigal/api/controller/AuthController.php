<?php

include_once("Controller.php");
include_once(API_ROUTE."model/AuthModel.php");
include_once(API_ROUTE."model/UserModel.php");

class AuthController {

    public function login($data){
        $respuesta = false;
        try {
            if(isset($data)) {
                $json = json_decode($data, true);
                if (isset($json['user']) && isset($json['pwd'])) {
                    $respuesta = AuthModel::login($json['user'], sha1($json['pwd']));
                } else {
                    throw new Exception("Los campos son obligatorios.");
                }
            } 
            if ($respuesta) {
                session_regenerate_id(true);
                $_SESSION['user'] = [
                    'id' => $respuesta['id'],
                    'nombre' => $respuesta['nombre'],
                    'rol' => $respuesta['id_rol'],
                    'tiempo' => time()
                ];

            }
            echo json_encode(['respuesta' => $respuesta]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }

    public static function getSessionUser() {
        try {
            if (isset($_SESSION['user'])) {
                $respuesta = UserModel::get($_SESSION['user']['id']);
                return $respuesta;
            } 
            return null;
        } catch (\Throwable $th) {
            http_response_code(400);
        }

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
            return $respuesta;
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        } 
    }

    public function logout(){
        session_destroy();
        session_unset();

        header("Location: /html/dashboard.php");
    }

}