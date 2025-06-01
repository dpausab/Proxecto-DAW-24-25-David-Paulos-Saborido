<?php

include_once("Controller.php");
include_once("model/UserModel.php");

class UserController extends Controller{
    public function get($id) {
        $dato=null;
        try {
            $datos = UserModel::get($id);
            echo json_encode($datos);
        } catch (\Throwable $th) {
            echo json_encode([
                'error' => $th->getMessage(),
                'dato' => $dato
            ]);
        }
    }
    public function getAll($ids) {
        $datos = [];
        try {
            if (isset($ids) && count($ids)>0) {
                $pagina = $ids[0] ?? 0;
                $limit =  10;
                $offset = $pagina * $limit;
                $datos = UserModel::getAll($offset, $limit);
            } else {
                $datos = UserModel::getAll();
            }
            echo json_encode($datos);
        } catch (\Throwable $th) {
            echo json_encode([
                'error' => $th->getMessage(),
                'datos' => $datos
            ]);
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
            echo json_encode([
                'error' => $th->getMessage(),
                'datos' => $datos
            ]);
        }
    }

    public function delete($id) {
        $dato = null;
        $mensaje = "Editado con éxito.";
        try {
            $dato = UserModel::delete($id[0]);
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }
    public function update($json, $id) {
        $dato = null;
        $mensaje = "Editado con éxito.";
        try {
            $datos = json_decode($json, true);
            $dato = UserModel::update($datos, $id[0]);
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }
    public function insert($json) {
        $dato = null;
        $mensaje = "Insertado con éxito.";
        try {
            $datos = json_decode($json, true);
            $dato = UserModel::insert($datos);
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }  
}