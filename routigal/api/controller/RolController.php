<?php

include_once("Controller.php");
include_once(API_ROUTE."model/RolModel.php");

class RolController extends Controller{
    public function get($id) {
        $datos=null;
        try {
            $datos = RolModel::get($id);
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }
    public function getAll($params) {
        $datos = [];
        try {
            $datos = RolModel::getAll();
            echo json_encode($datos);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }
    public function delete($id) {
        $dato = null;
        try {
            $dato = RolModel::delete($id[0]);
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
            $dato = RolModel::update($datos, $id[0]);
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
            $dato = RolModel::insert($datos);
            echo json_encode(['respuesta' => $dato]);
        } catch (\Throwable $th) {
            http_response_code(400);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }  
}