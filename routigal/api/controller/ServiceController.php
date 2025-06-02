<?php

include_once("Controller.php");
include_once("model/ServiceModel.php");

class ServiceController extends Controller{
    public function get($id) {
        $dato=null;
        try {
            $datos = ServiceModel::get($id);
            echo json_encode($datos);
        } catch (\Throwable $th) {
            echo json_encode([
                'error' => $th->getMessage(),
                'dato' => $dato
            ]);
        }
    }
    public function getAll($params) {
        $datos = [];
        $id = null;
        $id = $_SESSION['user']['rol'] === 2 ? $_SESSION['user']['id'] : null;
        try {
            
            if (isset($params) && count($params)>0) {
                $pagina = $params[0]-1 ?? 0;
                $limit =  10;
                $offset = $pagina * $limit;
                $datos = ServiceModel::getAll($offset, $limit, $id);
            } else {
                $datos = ServiceModel::getAll(null, null, $id);
            }
            echo json_encode($datos);
        } catch (\Throwable $th) {
            echo json_encode([
                'error' => $th->getMessage(),
                'datos' => $datos
            ]);
        }
    }

    public function getDisponibles($id=null) {
        $datos = [];
        try {
            $datos = ServiceModel::getDisponibles($id);
            
            echo json_encode($datos);
        } catch (\Throwable $th) {
            echo json_encode([
                'error' => $th->getMessage(),
                'datos' => $datos
            ]);
        }
    }

    public function reset() {
        $dato = null;
        $mensaje = "Editado con éxito.";
        try {
            $dato = ServiceModel::reset();
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }

    public function delete($id) {
        $dato = null;
        $mensaje = "Editado con éxito.";
        try {
            $dato = ServiceModel::delete($id[0]);
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
            $dato = ServiceModel::update($datos, $id[0]);
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }

    public static function updateRutaId($data, $ids) {
        $dato = null;
        $mensaje = "Editado con éxito.";
        try {
            $datos = json_decode($data, true);
            $servicioId = $ids[0];
            $dato = ServiceModel::updateRutaId($datos, $servicioId);
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
            $dato = ServiceModel::insert($datos);
        } catch (\Throwable $th) {
            http_response_code(401);
            $mensaje = $th->getMessage();
        }
        
        echo json_encode(['respuesta' => $dato, 'mensaje' => $mensaje]);
    }  
}