<?php
include_once("Model.php");

class Route {
    protected $id;
    protected $nombre;
    protected $distanciaTotal;
    protected $tiempoTotal;
    protected $estado;
    protected $tecnico;
    protected $fecha;

    public function __construct($nombre, $distanciaTotal, $tiempoTotal, $estado, $tecnico, $fecha, $id=null) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->distanciaTotal = $distanciaTotal;
        $this->tiempoTotal = $tiempoTotal;
        $this->estado = $estado;
        $this->tecnico = $tecnico;
        $this->fecha = $fecha;
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
        return $this->tecnico;
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
}

class RouteModel extends Model
{

    public function getAll()
    {
        $sql = "SELECT * FROM ruta";
        $db = self::getConnection();
        $datos = [];
        try {
            $db->beginTransaction();
            $stmt = $db->query($sql);
            $datos = [];
            foreach($stmt as $r){
                $ruta = new Route($r['id'], $r['nombre'], $r['distancia_total'],$r['tiempo_total'],$r['estado'], $r['id_tecnico'], $r['fecha']);
                $datos[] = $ruta;
            }
        } catch (PDOException $th) {
            error_log("Error RouteModel->getAll()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public function get($rutaId):Route|null
    {
        $sql = "SELECT * FROM ruta WHERE id=?";
        $db = self::getConnection();
        $datos = null;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $rutaId, PDO::PARAM_INT);
            $stmt->execute();
            if($r = $stmt->fetch()){
                $datos = new Route($r['id'], $r['nombre'], $r['distancia_total'],$r['tiempo_total'],$r['estado'], $r['id_tecnico'], $r['fecha']);
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

    public function insert($ruta)
    {
        $sql = "INSERT INTO ruta (nombre, distancia_total, tiempo_total, estado, tecnico, fecha) 
                VALUES (:nombre, :dt, :tt, :estado, :tecnico, :fecha)";

        $db = self::getConnection();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":nombre", $ruta->nombre, PDO::PARAM_STR);
            $stmt->bindValue(":dt", $ruta->distanciaTotal, PDO::PARAM_INT);
            $stmt->bindValue(":tt", $ruta->tiempoTotal, PDO::PARAM_STR);
            $stmt->bindValue(":estado", $ruta->estado, PDO::PARAM_STR);
            $stmt->bindValue(":tecnico", $ruta->tecnico, PDO::PARAM_STR);
            $stmt->bindValue(":fecha", $ruta->fecha, PDO::PARAM_STR);

            $datos = $stmt->execute();
        } catch (PDOException $th) {
            error_log("Error BandaModel->insert()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public function update($ruta, $rutaId)
    {
 
        $sql = "UPDATE ruta SET
            nombre=:nombre,
            distancia_total=:dt,
            tiempo_total=:tt,
            estado=:estado,
            tecnico=:tecnico,
            fecha=:fecha,
            WHERE id=:id";

        $db = self::getConnection();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":nombre", $ruta->nombre, PDO::PARAM_STR);
            $stmt->bindValue(":dt", $ruta->distanciaTotal, PDO::PARAM_INT);
            $stmt->bindValue(":tt", $ruta->tiempoTotal, PDO::PARAM_STR);
            $stmt->bindValue(":estado", $ruta->estado, PDO::PARAM_STR);
            $stmt->bindValue(":tecnico", $ruta->tecnico, PDO::PARAM_STR);
            $stmt->bindValue(":fecha", $ruta->fecha, PDO::PARAM_STR);

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

    public function delete($rutaId)
    {
        $sql = "DELETE FROM ruta WHERE id=?";

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
