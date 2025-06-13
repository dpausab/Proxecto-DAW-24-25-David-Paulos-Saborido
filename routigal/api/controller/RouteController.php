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
            throw $th;
        }
    }
    public function getAll($ids) {
        $datos = [];
        try {
            $estado = $_GET['estado']!="" && $_GET['estado']!="null" ? $_GET['estado'] : null;
            $nombre = $_GET['nombre']!="" && $_GET['nombre']!="null" ? $_GET['nombre'] : null;
            $fecha = $_GET['fecha']!="" && $_GET['fecha']!="null" ? $_GET['fecha'] : null;
            $id = $_GET['id']!="" && $_GET['id']!="null" ? $_GET['id'] : null;
            
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
            throw $th;
        }
    }

    public function delete($id) {
        $dato = null;
        try {
            $dato = RouteModel::delete($id[0]);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }
    public function update($json, $id) {
        $dato = null;
        try {
            $datos = json_decode($json, true);
            $dato = RouteModel::update($datos, $id[0]);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }
    public function insert($json) {
        $dato = null;
        $mensaje = "Insertado con éxito.";
        try {
            $datos = json_decode($json, true);
            $dato = RouteModel::insert($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }  
}