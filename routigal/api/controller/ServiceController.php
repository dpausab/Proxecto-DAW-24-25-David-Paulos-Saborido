<?php

include_once("Controller.php");
include_once(API_ROUTE."model/ServiceModel.php");
include_once(API_ROUTE."model/AuthModel.php");

class ServiceController extends Controller{
    public function get($id) {
        $datos=null;
        try {
            $datos = ServiceModel::get($id);
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }
    public function getAll($params) {
        $datos = [];
        try {
            $estado = isset($_GET['estado']) && $_GET['estado']!="" && $_GET['estado']!="null" ? $_GET['estado'] : null;
            $nombre = isset($_GET['nombre']) &&$_GET['nombre']!="" && $_GET['nombre']!="null" ? $_GET['nombre'] : null;
            $fecha = isset($_GET['fecha']) &&$_GET['fecha']!="" && $_GET['fecha']!="null" ? $_GET['fecha'] : null;
            $id = isset($_GET['id']) &&$_GET['id']!="" && $_GET['id']!="null" ? $_GET['id'] : null;

            if (isset($params) && count($params)>0) {
                $pagina = intval($params[0])-1 ?? 0;
                $limit =  10;
                $offset = $pagina * $limit;
                $datos = ServiceModel::getAll($offset, $limit, $nombre, $fecha, $estado, $id);
            } else {
                $datos = ServiceModel::getAll(null, null, $nombre, $fecha, $estado, $id);
            }
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }

    public function getDisponibles($id=null) {
        $datos = [];
        try {
            $datos = ServiceModel::getDisponibles($id);
            
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }

    public function getPorRuta($id=null) {
        $datos = [];
        try {
            $datos = ServiceModel::getPorRuta($id[0]);
            
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }

    public function reset($id) {
        $dato = null;
        try {
            $dato = ServiceModel::reset($id[0]);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }

    public function delete($id) {
        $dato = null;
        try {
            $dato = ServiceModel::delete($id[0]);
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
            self::validarDatos($datos, $id[0]);
            $dato = ServiceModel::update($datos, $id[0]);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }

    public static function updateRutaId($data, $ids) {
        $dato = null;
        try {
            $datos = json_decode($data, true);
            $servicioId = $ids[0];
            $dato = ServiceModel::updateRutaId($datos, $servicioId);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }

    public static function completar($ids) {
        $dato = null;
        try {
            $servicioId = $ids[0];
            $dato = ServiceModel::completar($servicioId);
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
            $dato = ServiceModel::insert($datos);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
        
    }  

    function validarDatos($datos, $id=null) {
        $errores = [];

        $regexLatitud = '/^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/';
        $regexLongitud = '/^-?((1[0-7]\d(\.\d+)?)|([1-9]?\d(\.\d+)?|180(\.0+)?))$/';
        $servicio=null;

        $today = strtotime(date('Y-m-d'));
        $fecha = strtotime($datos['fecha']);

        if (isset($id)) {
            $servicio = ServiceModel::get($id);
        }

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

        if ($fecha) {
            if ($fecha === false) {
                $errores[] = "Fecha inválida.";
            } else {
                if ($servicio) {
                    $fechaServicio = strtotime(date('Y-m-d', strtotime($servicio->getFecha())));
                    if ($fecha < $fechaServicio) {
                        $errores[] = "La fecha del servicio no puede ser anterior a la original.";
                    }
                } else {
                    if ($fecha < $today) {
                        $errores[] = "La fecha del servicio no puede ser anterior a la actual.";
                    }
                }
            }
        }

        if (empty(trim($datos['nombre']))) {
            $errores[] = "El nombre es obligatorio";
        }

        if (empty(trim($datos['cliente']))) {
            $errores[] = "El nombre del cliente es obligatorio";
        }

        if (empty(trim($datos['direccion']))) {
            $errores[] = "La direccion es obligatoria";
        }

        if (empty($datos['hora'])) {
            $errores[] = "La hora de salida es obligatoria";
        }

        if (empty($datos['tiempoEstimado'])) {
            $errores[] = "El tiempo estimado es obligatorio";
        }

        if (count($errores)) {
            throw new Exception(implode(' - ', $errores));
        }
    }

}