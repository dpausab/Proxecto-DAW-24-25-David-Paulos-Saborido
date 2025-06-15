<?php

$config = file_get_contents(__DIR__ . '/../../config/config.json');

$datos_config = json_decode($config, true)['conexion'];

define("DB_DSN","mysql:host=".$datos_config['host'].";dbname=".$datos_config['database'].";charset=utf8mb4");
define("DB_USER", $datos_config['user']);
define("DB_PASS", $datos_config['password']);

class Model{

    protected static function getConnection(){
        $pdo = null;
        try {
            $pdo = new PDO(DB_DSN,DB_USER, DB_PASS);
        } catch (PDOException $e) {
            error_log("Error conectando a la base de datos...");
            error_log($e->getMessage());
            throw new Exception('Fallo obteniendo la conexión a la BBDD');
        }
        return $pdo;
    }
}