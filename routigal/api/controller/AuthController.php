<?php

include_once("Controller.php");
include_once("model/AuthModel.php");

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
            $_SESSION['user'] = $json['user'];
        }
        echo json_encode(['respuesta' => $respuesta]);
    }

    public function logout(){
        session_destroy();
        session_unset();

        header("Location: dashboard.php");
    }

}