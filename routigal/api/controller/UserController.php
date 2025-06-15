<?php

include_once("Controller.php");
include_once(API_ROUTE."model/UserModel.php");

class UserController extends Controller{

    public function get($id) {
        $datos=null;
        try {
            $datos = UserModel::get($id[0]);
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }
    public function getAll($ids) {
        $datos = [];
        try {
            if (isset($ids) && count($ids)>0) {
                $pagina = $ids[0]-1 ?? 1;
                $limit =  10;
                $offset = $pagina * $limit;
                $datos = UserModel::getAll($offset, $limit);
            } else {
                $datos = UserModel::getAll();
            }
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }

    public function getTecnicos() {
        $datos = [];
        try {
            if (isset($ids) && count($ids)>0) {
                $pagina = $ids[0] ?? 0;
                $limit =  10;
                $offset = $pagina * $limit;
                $datos = UserModel::getTecnicos($offset, $limit);
            } else {
                $datos = UserModel::getTecnicos();
            }
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }

    public function delete($id) {
        $dato = null;
        try {
            $dato = UserModel::delete($id[0]);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }
    public function update($json, $id) {
        $dato = null;
        try {
            $datos = json_decode($json, true);
            $dato = UserModel::update($datos, $id[0]);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }
    public function insert($json) {
        $dato = null;
        try {
            $datos = json_decode($json, true);
            $dato = UserModel::insert($datos);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }  

    function validarDatos($datos) {
        $errores = [];

        if (empty($datos['nombre'])) {
            $errores[] = "El nombre es obligatorio";
        }

        if (empty($datos['usuario'])) {
            $errores[] = "El usuario es obligatorio";
        }

        if (empty($datos['pwd'])) {
            $errores[] = "La contraseña es obligatorio";
        }

        if (empty($datos['rol'])) {
            $errores[] = "El rol es obligatorio";
        }

        if (count($errores)) {
            throw new Exception(implode(' - ', $errores));
        }
    }
}