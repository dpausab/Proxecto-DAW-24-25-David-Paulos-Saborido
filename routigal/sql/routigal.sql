-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-06-2025 a las 23:48:52
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `routigal`
--
DROP DATABASE IF EXISTS `routigal`;
CREATE DATABASE IF NOT EXISTS `routigal`;
USE `routigal`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `endpoints`
--

CREATE TABLE `endpoints` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `endpoints`
--

INSERT INTO `endpoints` (`id`, `nombre`) VALUES
(5, 'roles'),
(1, 'rutas'),
(2, 'servicios'),
(3, 'ubicaciones'),
(4, 'usuarios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_ruta`
--

CREATE TABLE `estados_ruta` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_ruta`
--

INSERT INTO `estados_ruta` (`id`, `nombre`) VALUES
(1, 'asignada'),
(2, 'realizada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_servicio`
--

CREATE TABLE `estados_servicio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_servicio`
--

INSERT INTO `estados_servicio` (`id`, `nombre`) VALUES
(1, 'nuevo'),
(2, 'asignado'),
(3, 'realizado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `endpoint_id` int(11) NOT NULL,
  `metodo` enum('GET','POST','PUT','DELETE') NOT NULL,
  `permitido` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `rol_id`, `endpoint_id`, `metodo`, `permitido`) VALUES
(17, 1, 1, 'GET', 1),
(18, 1, 1, 'POST', 1),
(19, 1, 1, 'PUT', 1),
(20, 1, 1, 'DELETE', 1),
(21, 1, 2, 'GET', 1),
(22, 1, 2, 'POST', 1),
(23, 1, 2, 'PUT', 1),
(24, 1, 2, 'DELETE', 1),
(25, 1, 3, 'GET', 1),
(26, 1, 3, 'POST', 1),
(27, 1, 3, 'PUT', 1),
(28, 1, 3, 'DELETE', 1),
(29, 1, 4, 'GET', 1),
(30, 1, 4, 'POST', 1),
(31, 1, 4, 'PUT', 1),
(32, 1, 4, 'DELETE', 1),
(33, 2, 1, 'GET', 1),
(34, 2, 2, 'GET', 1),
(35, 2, 3, 'GET', 1),
(36, 2, 4, 'GET', 1),
(37, 2, 1, 'PUT', 1),
(38, 1, 5, 'GET', 1),
(39, 1, 5, 'POST', 1),
(40, 1, 5, 'DELETE', 1),
(41, 1, 5, 'PUT', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'admin'),
(2, 'tecnico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rutas`
--

CREATE TABLE `rutas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tiempo_total` time NOT NULL,
  `km_totales` decimal(6,2) NOT NULL,
  `id_origen` int(11) NOT NULL,
  `id_tecnico` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_salida` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `fecha_servicio` date NOT NULL,
  `hora_servicio` time NOT NULL,
  `id_ruta` int(11) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `duracion_estimada` time DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `nombre`, `id_estado`, `nombre_cliente`, `latitud`, `longitud`, `direccion`, `fecha_servicio`, `hora_servicio`, `id_ruta`, `orden`, `duracion_estimada`, `id_tecnico`, `descripcion`) VALUES
(8, 'Instalación lámpada colgante', 1, 'Óscar Costa', 42.51110000, -8.78660000, 'Rua do Porto, Vilanova de Arousa', '2025-03-06', '12:00:00', NULL, NULL, '00:00:00', NULL, 'Instalación e conexión de lámpada no salón.'),
(9, 'Revisión xeral instalación', 3, 'Patricia Lago', 42.53420000, -8.82800000, 'Rua Principal, Meaño', '2025-03-06', '13:30:00', NULL, NULL, '01:15:00', NULL, 'Revisión por subidas de tensión.'),
(10, 'Instalación extractor baño', 2, 'Diego Fariña', 42.51660000, -8.81900000, 'Rua da Fonte, Ribadumia', '2025-03-06', '15:00:00', NULL, NULL, '00:35:00', NULL, 'Montaxe e conexión á rede eléctrica.'),
(11, 'Comprobación diferencial', 2, 'Andrea Souto', 42.47850000, -8.78880000, 'Avda. da Lanzada, Sanxenxo', '2025-03-07', '09:30:00', NULL, NULL, '00:25:00', NULL, 'Saltan os magnetotérmicos continuamente.'),
(12, 'Revisión enchufes cociña 1', 1, 'Ramón Silva', 42.50200000, -8.81330000, 'Rua do Mercado, Vilagarcía', '2025-03-07', '11:00:00', NULL, NULL, '00:00:00', NULL, 'Fallo ao conectar electrodomésticos.'),
(17, 'Instalación de enchufe exterior', 1, 'Ana Rivas', 42.51190000, -8.81200000, 'Avenida Rosalía de Castro, Vilagarcía', '2025-03-05', '10:00:00', NULL, NULL, '00:30:00', NULL, 'Instalación de punto de luz en jardín.'),
(18, 'Revisión caldera', 2, 'Miguel Torres', 42.47910000, -8.79430000, 'Calle Castelao, Sanxenxo', '2025-03-05', '11:00:00', NULL, NULL, '01:00:00', NULL, 'Comprobación e limpeza de caldeira.'),
(19, 'Cambio de termostato', 1, 'Lucía Fernández', 42.48980000, -8.81000000, 'Rua Real, O Grove', '2025-03-05', '12:30:00', NULL, NULL, '00:00:00', NULL, 'Substitución por termostato intelixente.'),
(20, 'Revisión de instalación', 3, 'Javier Lema', 42.50450000, -8.81290000, 'Rua da Igrexa, Ribadumia', '2025-03-05', '14:00:00', NULL, NULL, '01:00:00', NULL, 'Verificación de cableado e cadro xeral.'),
(21, 'Arranxo timbre', 2, 'Marta Piñeiro', 42.49820000, -8.82500000, 'Rua do Viño, Meaño', '2025-03-05', '15:30:00', NULL, NULL, '00:20:00', NULL, 'Revisión do circuíto e substitución.'),
(22, 'Cambio de enchufes', 1, 'Iván Rodríguez', 42.52200000, -8.80150000, 'Rua do Mar, Cambados', '2025-03-06', '09:00:00', NULL, NULL, '00:40:00', NULL, 'Actualización de enchufes vellos.'),
(23, 'Revisión luminarias', 2, 'Sandra Vázquez', 42.51700000, -8.79350000, 'Rua dos Viños, A Illa de Arousa', '2025-03-06', '10:30:00', NULL, NULL, '00:45:00', NULL, 'Revisión de 4 puntos de luz interiores.'),
(24, 'Instalación lámpada colgante', 1, 'Óscar Costa', 42.51110000, -8.78660000, 'Rua do Porto, Vilanova de Arousa', '2025-03-06', '12:00:00', NULL, NULL, '00:30:00', NULL, 'Instalación e conexión de lámpada no salón.'),
(25, 'Revisión xeral instalación', 3, 'Patricia Lago', 42.53420000, -8.82800000, 'Rua Principal, Meaño', '2025-03-06', '13:30:00', NULL, NULL, '01:15:00', NULL, 'Revisión por subidas de tensión.'),
(26, 'Instalación extractor baño', 2, 'Diego Fariña', 42.51660000, -8.81900000, 'Rua da Fonte, Ribadumia', '2025-03-06', '15:00:00', NULL, NULL, '00:35:00', NULL, 'Montaxe e conexión á rede eléctrica.'),
(27, 'Comprobación diferencial', 2, 'Andrea Souto', 42.47850000, -8.78880000, 'Avda. da Lanzada, Sanxenxo', '2025-03-07', '09:30:00', NULL, NULL, '00:25:00', NULL, 'Saltan os magnetotérmicos continuamente.'),
(28, 'Revisión enchufes cociña', 1, 'Ramón Silva', 42.50200000, -8.81330000, 'Rua do Mercado, Vilagarcía', '2025-03-07', '11:00:00', NULL, NULL, '00:50:00', NULL, 'Fallo ao conectar electrodomésticos.'),
(29, 'Cambio interruptores', 2, 'Natalia Domínguez', 42.51920000, -8.81080000, 'Rua das Escaleiras, Cambados', '2025-03-07', '12:30:00', NULL, NULL, '00:30:00', NULL, 'Instalación de interruptores dobres.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id`, `nombre`, `latitud`, `longitud`) VALUES
(1, 'Tienda Vilagarcía', 42.59460000, -8.76450000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `usuario`, `pwd`, `id_rol`) VALUES
(10, 'PRUEBAS', 'admin', 'bba2d1bec283dd3b90add09797a9235b08069064', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `endpoints`
--
ALTER TABLE `endpoints`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `estados_ruta`
--
ALTER TABLE `estados_ruta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estados_servicio`
--
ALTER TABLE `estados_servicio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rol_id` (`rol_id`),
  ADD KEY `endpoint_id` (`endpoint_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rutas`
--
ALTER TABLE `rutas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_origen` (`id_origen`),
  ADD KEY `id_tecnico` (`id_tecnico`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `id_ruta` (`id_ruta`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `endpoints`
--
ALTER TABLE `endpoints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estados_ruta`
--
ALTER TABLE `estados_ruta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `estados_servicio`
--
ALTER TABLE `estados_servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `rutas`
--
ALTER TABLE `rutas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `permisos_ibfk_2` FOREIGN KEY (`endpoint_id`) REFERENCES `endpoints` (`id`);

--
-- Filtros para la tabla `rutas`
--
ALTER TABLE `rutas`
  ADD CONSTRAINT `rutas_ibfk_1` FOREIGN KEY (`id_origen`) REFERENCES `ubicaciones` (`id`),
  ADD CONSTRAINT `rutas_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `rutas_ibfk_3` FOREIGN KEY (`id_estado`) REFERENCES `estados_ruta` (`id`);

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `estados_servicio` (`id`),
  ADD CONSTRAINT `servicios_ibfk_2` FOREIGN KEY (`id_ruta`) REFERENCES `rutas` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
