<?php
include_once("Model.php");

class Route implements JsonSerializable {
    protected $id;
    protected $nombre;
    protected $tiempoTotal;
    protected $distanciaTotal;
    protected $origen;
    protected $estado;
    protected $tecnico;
    protected $fecha;
    protected $horaSalida;

    public function __construct($nombre, $tiempoTotal, $distanciaTotal, $origen, $estado, $tecnico, $fecha, $horaSalida, $id=null) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->tiempoTotal = $tiempoTotal;
        $this->distanciaTotal = $distanciaTotal;
        $this->origen = $origen;
        $this->estado = $estado;
        $this->tecnico = $tecnico;
        $this->fecha = $fecha;
        $this->horaSalida = $horaSalida;
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
     * Get the value of distanciaTotal
     */ 
    public function getDistanciaTotal()
    {
        return $this->distanciaTotal;
    }

    /**
     * Set the value of distanciaTotal
     *
     * @return  self
     */ 
    public function setDistanciaTotal($distanciaTotal)
    {
        $this->distanciaTotal = $distanciaTotal;

        return $this;
    }

    /**
     * Get the value of tiempoTotal
     */ 
    public function getTiempoTotal()
    {
        return $this->tiempoTotal;
    }

    /**
     * Set the value of tiempoTotal
     *
     * @return  self
     */ 
    public function setTiempoTotal($tiempoTotal)
    {
        $this->tiempoTotal = $tiempoTotal;

        return $this;
    }

    /**
     * Get the value of tiempoTotal
     */ 
    public function getOrigen()
    {
        return $this->origen;
    }

    /**
     * Set the value of tiempoTotal
     *
     * @return  self
     */ 
    public function setOrigen($origen)
    {
        $this->origen = $origen;

        return $this;
    }

    /**
     * Get the value of estado
     */ 
    public function getEstado()
    {
        return $this->estado;
    }

    /**
     * Set the value of estado
     *
     * @return  self
     */ 
    public function setEstado($estado)
    {
        $this->estado = $estado;

        return $this;
    }

    /**
     * Get the value of estado
     */ 
    public function getTecnico()
    {
        return $this->tecnico;
    }

    /**
     * Set the value of estado
     *
     * @return  self
     */ 
    public function setTecnico($tecnico)
    {
        $this->tecnico = $tecnico;

        return $this;
    }

    /**
     * Get the value of estado
     */ 
    public function getFecha()
    {
        return $this->fecha;
    }

    /**
     * Set the value of estado
     *
     * @return  self
     */ 
    public function setFecha($fecha)
    {
        $this->fecha = $fecha;

        return $this;
    }

    /**
     * Get the value of estado
     */ 
    public function getHora()
    {
        return $this->horaSalida;
    }

    /**
     * Set the value of estado
     *
     * @return  self
     */ 
    public function setHora($hora)
    {
        $this->horaSalida = $hora;

        return $this;
    }

    public function jsonSerialize(): mixed {
        return get_object_vars($this);
    }
}

class RouteModel extends Model
{

    public static function getAll($offset=null, $limit=null, $id)
    {
        $sql = "SELECT r.id as id, r.nombre as nombre, tiempo_total as tiempo, km_totales as km, u.nombre as origen, er.nombre as estado, us.nombre as tecnico, r.fecha as fecha, r.hora_salida as hora FROM rutas r
            INNER JOIN ubicaciones u ON r.id_origen = u.id
            INNER JOIN estados_ruta er ON er.id = r.id_estado
            INNER JOIN usuarios us ON r.id_tecnico = us.id";
        if (isset($id)) {
            $sql .= ' WHERE r.id_tecnico=:id';
        }
        if (isset($offset, $limit)) {
            $sql .= " LIMIT $limit OFFSET $offset";
        } 
        $db = self::getConnection();
        $datos = [];
        $next = false;
        try {
            if (isset($id)) {
                $stmt = $db->prepare($sql);
                $stmt -> bindParam(':id', $id, PDO::PARAM_INT);
                $stmt -> execute();
            } else {
                $stmt = $db->query($sql);
            }
            if ($stmt->rowCount()===11) $next=true;
            foreach($stmt as $r){  
                $ruta = new Route($r['nombre'], $r['tiempo'],$r['km'], $r['origen'], $r['estado'], $r['tecnico'], $r['fecha'], $r['hora'], $r['id']);
                $datos[] = $ruta;
            }
            if ($next) array_pop($datos);
            $respuesta = [
                'datos' => $datos,
                'next' => $next
            ];
        } catch (PDOException $th) {
            error_log("Error ServiceModel->getAll()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }
        return $respuesta;
    }

    public static function get($rutaId):Route|null
    {
        $sql = "SELECT * FROM rutas WHERE id=?";
        $db = self::getConnection();
        $datos = null;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $rutaId, PDO::PARAM_INT);
            $stmt->execute();
            if($r = $stmt->fetch()){
                $datos = new Route($r['nombre'], $r['tiempo_total'],$r['km_totales'], $r['id_origen'], $r['id_estado'], $r['id_tecnico'], $r['fecha'], $r['hora_salida'], $r['id']);
            }
            
        } catch (Throwable $th) {
            error_log("Error RouteModel->get($rutaId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function insert($ruta)
    {
        $sql = "INSERT INTO rutas (nombre, tiempo_total, km_totales, id_origen, id_estado, id_tecnico, fecha, hora_salida) 
                VALUES (:nombre, :tt, :dt, :origen, :estado, :tecnico, :fecha, :hora)";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":nombre", $ruta['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":tt", $ruta['tiempoTotal'], PDO::PARAM_STR);
            $stmt->bindValue(":dt", $ruta['distanciaTotal'], PDO::PARAM_STR);
            $stmt->bindValue(":origen", $ruta['origen'], PDO::PARAM_INT);
            $stmt->bindValue(":estado", $ruta['estado'], PDO::PARAM_STR);
            $stmt->bindValue(":tecnico", $ruta['tecnico'], PDO::PARAM_STR);
            $stmt->bindValue(":fecha", $ruta['fecha'], PDO::PARAM_STR);
            $stmt->bindValue(":hora", $ruta['horaSalida'], PDO::PARAM_STR);

            $stmt->execute();
            $datos = $db->lastInsertId();
            $db->commit();
        } catch (PDOException $th) {
            $datos = $th->getMessage();
            error_log("Error RouteModel->insert()");
            error_log($th->getMessage());
            $db->rollBack();
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function update($ruta, $rutaId)
    {
 
        $sql = "UPDATE rutas SET
            nombre=:nombre,
            tiempo_total=:tt,
            km_totales=:dt,
            id_origen=:origen,
            id_estado=:estado,
            id_tecnico=:tecnico,
            fecha=:fecha,
            hora_salida=:hora
            WHERE id=:id";

        $db = self::getConnection();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":id", $rutaId, PDO::PARAM_INT);
            $stmt->bindValue(":nombre", $ruta['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":tt", $ruta['tiempoTotal'], PDO::PARAM_STR);
            $stmt->bindValue(":dt", $ruta['distanciaTotal'], PDO::PARAM_STR);
            $stmt->bindValue(":origen", $ruta['origen'], PDO::PARAM_INT);
            $stmt->bindValue(":estado", $ruta['estado'], PDO::PARAM_STR);
            $stmt->bindValue(":tecnico", $ruta['tecnico'], PDO::PARAM_STR);
            $stmt->bindValue(":fecha", $ruta['fecha'], PDO::PARAM_STR);
            $stmt->bindValue(":hora", $ruta['horaSalida'], PDO::PARAM_STR);

            $datos = $stmt->execute();
            $datos = $stmt->rowCount() == 1;
        } catch (PDOException $th) {
            error_log("Error RouteModel->update(" . implode(",", $ruta) . ", $rutaId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public static function delete($rutaId)
    {   
        
        $sql = "DELETE FROM rutas WHERE id=?";

        $db = self::getConnection();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $rutaId, PDO::PARAM_INT);
            $datos = $stmt->execute();
        } catch (PDOException $th) {
            error_log("Error RouteModel->delete($rutaId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }
}
