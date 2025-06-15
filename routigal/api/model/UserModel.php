<?php
include_once(API_ROUTE."model/Model.php");


class User implements JsonSerializable{
    protected $id;
    protected $nombre;
    protected $usuario;
    protected $pwd;
    protected $rol;

    public function __construct($nombre, $usuario, $rol, $id=null, $pwd=null) {
        $this->id = $id;
        $this->pwd = $pwd;
        $this->nombre = $nombre;
        $this->usuario = $usuario;
        $this->rol = $rol;
    }

    public function jsonSerialize() : mixed {
        return get_object_vars($this);
    }
    
    /**
     * Get the value of $id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of $id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of $nombre
     */ 
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * Set the value of $nombre
     *
     * @return  self
     */ 
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;

        return $this;
    }

    /**
     * Get the value of $usuario
     */ 
    public function getUsuario()
    {
        return $this->usuario;
    }

    /**
     * Set the value of $usuairo
     *
     * @return  self
     */ 
    public function setUsuario($usuario)
    {
        $this->usuario = $usuario;

        return $this;
    }

    /**
     * Get the value of $pwd
     */ 
    public function getPwd()
    {
        return $this->pwd;
    }

    /**
     * Set the value of $pwd
     *
     * @return  self
     */ 
    public function setPwd($pwd)
    {
        $this->pwd = $pwd;

        return $this;
    }

    /**
     * Get the value of $rol
     */ 
    public function getRol()
    {
        return $this->rol;
    }

    /**
     * Set the value of $rol
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

    public static function getAll($offset=null, $limit=null, $nombre=null, $rol=null)
    {

        $filtrosQuery = [];
        $filtrosBind = [];

        if (isset($nombre) && !empty($nombre)) {
            $filtrosQuery[] = 'nombre LIKE :nombre';
            $filtrosBind[':nombre'] = '%'.$nombre.'%';
        }

        if (isset($rol) && is_numeric($rol)) {
            $filtrosQuery[] = 'id_rol = :rol';
            $filtrosBind[':rol'] = $rol;
        }

        $sql = "SELECT id, nombre, usuario, id_rol FROM usuarios";

        if (count($filtrosQuery) && !empty($filtrosQuery)) {
            $sql.= " WHERE ". implode(" AND ", $filtrosQuery);
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
            if (count($filtrosBind) && !empty($filtrosBind)) {
                foreach($filtrosBind as $key => $value) {
                    $pdo_param = is_numeric($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
                    $stmt->bindValue($key, $value, $pdo_param);
                }
            }

            $stmt->execute();
            $datos = [];
            foreach($stmt as $s){   
                $user = new user($s['nombre'], $s['usuario'], $s['id_rol'], $s['id']);
                $datos[] = $user;
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
            error_log("Error UserModel->getAll()");
            error_log($th->getMessage());
            throw new Exception("Error recuperando los usuarios");

        } finally {
            $stmt = null;
            $db = null;
        }
        return $respuesta;
    }

    public static function getTecnicos($offset=null, $limit=null)
    {
        if (isset($offset, $limit)) {
            $sql = "SELECT id, nombre, usuario, id_rol FROM usuarios WHERE id_rol=2 ORDER BY id DESC LIMIT $limit OFFSET $offset";
        } else {
            $sql = "SELECT id, nombre, usuario, id_rol FROM usuarios WHERE id_rol=2 ORDER BY id DESC";
        }
        $db = self::getConnection();
        $datos = [];
        try {
            $stmt = $db->query($sql);
            $datos = [];
            foreach($stmt as $s){   
                $user = new user($s['nombre'], $s['usuario'], $s['id_rol'], $s['id']);
                $datos[] = $user;
            }
        } catch (PDOException $th) {
            error_log("Error UserModel->getAll()");
            error_log($th->getMessage());
            throw new Exception("Error recuperando los tecnicos");

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
                $datos = new user($s['nombre'], $s['usuario'], $s['id_rol'], $s['id']);
            }
        } catch (Throwable $th) {
            error_log("Error UserModel->get($userId)");
            error_log($th->getMessage());
            throw new Exception("Error recuperando el usuario");

        } finally {
            $stmt = null;
            $db = null;
        }
        return $datos;
    }

    public static function insert($user)
    {
        $respuesta = false;
        try {
            
            $sql = "SELECT * FROM usuarios WHERE usuario=:user";
            $db = self::getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":user", $user['usuario'], PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                throw new Exception("El usuario ya existe.");
            }

            $sql = "INSERT INTO usuarios (nombre, usuario, pwd, id_rol) 
                    VALUES (:nombre, :user, :pwd, :rol)";

            $db->beginTransaction();
        
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
            throw new Exception("Error registrando el usuario");

            throw $th;
        } finally {
            $stmt = null;
            $db = null;
        }
        return $respuesta;

    }

    public static function update($data, $userId)
    {
        $sql = "SELECT * FROM usuarios WHERE usuario=:user";
        $db = self::getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindValue(":user", $data['usuario'], PDO::PARAM_STR);
        $stmt->execute();
        $usuarioEditar = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($usuarioEditar['id']!=$userId) {
            throw new Error("Usuario no disponible.");
        } 
        $user = self::get($userId);
        $db = null;
        if (!$user) {
            throw new Exception("El usuario no existe.");
        } else {
            $sql = "SELECT pwd FROM usuarios WHERE id=:id";
            $db = self::getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindValue(":id", $userId, PDO::PARAM_INT);
            $stmt->execute();
            $pwd = $stmt->fetchColumn();

            if ($pwd !== sha1($data['old_pwd'])) {
                throw new Exception("La contraseña actual no coincide.");
            }
        }
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
            $stmt->bindValue(":user", $data['nombre'], PDO::PARAM_STR);
            $stmt->bindValue(":pwd", sha1($data['new_pwd']), PDO::PARAM_STR);
            $stmt->bindValue(":rol", $data['rol'], PDO::PARAM_INT);

            $stmt->execute();
            $datos = true;
            $db->commit();
        } catch (PDOException $th) {
            $db->rollBack();
            error_log("Error UserModel->update(" . implode(",", $data) . ", $userId)");
            error_log($th->getMessage());
            throw new Exception("Error editando el usuario");
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
            throw new Exception("Error borrando el usuario");

        } finally {
            $stmt = null;
            $db = null;
        }

        return $datos;
    }
}