<?php
include_once(API_ROUTE."model/Model.php");

class Rol implements JsonSerializable{
    protected $id;
    protected $nombre;

    public function __construct($nombre, $id=null) {
        $this->id = $id;
        $this->nombre = $nombre;
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
}
class RolModel extends Model
{

    public static function getAll()
    {
        $sql = "SELECT * FROM roles";
        
        $db = self::getConnection();
        $datos = [];
        try {
            $stmt = $db->query($sql);
            $datos = [];
            foreach($stmt as $s){   
                $rol = new Rol($s['nombre'], $s['id']);
                $datos[] = $rol;
            }
        } catch (PDOException $th) {
            error_log("Error RolModel->getAll()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }
        return $datos;
    }

    public static function get($rolId):Rol|null
    {
        $sql = "SELECT * FROM roles WHERE id=?";
        $db = self::getConnection();
        $datos = null;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $rolId, PDO::PARAM_INT);
            $stmt->execute();
            if($s = $stmt->fetch()){
                $datos = new Rol($s['nombre'], $s['id']);
            }
        } catch (Throwable $th) {
            error_log("Error RolModel->get($rolId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function insert($rol)
    {
        $sql = "INSERT INTO roles (nombre) 
                VALUES (:nombre)";

        $db = self::getConnection();
        $db->beginTransaction();
        $respuesta = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":nombre", $rol['nombre'], PDO::PARAM_STR);

            $stmt->execute();
            $lastId = $db->lastInsertId();
            $respuesta = isset($lastId) ? true : false;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error RolModel->insert()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $respuesta;
    }

    public static function update($rol, $rolId)
    {
 
        $sql = "UPDATE roles SET
            nombre=:rol
            WHERE id=:id";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":id", $rolId, PDO::PARAM_INT);
            $stmt->bindValue(":rol", $rol['nombre'], PDO::PARAM_STR);

            $stmt->execute();
            $datos = true;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error RolModel->update(" . implode(",", $rol) . ", $rolId)");
            error_log($th->getMessage());
            echo "ERROR".$th->getMessage();
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function delete($rolId)
    {
        $sql = "DELETE FROM roles WHERE id=?";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $rolId, PDO::PARAM_INT);
            $stmt->execute();
            $datos = $stmt->rowCount()>=1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error RolModel->delete($rolId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }
}