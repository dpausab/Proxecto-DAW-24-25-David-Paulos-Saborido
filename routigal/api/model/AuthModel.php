<?php
include_once("Model.php");

class AuthModel extends Model
{
    public static function login($user, $pwd): bool
    {
        $sql = "SELECT *
        FROM users WHERE user=:user AND pwd=:pwd";
        $db = self::getConnection();
        $stmt = $db->prepare($sql);
        $access = false;
        try {
            $stmt->bindValue(':user',$user, PDO::PARAM_STR);
            $stmt->bindValue(':pwd',$pwd, PDO::PARAM_STR);
            $access = $stmt->execute();
            $access = $stmt->rowCount() >= 1;
        } catch (PDOException $th) {
            error_log("Error en la consulta de autenticacion".$th->getMessage());
            $access = false;
        }finally{
            $stmt = null;
            $db = null;
        }

        return $access;
    }

    public static function register($user, $pwd) {
        $sql = "INSERT into users (user, pwd) values (:user, :pwd)";
        $db = self::getConnection();
        $stmt = $db->prepare($sql);
        $result = false;
        try {
            $stmt->bindValue(':user',$user, PDO::PARAM_STR);
            $stmt->bindValue(':pwd',$pwd, PDO::PARAM_STR);
            $result = $stmt->execute();
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