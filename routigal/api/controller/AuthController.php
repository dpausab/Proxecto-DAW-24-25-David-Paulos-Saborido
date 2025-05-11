<?php

include_once("Controller.php");
include_once("model/AuthModel.php");

class AuthController extends Controller {

    public static function login($email, $pwd):bool{
        $auth = false;
        if(isset($email) && isset($pwd)) {
            $auth = AuthModel::login($email, sha1($pwd));
        }
        
        return $auth;
    }

    public function get($id) {

    }
    public function getAll() {

    }
    public function delete($id) {

    }
    public function update($id, $object) {

    }
    public function insert($data) {
        $auth = false;

        $json = json_decode($data, true);

        if (isset($json['user']) && isset($json['pwd'])) {
            $auth = AuthModel::register($json['user'], sha1($json['pwd']));
            if ($auth) {
                echo json_encode(["success" => $auth]);
            } else {
                echo json_encode("Fallo registrando");
            }
        }

}
}