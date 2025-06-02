<?php
include_once("Model.php");

class User implements JsonSerializable{
    protected $id;
    protected $nombre;
    protected $pwd;
    protected $rol;

    public function __construct($nombre, $rol, $id=null, $pwd=null) {
        $this->id = $id;
        $this->pwd = $pwd;
        $this->nombre = $nombre;
        $this->rol = $rol;
    }

    public function jsonSerialize() : mixed {
        return get_object_vars($this);
    }
    
    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of id
     */ 
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;

        return $this;
    }

    /**
     * Get the value of id
     */ 
    public function getPwd()
    {
        return $this->pwd;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setPwd($pwd)
    {
        $this->pwd = $pwd;

        return $this;
    }

    /**
     * Get the value of id
     */ 
    public function getRol()
    {
        return $this->nombre;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setRol($rol)
    {
        $this->rol = $rol;

        return $this;
    }
}
class UserModel extends Model
{

    public static function getAll($offset=null, $limit=null)
    {
        $sql = "SELECT id, nombre, id_rol FROM usuarios ORDER BY id DESC";
        if (isset($offset, $limit)) {
            $sql .= " LIMIT $limit OFFSET $offset";
        } 
        $db = self::getConnection();
        $datos = [];
        $next = false;
        try {
            $stmt = $db->query($sql);
            if ($stmt->rowCount()===11) $next=true;
            $datos = [];
            foreach($stmt as $s){   
                $user = new user($s['nombre'], $s['id_rol'], $s['id']);
                $datos[] = $user;
            }
            if ($next) array_pop($datos);
            $respuesta = [
                'datos' => $datos,
                'next' => $next
            ];
        } catch (PDOException $th) {
            error_log("Error UserModel->getAll()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }
        return $respuesta;
    }

    public static function getTecnicos($offset=null, $limit=null)
    {
        if (isset($offset, $limit)) {
            $sql = "SELECT id, nombre, id_rol FROM usuarios WHERE id_rol=2 ORDER BY id DESC LIMIT $limit OFFSET $offset";
        } else {
            $sql = "SELECT id, nombre, id_rol FROM usuarios WHERE id_rol=2 ORDER BY id DESC";
        }
        $db = self::getConnection();
        $datos = [];
        try {
            $stmt = $db->query($sql);
            $datos = [];
            foreach($stmt as $s){   
                $user = new user($s['nombre'], $s['id_rol'], $s['id']);
                $datos[] = $user;
            }
        } catch (PDOException $th) {
            error_log("Error UserModel->getAll()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }
        return $datos;
    }

    public static function get($userId):user|null
    {
        $sql = "SELECT * FROM usuarios WHERE id=?";
        $db = self::getConnection();
        $datos = null;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $userId, PDO::PARAM_INT);
            $stmt->execute();
            if($s = $stmt->fetch()){
                $datos = new user($s['nombre'], $s['id_rol'], $s['id']);
            }
        } catch (Throwable $th) {
            error_log("Error UserModel->get($userId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function getActual():user|null
    {
        $sql = "SELECT id, nombre, usuario, id_rol FROM usuarios WHERE id=?";
        $db = self::getConnection();
        $datos = null;
        $userId = $_SESSION['user']['id'];
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $userId, PDO::PARAM_INT);
            $stmt->execute();
            if($s = $stmt->fetch()){
                $datos = new user($s['nombre'], $s['id_rol'], $s['id']);
            }
        } catch (Throwable $th) {
            error_log("Error UserModel->get($userId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function insert($user)
    {
        $sql = "INSERT INTO usuarios (nombre, usuario, pwd, id_rol) 
                VALUES (:nombre, :user, :pwd, :rol)";

        $db = self::getConnection();
        $db->beginTransaction();
        $respuesta = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":nombre", $user['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":user", $user['usuario'], PDO::PARAM_STR);
            $stmt->bindValue(":pwd", sha1($user['pwd']), PDO::PARAM_STR);
            $stmt->bindValue(":rol", $user['rol'], PDO::PARAM_INT);

            $stmt->execute();
            $respuesta = $stmt->rowCount()>=1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error userModel->insert()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $respuesta;
    }

    public static function update($user, $userId)
    {
 
        $sql = "UPDATE usuarios SET
            nombre=:user,
            pwd=:pwd,
            id_rol=:rol
            WHERE id=:id";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":id", $userId, PDO::PARAM_INT);
            $stmt->bindValue(":user", $user['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":pwd", $user['pwd'], PDO::PARAM_STR);
            $stmt->bindValue(":rol", $user['id_rol'], PDO::PARAM_INT);

            $stmt->execute();
            $datos = true;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error UserModel->update(" . implode(",", $user) . ", $userId)");
            error_log($th->getMessage());
            echo "ERROR".$th->getMessage();
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function delete($userId)
    {
        $sql = "DELETE FROM usuarios WHERE id=?";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $userId, PDO::PARAM_INT);
            $stmt->execute();
            $datos = $stmt->rowCount()>=1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error UserModel->delete($userId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }
}