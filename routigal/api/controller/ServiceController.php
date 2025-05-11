<?php

include_once("Controller.php");
include_once("model/ServiceModel.php");

class ServiceController extends Controller{
    public function get($id) {
    }
    public function getAll() {
        $datos = [];
        try {
            $model = new ServiceModel();
            $datos = $model->getAll();
            echo json_encode($datos);
        } catch (\Throwable $th) {
            echo json_encode([
                'error' => $th->getMessage(),
                'datos' => $datos
            ]);
        }
    }
    public function delete($id) {

    }
    public function update($id, $object) {

    }
    public function insert($object) {

    }  
}