<?php

include_once("Controller.php");
include_once(API_ROUTE."model/RouteModel.php");

class RouteController extends Controller{
    public function get($id) {
        $dato=null;
        try {
            $dato = RouteModel::get($id[0]);
            echo json_encode($dato);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }
    public function getAll($ids) {
        $datos = [];
        try {
            $estado = isset($_GET['estado']) && $_GET['estado']!="" && $_GET['estado']!="null" ? $_GET['estado'] : null;
            $nombre = isset($_GET['nombre']) &&$_GET['nombre']!="" && $_GET['nombre']!="null" ? $_GET['nombre'] : null;
            $fecha = isset($_GET['fecha']) &&$_GET['fecha']!="" && $_GET['fecha']!="null" ? $_GET['fecha'] : null;
            $id = isset($_GET['id']) &&$_GET['id']!="" && $_GET['id']!="null" ? $_GET['id'] : null;

            if (isset($ids) && count($ids)>0) {
                $pagina = intval($ids[0])-1 ?? 0;
                $limit =  10;
                $offset = $pagina * $limit;
                $datos = RouteModel::getAll($offset, $limit, $estado, $nombre, $fecha, $id);
            } else {
                $datos = RouteModel::getAll(null, null, $estado, $nombre, $fecha, $id);
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
            $dato = RouteModel::delete($id[0]);
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
            self::validarDatos($datos);
            $dato = RouteModel::update($datos, $id[0]);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }

    public function completar($id) {
        $dato = null;
        try {
            $dato = RouteModel::completar($id[0]);
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
            self::validarDatos($datos);
            $dato = RouteModel::insert($datos);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }  

    private static function validarDatos($ruta) {
        $errores = [];
        $today = strtotime(date('Y-m-d'));
        $fecha = strtotime($ruta['fecha']);
        
        if (empty($ruta['nombre'])) {
            $errores[]='El nombre no puede estar vacío.';
        }
        if (!empty($ruta['tiempoTotal'])) {
            $errores[]='El tiempo no tiene formato válido.';
        }
        if (!is_numeric($ruta['distanciaTotal'])) {
            $errores[]='La distancia no tiene formato válido.';
        }
        if (empty($ruta['origen']) || !is_numeric($ruta['origen'])) {
            $errores[]='El orígen no es correcto o no existe.';
        }
        if (empty($ruta['estado']) || !is_numeric($ruta['estado'])) {
            $errores[]='El estado no es correcto o no existe';
        }
        if (empty($ruta['tecnico']) || !is_numeric($ruta['tecnico'])) {
            $errores[]='El técnico no es correcto o no existe.';
        }
        if (empty($ruta['fecha']) || $fecha < $today) {
            $errores[]='La fecha no es válida.';
        }
        if (empty($ruta['horaSalida'])) {
            $errores[]='La hora no es válida';
        }
        
        if (count($errores)) {
            throw new Exception(implode(' - ', $errores));
        }
    }

}