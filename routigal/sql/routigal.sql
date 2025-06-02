-- Tabla de roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id)
);

-- Tabla de ubicaciones
CREATE TABLE ubicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL
);

-- Tabla de estados para rutas
CREATE TABLE estados_ruta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de estados para servicios
CREATE TABLE estados_servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de rutas
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tiempo_total TIME NOT NULL,
    km_totales DECIMAL(6,2) NOT NULL,
    id_origen INT NOT NULL,
    id_tecnico INT NOT NULL,
    id_estado INT NOT NULL,
    fecha DATE NOT NULL,
    hora_salida TIME NOT NULL,
    FOREIGN KEY (id_origen) REFERENCES ubicaciones(id),
    FOREIGN KEY (id_tecnico) REFERENCES usuarios(id),
    FOREIGN KEY (id_estado) REFERENCES estados_ruta(id)
);

-- Tabla de servicios
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_estado INT NOT NULL,
    nombre_cliente VARCHAR(100) NOT NULL,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    fecha_servicio DATE NOT NULL,
    hora_servicio TIME NOT NULL,
    id_ruta INT DEFAULT NULL,
    orden INT DEFAULT NULL,
    duracion_estimada TIME,
    id_tecnico INT DEFAULT NULL,
    descripcion TEXT,
    FOREIGN KEY (id_estado) REFERENCES estados_servicio(id),
    FOREIGN KEY (id_ruta) REFERENCES rutas(id)
);

-- Tabla de endpoints (para escalabilidad)
CREATE TABLE endpoints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de permisos, controlando por método
CREATE TABLE permisos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rol_id INT NOT NULL,
    endpoint_id INT NOT NULL,
    metodo ENUM('GET','POST','PUT','DELETE') NOT NULL,
    permitido BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (endpoint_id) REFERENCES endpoints(id)
);

-- INSERT --

-- Roles
INSERT INTO roles (id, nombre) VALUES 
(1, 'admin'),
(2, 'tecnico');

-- Usuarios
INSERT INTO usuarios (id, nombre, usuario, pwd, id_rol) VALUES
(1, 'Admin Gallego', 'admin', 'admin123', 1),
(2, 'Técnico Salnés', 'tecnico1', 'tecnico123', 2);

-- Estados para rutas
INSERT INTO estados_ruta (id, nombre) VALUES
(1, 'asignada'),
(2, 'realizada');

-- Estados para servicios
INSERT INTO estados_servicio (id, nombre) VALUES
(1, 'nuevo'),
(2, 'asignado'),
(3, 'realizado');

-- Ubicación base (origen de rutas)
INSERT INTO ubicaciones (id, nombre, latitud, longitud) VALUES
(1, 'Tienda Vilagarcía', 42.5946, -8.7645);


-- Servicios en la comarca do Salnés
INSERT INTO servicios (nombre, id_estado, nombre_cliente, latitud, longitud, direccion, fecha_servicio, hora_servicio, duracion_estimada, descripcion) VALUES
('Instalación de enchufe exterior', 1, 'Ana Rivas', 42.5119, -8.8120, 'Avenida Rosalía de Castro, Vilagarcía', '2025-03-05', '10:00', '00:30:00', 'Instalación de punto de luz en jardín.'),
('Revisión caldera', 2, 'Miguel Torres', 42.4791, -8.7943, 'Calle Castelao, Sanxenxo', '2025-03-05', '11:00', '01:00:00', 'Comprobación e limpeza de caldeira.'),
('Cambio de termostato', 1, 'Lucía Fernández', 42.4898, -8.8100, 'Rua Real, O Grove', '2025-03-05', '12:30', '00:45:00', 'Substitución por termostato intelixente.'),
('Revisión de instalación', 3, 'Javier Lema', 42.5045, -8.8129, 'Rua da Igrexa, Ribadumia', '2025-03-05', '14:00', '01:00:00', 'Verificación de cableado e cadro xeral.'),
('Arranxo timbre', 2, 'Marta Piñeiro', 42.4982, -8.8250, 'Rua do Viño, Meaño', '2025-03-05', '15:30', '00:20:00', 'Revisión do circuíto e substitución.'),
('Cambio de enchufes', 1, 'Iván Rodríguez', 42.5220, -8.8015, 'Rua do Mar, Cambados', '2025-03-06', '09:00', '00:40:00', 'Actualización de enchufes vellos.'),
('Revisión luminarias', 2, 'Sandra Vázquez', 42.5170, -8.7935, 'Rua dos Viños, A Illa de Arousa', '2025-03-06', '10:30', '00:45:00', 'Revisión de 4 puntos de luz interiores.'),
('Instalación lámpada colgante', 1, 'Óscar Costa', 42.5111, -8.7866, 'Rua do Porto, Vilanova de Arousa', '2025-03-06', '12:00', '00:30:00', 'Instalación e conexión de lámpada no salón.'),
('Revisión xeral instalación', 3, 'Patricia Lago', 42.5342, -8.8280, 'Rua Principal, Meaño', '2025-03-06', '13:30', '01:15:00', 'Revisión por subidas de tensión.'),
('Instalación extractor baño', 2, 'Diego Fariña', 42.5166, -8.8190, 'Rua da Fonte, Ribadumia', '2025-03-06', '15:00', '00:35:00', 'Montaxe e conexión á rede eléctrica.'),
('Comprobación diferencial', 2, 'Andrea Souto', 42.4785, -8.7888, 'Avda. da Lanzada, Sanxenxo', '2025-03-07', '09:30', '00:25:00', 'Saltan os magnetotérmicos continuamente.'),
('Revisión enchufes cociña', 1, 'Ramón Silva', 42.5020, -8.8133, 'Rua do Mercado, Vilagarcía', '2025-03-07', '11:00', '00:50:00', 'Fallo ao conectar electrodomésticos.'),
('Cambio interruptores', 2, 'Natalia Domínguez', 42.5192, -8.8108, 'Rua das Escaleiras, Cambados', '2025-03-07', '12:30', '00:30:00', 'Instalación de interruptores dobres.'),
('Instalación LED exteriores', 1, 'Sergio Barreiro', 42.4950, -8.8300, 'Camino do Río, Meaño', '2025-03-07', '14:00', '01:00:00', 'Montaxe de 3 puntos de luz con sensor.'),
('Arranxo cadro xeral', 3, 'Beatriz Gómez', 42.5090, -8.7955, 'Rua Nova, A Illa de Arousa', '2025-03-07', '15:30', '01:10:00', 'Problema con conexións no cadro eléctrico.');

INSERT INTO endpoints (endpoint) VALUES ('rutas'), ('servicios'), ('ubicaciones'), ('usuarios'), ('roles');

INSERT INTO permisos (rol_id, endpoint_id, metodo, permitido) VALUES
(1, 1, 'GET', TRUE),
(1, 1, 'POST', TRUE),
(1, 1, 'PUT', TRUE),
(1, 1, 'DELETE', TRUE),
(1, 2, 'GET', TRUE),
(1, 2, 'POST', TRUE),
(1, 2, 'PUT', TRUE),
(1, 2, 'DELETE', TRUE),
(1, 3, 'GET', TRUE),
(1, 3, 'POST', TRUE),
(1, 3, 'PUT', TRUE),
(1, 3, 'DELETE', TRUE),
(1, 4, 'GET', TRUE),
(1, 4, 'POST', TRUE),
(1, 4, 'PUT', TRUE),
(1, 4, 'DELETE', TRUE),
(2, 1, 'GET', TRUE),
(2, 2, 'GET', TRUE),
(2, 3, 'GET', TRUE),
(2, 4, 'GET', TRUE),
(2, 1, 'PUT', TRUE),
(1, 5, 'POST', TRUE),
(1, 5, 'GET', TRUE),
(1, 5, 'PUT', TRUE),
(1, 5, 'DELETE', TRUE),