<?php

include_once("Controller.php");
include_once("model/UbicacionModel.php");

class UbicacionController extends Controller{
    public function get($id) {
        $dato=null;
        try {
            $datos = UbicacionModel::get($id);
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
                $datos = UbicacionModel::getAll($offset, $limit);
            } else {
                $datos = UbicacionModel::getAll();
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
            $dato = UbicacionModel::delete($id[0]);
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
            $dato = UbicacionModel::update($datos, $id[0]);
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
            $dato = UbicacionModel::insert($datos);
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }  
}