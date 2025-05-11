<?php
include_once("Model.php");

class Service implements JsonSerializable{
    protected $id;
    protected $ruta;
    protected $cliente;
    protected $latitud;
    protected $longitud;
    protected $estado;
    protected $descripcion;
    protected $tiempoEstimado;

    public function __construct($estado, $cliente, $latitud, $longitud, $descripcion, $tiempoEstimado, $ruta=null, $id=null) {
        $this->id = $id;
        $this->ruta = $ruta;
        $this->cliente = $cliente;
        $this->latitud = $latitud;
        $this->longitud = $longitud;
        $this->estado = $estado;
        $this->descripcion = $descripcion;
        $this->tiempoEstimado = $tiempoEstimado;
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
    public function getRuta()
    {
        return $this->ruta;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setRuta($ruta)
    {
        $this->ruta = $ruta;

        return $this;
    }

    /**
     * Get the value of cliente
     */ 
    public function getCliente()
    {
        return $this->cliente;
    }

    /**
     * Set the value of cliente
     *
     * @return  self
     */ 
    public function setCliente($cliente)
    {
        $this->cliente = $cliente;

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
     * Get the value of descripcion
     */ 
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    /**
     * Set the value of descripcion
     *
     * @return  self
     */ 
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    /**
     * Get the value of tiempoEstimado
     */ 
    public function getTiempoEstimado()
    {
        return $this->tiempoEstimado;
    }

    /**
     * Set the value of tiempoEstimado
     *
     * @return  self
     */ 
    public function setTiempoEstimado($tiempoEstimado)
    {
        $this->tiempoEstimado = $tiempoEstimado;

        return $this;
    }
}
class ServiceModel extends Model
{

    public function getAll()
    {
        $sql = "SELECT * FROM servicio";
        $db = self::getConnection();
        $datos = [];
        try {
            $stmt = $db->query($sql);
            $datos = [];
            foreach($stmt as $s){   
                $servicio = new Service($s['id_estado'], $s['cliente'], $s['latitud'], $s['longitud'], $s['descripcion'],$s['tiempoEstimado'], $s['id_ruta'], $s['id']);
                $datos[] = $servicio;
            }
        } catch (PDOException $th) {
            error_log("Error ServiceModel->getAll()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }
        return $datos;
    }

    public function get($servicioId):Service|null
    {
        $sql = "SELECT * FROM servicio WHERE id=?";
        $db = self::getConnection();
        $datos = null;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $servicioId, PDO::PARAM_INT);
            $stmt->execute();
            if($s = $stmt->fetch()){
                $datos = new Service($s['id'], $s['ruta'], $s['cliente'], $s['longitud'],$s['latitud'],$s['estado'], $s['descricion'], $s['tiempoEstimado']);
            }
        } catch (Throwable $th) {
            error_log("Error ServiceModel->get($servicioId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public function insert($servicio)
    {
        $sql = "INSERT INTO servicio (cliente, longitud, latitud, estado, descripcion, tiempoEstimado) 
                VALUES (:cliente, :longitud, :latitud, :estado, :descripcion, :te)";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":cliente", $servicio->cliente, PDO::PARAM_STR);
            $stmt->bindValue(":longitud", $servicio->longitud, PDO::PARAM_INT);
            $stmt->bindValue(":latitud", $servicio->latitud, PDO::PARAM_STR);
            $stmt->bindValue(":estado", $servicio->estado, PDO::PARAM_STR);
            $stmt->bindValue(":descripcion", $servicio->descripcion, PDO::PARAM_STR);
            $stmt->bindValue(":te", $servicio->tiempoEstimado, PDO::PARAM_STR);

            $datos = $stmt->execute();
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error ServiceModel->insert()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public function update($servicio, $servicioId)
    {
 
        $sql = "UPDATE servicio SET
            nombre=:nombre,
            distancia_total=:dt,
            tiempo_total=:tt,
            estado=:estado,
            tecnico=:tecnico,
            fecha=:fecha
            WHERE id=:id";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":nombre", $servicio->nombre, PDO::PARAM_STR);
            $stmt->bindValue(":dt", $servicio->distanciaTotal, PDO::PARAM_INT);
            $stmt->bindValue(":tt", $servicio->tiempoTotal, PDO::PARAM_STR);
            $stmt->bindValue(":estado", $servicio->estado, PDO::PARAM_STR);
            $stmt->bindValue(":tecnico", $servicio->tecnico, PDO::PARAM_STR);
            $stmt->bindValue(":fecha", $servicio->fecha, PDO::PARAM_STR);

            $datos = $stmt->execute();
            $datos = $stmt->rowCount() == 1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error ServiceModel->update(" . implode(",", $servicio) . ", $servicioId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public function updateRutaId($servicioId, $rutaId)
    {
 
        $sql = "UPDATE servicio SET
            id_ruta=:ruta
            WHERE id=:id";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":ruta", $rutaId, PDO::PARAM_STR);
            $stmt->bindValue(":id", $servicioId, PDO::PARAM_STR);

            $datos = $stmt->execute();
            $datos = $stmt->rowCount() == 1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error ServiceModel->updateRutaId()");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }

    public function delete($servicioId)
    {
        $sql = "DELETE FROM servicio WHERE id=?";

        $db = self::getConnection();
        $db->beginTransaction();
        $datos = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $servicioId, PDO::PARAM_INT);
            $datos = $stmt->execute();
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error ServiceModel->delete($servicioId)");
            error_log($th->getMessage());
        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }
}