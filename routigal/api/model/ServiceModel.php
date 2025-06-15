<?php
include_once(API_ROUTE."model/Model.php");


class Service implements JsonSerializable {
    protected $id;
    protected $nombre;
    protected $id_estado;
    protected $nombre_cliente;
    protected $latitud;
    protected $longitud;
    protected $direccion;
    protected $fecha_servicio;
    protected $hora_servicio;
    protected $id_ruta;
    protected $orden;
    protected $duracion_estimada;
    protected $nombre_estado;
    protected $id_tecnico;

    public function __construct($nombre, $id_estado, $nombre_cliente, $latitud, $longitud, $direccion, $fecha_servicio, $hora_servicio, $duracion_estimada, $nombre_estado= null, $id_tecnico=null, $orden = null, $id_ruta = null, $id = null) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->id_estado = $id_estado;
        $this->nombre_cliente = $nombre_cliente;
        $this->latitud = $latitud;
        $this->longitud = $longitud;
        $this->direccion = $direccion;
        $this->fecha_servicio = $fecha_servicio;
        $this->hora_servicio = $hora_servicio;
        $this->orden = $orden;
        $this->id_ruta = $id_ruta;
        $this->duracion_estimada = $duracion_estimada;
        $this->nombre_estado = $nombre_estado;
        $this->id_tecnico = $id_tecnico;
    }

    public function jsonSerialize():mixed {
        return get_object_vars($this);
    }

    public function getId() { 
        return $this->id; 
    }
    public function setId($id) { 
        $this->id = $id; 
        return $this; 
    }

    public function getNombre() { 
        return $this->nombre; 
    }
    public function setNombre($nombre) { 
        $this->nombre = $nombre; 
        return $this; 
    }

    public function getIdEstado() { 
        return $this->id_estado; 
    }
    public function setIdEstado($id_estado) { 
        $this->id_estado = $id_estado; 
        return $this; 
    }

    public function getNombreEstado() { 
        return $this->nombre_estado; 
    }
    public function setNombreEstado($nombre_estado) { 
        $this->nombre_estado = $nombre_estado; 
        return $this; 
    }

    public function getNombreCliente() { 
        return $this->nombre_cliente; 
    }
    public function setNombreCliente($nombre_cliente) { 
        $this->nombre_cliente = $nombre_cliente; 
        return $this; 
    }

    public function getLatitud() {
         return $this->latitud; 
        }
    public function setLatitud($latitud) { 
        $this->latitud = $latitud;
         return $this; 
    }

    public function getLongitud() { 
        return $this->longitud; 
    }
    public function setLongitud($longitud) {
        $this->longitud = $longitud;
         return $this; 
    }

    public function getDireccion() { 
        return $this->direccion; 
    }
    public function setDireccion($direccion) { 
        $this->direccion = $direccion; 
        return $this; 
    }

    public function getFecha() { 
        return $this->fecha_servicio; 
    }
    public function setFecha($fecha_servicio) { 
        $this->fecha_servicio = $fecha_servicio; 
        return $this;
    }

    public function getHora() { 
        return $this->hora_servicio; 
    }
    public function setHora($hora_servicio) { 
        $this->hora_servicio = $hora_servicio; 
        return $this; 
    }

    public function getIdRuta() { 
        return $this->id_ruta; 
    }
    public function setIdRuta($id_ruta) { 
        $this->id_ruta = $id_ruta;
        return $this; 
    }

    public function getOrden() { 
        return $this->orden; 
    }
    public function setOrden($orden) { 
        $this->orden = $orden;
        return $this; 
    }

    public function getDuracionEstimada() { 
        return $this->duracion_estimada; 
    }
    public function setDuracionEstimada($duracion_estimada) { 
        $this->duracion_estimada = $duracion_estimada; 
        return $this; 
    }

    public function getTecnico() { 
        return $this->id_tecnico; 
    }
    public function setTecnico($id_tecnico) { 
        $this->id_tecnico = $id_tecnico; 
        return $this; 
    }

}

class ServiceModel extends Model {

    public static function getAll($offset = null, $limit = null, $nombre=null, $fecha=null, $estado=null, $id=null) {

        $filtrosQuery = [];
        $filtrosBind = [];

        if (isset($nombre) && !empty($nombre)) {
            $filtrosQuery[] = 's.nombre_cliente LIKE :nombre';
            $filtrosBind[':nombre'] = '%'.$nombre.'%';
        }

        if (isset($fecha)) {
            $filtrosQuery[] = 's.fecha_servicio <= :fecha';
            $filtrosBind[':fecha'] = $fecha;
        }

        if (isset($estado)) {
            $filtrosQuery[] = 's.id_estado = :estado';
            $filtrosBind[':estado'] = $estado;
        }

        if (isset($id)) {
            $filtrosQuery[] = 's.id_tecnico = :id';
            $filtrosBind[':id'] = $id;
        }

        $sql = "SELECT s.nombre as nombre, id_estado, nombre_cliente, latitud, longitud, direccion, fecha_servicio, hora_servicio,
        duracion_estimada, id_tecnico, orden, id_ruta, s.id as id, es.nombre as nombre_estado
        FROM servicios s INNER JOIN estados_servicio es ON s.id_estado = es.id";
        
        if (count($filtrosQuery) && !empty($filtrosQuery)) {
            $sql.= " WHERE ". implode(" AND ", $filtrosQuery);
        }

        $sql.= ' ORDER BY s.id DESC';
        if (isset($offset, $limit) && is_numeric($offset) && is_numeric($limit)) {
            $limit = $limit+1;
            $sql .= " LIMIT $limit OFFSET $offset";
        } 
        
        $db = self::getConnection();
        $datos = [];
        $next = false;
        $respuesta = null;
        try {
            $stmt = $db->prepare($sql);
            if (count($filtrosBind) && !empty($filtrosBind)) {
                foreach($filtrosBind as $key => $value) {
                    $pdo_param = is_numeric($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
                    $stmt->bindValue($key, $value, $pdo_param);
                }
            }

            $stmt->execute();
            foreach ($stmt as $s) {
                $servicio = new Service(
                    $s['nombre'],
                    $s['id_estado'],
                    $s['nombre_cliente'],
                    $s['latitud'],
                    $s['longitud'],
                    $s['direccion'],
                    $s['fecha_servicio'],
                    $s['hora_servicio'],
                    $s['duracion_estimada'],
                    $s['nombre_estado'],
                    $s['id_tecnico'],
                    $s['orden'],
                    $s['id_ruta'],
                    $s['id']
                );
                $datos[] = $servicio;
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
            error_log("Error ServicioModel->getAll()");
            error_log($th->getMessage());
            throw new Exception("Error recuperando los servicios");

        } finally {
            $stmt = null;
            $db = null;
        }
        return $respuesta;
    }

    public static function getDisponibles($id=null) {
        if (isset($id)) {
            $sql = "SELECT * FROM servicios where id_estado=1 OR id_ruta=:id";
        } else {
            $sql = "SELECT * FROM servicios where id_estado=1";
        }
        $db = self::getConnection();
        $datos = [];
        $respuesta = null;
        try {
            if (isset($id)) {
                $stmt = $db->prepare($sql);
                $stmt->bindParam(':id', $id[0], PDO::PARAM_INT);
                $stmt->execute();
            } else {
                $stmt = $db->query($sql);
            }
            foreach ($stmt as $s) {
                $servicio = new Service(
                    $s['nombre'],
                    $s['id_estado'],
                    $s['nombre_cliente'],
                    $s['latitud'],
                    $s['longitud'],
                    $s['direccion'],
                    $s['fecha_servicio'],
                    $s['hora_servicio'],
                    $s['duracion_estimada'],
                    null,
                    $s['id_tecnico'],
                    $s['orden'],
                    $s['id_ruta'],
                    $s['id']
                );
                $datos[] = $servicio;
            }
            $respuesta = $datos;
        } catch (PDOException $th) {
            error_log("Error ServicioModel->getAll()");
            error_log($th->getMessage());
            throw new Exception("Error recuperando los servicios");

        } finally {
            $stmt = null;
            $db = null;
        }
        return $respuesta;
    }

    public static function getPorRuta($id=null) {
       
        $sql = "SELECT * FROM servicios where id_ruta=:id";
        
        $db = self::getConnection();
        $datos = [];
        $respuesta = null;
        try {
            if (isset($id)) {
                $stmt = $db->prepare($sql);
                $stmt->bindParam(':id', $id[0], PDO::PARAM_INT);
                $stmt->execute();
            } else {
                $stmt = $db->query($sql);
            }
            foreach ($stmt as $s) {
                $servicio = new Service(
                    $s['nombre'],
                    $s['id_estado'],
                    $s['nombre_cliente'],
                    $s['latitud'],
                    $s['longitud'],
                    $s['direccion'],
                    $s['fecha_servicio'],
                    $s['hora_servicio'],
                    $s['duracion_estimada'],
                    null,
                    $s['id_tecnico'],
                    $s['orden'],
                    $s['id_ruta'],
                    $s['id']
                );
                $datos[] = $servicio;
            }
            $respuesta = $datos;
        } catch (PDOException $th) {
            error_log("Error ServicioModel->getPorRuta()");
            error_log($th->getMessage());
            throw new Exception("Error recuperando los servicios");

        } finally {
            $stmt = null;
            $db = null;
        }
        return $respuesta;
    }

    public static function get($servicioId): ?Service {
        $sql = "SELECT * FROM servicios WHERE id = ?";
        $db = self::getConnection();
        $datos = null;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $servicioId, PDO::PARAM_INT);
            $stmt->execute();
            if ($s = $stmt->fetch()) {
                $datos = new Service(
                    $s['nombre'],
                    $s['id_estado'],
                    $s['nombre_cliente'],
                    $s['latitud'],
                    $s['longitud'],
                    $s['direccion'],
                    $s['fecha_servicio'],
                    $s['hora_servicio'],
                    $s['duracion_estimada'],
                    null,
                    $s['id_tecnico'],
                    $s['orden'],
                    $s['id_ruta'],
                    $s['id']
                );
            }
        } catch (Throwable $th) {
            error_log("Error ServicioModel->get($servicioId)");
            error_log($th->getMessage());
            throw new Exception("Error recuperando el servicio");

        } finally {
            $stmt = null;
            $db = null;
        }
        return $datos;
    }

    public static function insert($servicio) {
        $sql = "INSERT INTO servicios 
            (nombre, id_estado, nombre_cliente, latitud, longitud, direccion, fecha_servicio, hora_servicio, duracion_estimada, nombre_estado, id_tecnico, orden, id_ruta) 
            VALUES 
            (:nombre, 1, :nombre_cliente, :latitud, :longitud, :direccion, :fecha, :hora, :duracion_estimada, null, null, null, null)";

        $db = self::getConnection();
        $db->beginTransaction();
        $respuesta = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":nombre", $servicio['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":nombre_cliente", $servicio['cliente'], PDO::PARAM_STR);
            $stmt->bindValue(":latitud", $servicio['latitud'], PDO::PARAM_STR);
            $stmt->bindValue(":longitud", $servicio['longitud'], PDO::PARAM_STR);
            $stmt->bindValue(":direccion", $servicio['direccion'], PDO::PARAM_STR);
            $stmt->bindValue(":fecha", $servicio['fecha'], PDO::PARAM_STR);
            $stmt->bindValue(":hora", $servicio['hora'], PDO::PARAM_STR);
            $stmt->bindValue(":duracion_estimada", $servicio['tiempoEstimado'], PDO::PARAM_STR);

            $stmt->execute();
            $lastId = $db->lastInsertId();
            $respuesta = isset($lastId) ? true : false;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error ServicioModel->insert()");
            error_log($th->getMessage());
            throw new Exception("Error creando el servicio");

        } finally {
            $stmt = null;
            $db = null;
        }

        return $respuesta;
    }

    public static function update($servicio, $servicioId) {

        $sql = "UPDATE servicios SET
        nombre = :nombre,
        nombre_cliente = :nombre_cliente,
        latitud = :latitud,
        longitud = :longitud,
        direccion = :direccion,
        fecha_servicio = :fecha,
        hora_servicio = :hora,
        duracion_estimada = :duracion_estimada
        WHERE id = :id";
        

        $db = self::getConnection();
        $db->beginTransaction();
        $resultado = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":id", $servicioId, PDO::PARAM_INT);
            $stmt->bindValue(":nombre", $servicio['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":nombre_cliente", $servicio['cliente'], PDO::PARAM_STR);
            $stmt->bindValue(":latitud", $servicio['latitud'], PDO::PARAM_STR);
            $stmt->bindValue(":longitud", $servicio['longitud'], PDO::PARAM_STR);
            $stmt->bindValue(":direccion", $servicio['direccion'], PDO::PARAM_STR);
            $stmt->bindValue(":fecha", $servicio['fecha'], PDO::PARAM_STR);
            $stmt->bindValue(":hora", $servicio['hora'], PDO::PARAM_STR);
            $stmt->bindValue(":duracion_estimada", $servicio['tiempoEstimado'], PDO::PARAM_STR);

            $stmt->execute();
            $resultado = true;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error ServicioModel->update(" . implode(",", $servicio) . ", $servicioId)");
            error_log($th->getMessage());
            throw new Exception("Error editando el servicio");
        } finally {
            $stmt = null;
            $db = null;
        }
        return $resultado;
    }

    public static function updateRutaId($datos, $id) {
        $sql = "UPDATE servicios SET id_ruta = :ruta, id_estado = :estado, duracion_estimada=:estimado, orden=:orden, id_tecnico=:tecnico WHERE id = :id";

        $db = self::getConnection();
        $db->beginTransaction();
        $resultado = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":ruta", $datos['id_ruta'], PDO::PARAM_INT);
            $stmt->bindValue(":estado", $datos['id_estado'], PDO::PARAM_INT);
            $stmt->bindValue(":estimado", $datos['estimado'], PDO::PARAM_STR);
            $stmt->bindValue(":orden", $datos['orden'], PDO::PARAM_INT);
            $stmt->bindValue(":tecnico", $datos['tecnico'], PDO::PARAM_INT);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);

            $stmt->execute();
            $resultado = $stmt->rowCount() === 1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            $resultado = $th->getMessage();
            error_log("Error ServicioModel->updateRutaId()");
            error_log($th->getMessage());
            throw new Exception("Error actualizando el servicio");

        } finally {
            $stmt = null;
            $db = null;
        }

        return $resultado;
    }

    public static function completar($id) {
        $sql = "UPDATE servicios SET id_estado = 3 WHERE id = :id";

        $db = self::getConnection();
        $db->beginTransaction();
        $resultado = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);

            $stmt->execute();
            $resultado = $stmt->rowCount() === 1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            $resultado = $th->getMessage();
            error_log("Error ServicioModel->updateRutaId()");
            error_log($th->getMessage());
            throw new Exception("Error completando el servicio");

        } finally {
            $stmt = null;
            $db = null;
        }

        return $resultado;
    
    }

    public static function reset() {
        $sql = "UPDATE servicios SET id_ruta = null, id_estado = 1, orden=null, id_tecnico=null";

        $db = self::getConnection();
        $db->beginTransaction();
        try {
            $stmt = $db->query($sql);
            $resultado = $stmt->rowCount() >= 1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            $resultado = $th->getMessage();
            error_log("Error ServicioModel->updateRutaId()");
            error_log($th->getMessage());
            throw new Exception("Error reseteando el servicio");

        } finally {
            $stmt = null;
            $db = null;
        }

        return $resultado;
    }

    public static function delete($servicioId) {
        $sql = "DELETE FROM servicios WHERE id = ?";

        $db = self::getConnection();
        $db->beginTransaction();
        $resultado = false;
        try {
            $stmt = $db->prepare($sql);
            $stmt->bindValue(1, $servicioId, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->rowCount() >= 1;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error ServicioModel->delete($servicioId)");
            error_log($th->getMessage());
            throw new Exception("Error borrando el servicio");
        } finally {
            $stmt = null;
            $db = null;
        }
        return $resultado;
    }
}
