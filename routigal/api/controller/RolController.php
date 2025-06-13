<?php

include_once("Controller.php");
include_once("model/RolModel.php");

class RolController extends Controller{
    public function get($id) {
        $datos=null;
        try {
            $datos = RolModel::get($id);
            echo json_encode($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function getAll($params) {
        $datos = [];
        try {
            $datos = RolModel::getAll();
            echo json_encode($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function delete($id) {
        $dato = null;
        try {
            $dato = RolModel::delete($id[0]);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }
    public function update($json, $id) {
        $dato = null;

        try {
            $datos = json_decode($json, true);
            $dato = RolModel::update($datos, $id[0]);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }
    public function insert($json) {
        $dato = null;

        try {
            $datos = json_decode($json, true);
            $dato = RolModel::insert($datos);
        } catch (\Throwable $th) {
            throw $th;
        }
        
        echo json_encode(['respuesta' => $dato]);
    }  
}