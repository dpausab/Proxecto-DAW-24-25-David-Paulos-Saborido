<?php
include_once(API_ROUTE."model/Model.php");


class Ubicacion implements JsonSerializable{
    protected $id;
    protected $nombre;
    protected $latitud;
    protected $longitud;

    public function __construct($nombre, $latitud, $longitud, $id=null) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->latitud = $latitud;
        $this->longitud = $longitud;
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
     * Get the value of latitud
     */ 
    public function getLatitud()
    {
        return $this->latitud;
    }

    /**
     * Set the value of latitud
     *
     * @return  self
     */ 
    public function setLatitud($latitud)
    {
        $this->latitud = $latitud;

        return $this;
    }

    /**
     * Get the value of longitud
     */ 
    public function getLongitud()
    {
        return $this->longitud;
    }

    /**
     * Set the value of longitud
     *
     * @return  self
     */ 
    public function setLongitud($longitud)
    {
        $this->longitud = $longitud;

        return $this;
    }

}
class UbicacionModel extends Model
{

    public static function getAll($offset=null, $limit=null, $nombre=null)
    {
        
        $sql = "SELECT * FROM ubicaciones";
        if (isset($nombre) && !empty($nombre)) {
            $sql.= " WHERE nombre LIKE :nombre";
        }
        $sql.= " ORDER BY id ASC";

        if (isset($offset, $limit) && is_numeric($limit) && is_numeric($offset)) {
            $sql.= " LIMIT $limit OFFSET $offset";
        }
        $db = self::getConnection();
        $datos = [];
        $respuesta = null;
        $next = false;
        try {
            $stmt = $db->prepare($sql);
            if (isset($nombre) && !empty($nombre)) {
                $stmt->bindValue(':nombre', '%'.$nombre.'%', PDO::PARAM_STR);
            }
            $stmt->execute();
            $datos = [];
            foreach($stmt as $s){   
                $ubicacion = new Ubicacion($s['nombre'], $s['latitud'], $s['longitud'], $s['id']);
                $datos[] = $ubicacion;
            }

            if (count($datos)>=11)  {
                $next = true;
                array_pop($datos);
            }

            $respuesta = [
                'datos' => $datos,
                'next' => $next
            ];
        } catch (PDOException $th) {
            error_log("Error UbicacionModel->getAll()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }
        return $respuesta;
    }

    public static function get($ubicacionId):Ubicacion|null
    {
        $sql = "SELECT * FROM ubicaciones WHERE id=?";
        $db = self::getConnection();
        $datos = null;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $ubicacionId, PDO::PARAM_INT);
            $stmt->execute();
            if($s = $stmt->fetch()){
                $datos = new Ubicacion($s['nombre'], $s['latitud'], $s['longitud'], $s['id']);
            }
        } catch (Throwable $th) {
            error_log("Error UbicacionModel->get($ubicacionId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function insert($ubicacion)
    {
        $sql = "INSERT INTO ubicaciones (nombre, longitud, latitud) 
                VALUES (:nombre, :longitud, :latitud)";

        $db = self::getConnection();
        $db->beginTransaction();
        $respuesta = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":nombre", $ubicacion['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":longitud", $ubicacion['longitud'], PDO::PARAM_STR);
            $stmt->bindValue(":latitud", $ubicacion['latitud'], PDO::PARAM_STR);

            $stmt->execute();
            $lastId = $db->lastInsertId();
            $respuesta = isset($lastId) ? true : false;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error UbicacionModel->insert()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $respuesta;
    }

    public static function update($ubicacion, $ubicacionId)
    {
 
        $sql = "UPDATE ubicaciones SET
            nombre=:nombre,
            longitud=:longitud,
            latitud=:latitud
            WHERE id=:id";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":id", $ubicacionId, PDO::PARAM_INT);
            $stmt->bindValue(":nombre", $ubicacion['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":longitud", $ubicacion['longitud'], PDO::PARAM_STR);
            $stmt->bindValue(":latitud", $ubicacion['latitud'], PDO::PARAM_STR);

            $stmt->execute();
            $datos = true;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error UbicacionModel->update(" . implode(",", $ubicacion) . ", $ubicacionId)");
            error_log($th->getMessage());
            echo "ERROR".$th->getMessage();
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function delete($ubicacionId)
    {
        $sql = "DELETE FROM ubicaciones WHERE id=?";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $ubicacionId, PDO::PARAM_INT);
            $stmt->execute();
            $datos = $stmt->rowCount()>=1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error UbicacionModel->delete($ubicacionId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }
}