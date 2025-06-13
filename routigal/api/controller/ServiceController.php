<?php

include_once("Controller.php");
include_once("model/ServiceModel.php");
include_once("model/AuthModel.php");

class ServiceController extends Controller{
    public function get($id) {
        $datos=null;
        try {
            $datos = ServiceModel::get($id);
            echo json_encode($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function getAll($params) {
        $datos = [];
        try {
            $estado = $_GET['estado']!="" && $_GET['estado']!="null" ? $_GET['estado'] : null;
            $nombre = $_GET['nombre']!="" && $_GET['nombre']!="null" ? $_GET['nombre'] : null;
            $fecha = $_GET['fecha']!="" && $_GET['fecha']!="null" ? $_GET['fecha'] : null;
            $id = $_GET['id']!="" && $_GET['id']!="null" ? $_GET['id'] : null;

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
            throw $th;
        }
    }

    public function getDisponibles($id=null) {
        $datos = [];
        try {
            $datos = ServiceModel::getDisponibles($id);
            
            echo json_encode($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getPorRuta($id=null) {
        $datos = [];
        try {
            $datos = ServiceModel::getPorRuta($id);
            
            echo json_encode($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function reset() {
        $dato = null;
        try {
            $dato = ServiceModel::reset();
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }

    public function delete($id) {
        $dato = null;
        try {
            $dato = ServiceModel::delete($id[0]);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }
    public function update($json, $id) {
        $dato = null;
        try {
            $datos = json_decode($json, true);
            $dato = ServiceModel::update($datos, $id[0]);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }

    public static function updateRutaId($data, $ids) {
        $dato = null;
        try {
            $datos = json_decode($data, true);
            $servicioId = $ids[0];
            $dato = ServiceModel::updateRutaId($datos, $servicioId);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }

    public function insert($json) {
        $dato = null;
        try {
            $datos = json_decode($json, true);
            $dato = ServiceModel::insert($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }  
}