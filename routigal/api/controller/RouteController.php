<?php

include_once("Controller.php");
include_once("model/RouteModel.php");

class RouteController extends Controller{
    public function get($id) {
        $dato=null;
        try {
            $dato = RouteModel::get($id[0]);
            echo json_encode($dato);
        } catch (\Throwable $th) {
            echo json_encode([
                'error' => $th->getMessage(),
                'dato' => $dato
            ]);
        }
    }
    public function getAll($ids) {
        $datos = [];
        $id = null;
        $id = $_SESSION['user']['rol'] === 2 ? $_SESSION['user']['id'] : null;
        try {
            if (isset($ids) && count($ids)>0) {
                $pagina = $ids[0]-1 ?? 1;
                $limit =  10;
                $offset = $pagina * $limit;
                $datos = RouteModel::getAll($offset, $limit, $id);
            } else {
                $datos = RouteModel::getAll(null, null, $id);
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
        $mensaje = "Borrada con éxito.";
        try {
            $dato = RouteModel::delete($id[0]);
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
            $dato = RouteModel::update($datos, $id[0]);
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
            $dato = RouteModel::insert($datos);
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }  
}