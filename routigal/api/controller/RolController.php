<?php

include_once("Controller.php");
include_once("model/RolModel.php");

class RolController extends Controller{
    public function get($id) {
        $dato=null;
        try {
            $datos = RolModel::get($id);
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
                $datos = RolModel::getAll($offset, $limit);
            } else {
                $datos = RolModel::getAll();
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
            $dato = RolModel::delete($id[0]);
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
            $dato = RolModel::update($datos, $id[0]);
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
            $dato = RolModel::insert($datos);
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }  
}