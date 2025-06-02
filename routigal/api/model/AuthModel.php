<?php
include_once("Model.php");

class AuthModel extends Model
{
    public static function login($user, $pwd)
    {
        $sql = "SELECT id, nombre, usuario, id_rol
        FROM usuarios WHERE usuario=:user AND pwd=:pwd";
        $db = self::getConnection();
        $stmt = $db->prepare($sql);
        $access = false;
        try {
            $stmt->bindValue(':user',$user, PDO::PARAM_STR);
            $stmt->bindValue(':pwd',$pwd, PDO::PARAM_STR);
            $stmt->execute();
            
            $access = $stmt->fetch(PDO::FETCH_ASSOC);
            
        } catch (PDOException $th) {
            echo json_encode(['mensaje' => 'Error iniciando sesión']);
            $access = false;
        }finally{
            $stmt = null;
            $db = null;
        }

        return $access;
    }

    public static function hasPermission($userId, $endpoint, $method) {
        $sql = "SELECT * FROM permisos p JOIN usuarios u ON u.id_rol = p.rol_id JOIN endpoints e ON e.id = p.endpoint_id
        WHERE u.id = :id AND e.nombre = :ep AND p.metodo = :metodo";

        $db = self::getConnection();
        $stmt = $db->prepare($sql);
        $result = false;
        try {
            $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':ep', $endpoint, PDO::PARAM_STR);
            $stmt->bindParam(':metodo', $method, PDO::PARAM_STR);

            $stmt->execute();
            $result = $stmt->rowCount()>=1;
        } catch (PDOException $ex) {
            $result = false;
            echo json_encode(['mensaje' => 'Error consultando los permisos']);
        } finally {
            $db = null;
            $stmt = null;
        }

        return $result;
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
            echo json_encode(['mensaje' => 'Error registrando al usuario']);
            $result = false;
        } finally {
            $db = null;
            $stmt = null;
        }

        return $result;
    }
}