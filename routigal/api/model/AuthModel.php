<?php
include_once("Model.php");

class AuthModel extends Model
{
    public static function login($user, $pwd)
    {
        $sql = "SELECT *
        FROM usuarios WHERE usuario=:user AND pwd=:pwd";
        $db = self::getConnection();
        $stmt = $db->prepare($sql);
        $access = false;
        try {
            $stmt->bindValue(':user',$user, PDO::PARAM_STR);
            $stmt->bindValue(':pwd',$pwd, PDO::PARAM_STR);
            $stmt->execute();
            
            $access = $stmt->rowCount()>=1;
            
        } catch (PDOException $th) {
            error_log("Error en la consulta de autenticacion".$th->getMessage());
            $access = false;
        }finally{
            $stmt = null;
            $db = null;
        }

        return $access;
    }

    public static function register($json) {
        $sql = "INSERT into usuarios (nombre, usuario, pwd, id_rol) values (:nombre, :user, :pwd, :rol)";
        $db = self::getConnection();
        $stmt = $db->prepare($sql);
        $result = false;
        try {
            $stmt->bindValue(':nombre', $json['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(':user', $json['user'], PDO::PARAM_STR);
            $stmt->bindValue(':pwd', sha1($json['pwd']), PDO::PARAM_STR);
            $stmt->bindValue(':rol', $json['rol'], PDO::PARAM_INT);
            $stmt->execute();
            
            $result = $stmt->rowCount() >= 1;
        } catch (PDOException $th) {
            error_log("Error registrando al usuario".$th->getMessage());
            $result = false;
        } finally {
            $db = null;
            $stmt = null;
        }

        return $result;
    }
}