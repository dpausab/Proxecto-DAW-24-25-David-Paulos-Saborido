<?php

include_once("Controller.php");
include_once(API_ROUTE."model/UbicacionModel.php");

class UbicacionController extends Controller{
    public function get($id) {
        $datos=null;
        try {
            $datos = UbicacionModel::get($id);
            echo json_encode($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function getAll($params) {
        $datos = [];
        try {
            $nombre = isset($_GET['nombre']) &&$_GET['nombre']!="" && $_GET['nombre']!="null" ? $_GET['nombre'] : null;

            if (isset($params) && count($params)>0) {
                $pagina = intval($params[0])-1 ?? 0;
                $limit =  11;
                $offset = $pagina * $limit;
                $datos = UbicacionModel::getAll($offset, $limit, $nombre);
            } else {
                $datos = UbicacionModel::getAll(null, null, $nombre);
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
            $dato = UbicacionModel::delete($id[0]);
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
            $dato = UbicacionModel::update($datos, $id[0]);
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
            $dato = UbicacionModel::insert($datos);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }  

    function validarDatos($datos) {
        $errores = [];

        $regexLatitud = '/^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/';
        $regexLongitud = '/^-?((1[0-7]\d(\.\d+)?)|([1-9]?\d(\.\d+)?|180(\.0+)?))$/';

        if (isset($datos['latitud']) && isset($datos['longitud'])) {
            if (!is_numeric($datos['latitud']) || !is_numeric($datos['longitud'])) {
                $errores[] = "Latitud y Longitud deben ser coordenadas válidas.";
            } else {
                if (!preg_match($regexLatitud, trim($datos['latitud']))) {
                    $errores[] = "Latitud inválida.";
                }
                if (!preg_match($regexLongitud, trim($datos['longitud']))) {
                    $errores[] = "Longitud inválida.";
                }
            }
        } else {
            $errores[] = "Latitud y Longitud son obligatorias.";
        }

        if (empty($datos['nombre'])) {
            $errores[] = "El nombre es obligatorio";
        }

        if (count($errores)) {
            throw new Exception(implode(' - ', $errores));
        }
    }
}