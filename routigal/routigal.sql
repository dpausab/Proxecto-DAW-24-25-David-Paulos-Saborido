-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-05-2025 a las 23:15:39
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`id`, `nombre`) VALUES
(1, 'pendiente'),
(2, 'activo'),
(3, 'completado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ruta`
--

CREATE TABLE `ruta` (
  `id` int(11) NOT NULL,
  `id_tecnico` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `distancia_total` float NOT NULL,
  `tiempo_total` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id` int(11) NOT NULL,
  `id_ruta` int(11) DEFAULT NULL,
  `id_estado` int(11) NOT NULL,
  `cliente` varchar(100) NOT NULL,
  `longitud` float NOT NULL,
  `latitud` float NOT NULL,
  `descripcion` text NOT NULL,
  `tiempoEstimado` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id`, `id_ruta`, `id_estado`, `cliente`, `longitud`, `latitud`, `descripcion`, `tiempoEstimado`) VALUES
(1, NULL, 1, 'Cliente 1', -8.64435, 42.431, 'Entrega de paquete en Pontevedra', '01:30:00'),
(2, NULL, 2, 'Cliente 2', -8.6455, 42.4332, 'Revisión técnica en piso', '02:15:00'),
(3, NULL, 1, 'Cliente 3', -8.642, 42.4305, 'Entrega  en la estación de tren de Pontevedra', '00:45:00'),
(4, NULL, 3, 'Cliente 3', -8.6468, 42.435, 'Servicio de asistencia en el Hospital Provincial de Pontevedra', '03:00:00'),
(5, NULL, 1, 'Cliente 4', -8.6479, 42.428, 'Reparación en la zona de Vilanova de ARousa', '02:00:00'),
(6, NULL, 2, 'Cliente 5', -8.6432, 42.4295, 'Instalación en As Cancelas', '01:15:00'),
(7, NULL, 1, 'Cliente 6', -8.6485, 42.4325, 'Entrega en el Campus Universitario de Pontevedra', '01:00:00'),
(8, NULL, 3, 'Cliente 6', -8.641, 42.434, 'Visita a tienda de ropa en Caldas de Reis', '02:30:00'),
(9, NULL, 2, 'Cliente 6', -8.649, 42.4315, 'Revisión técnica en el Polígono Industrial de O Campiño', '01:45:00'),
(10, NULL, 1, 'Cliente 3', -8.645, 42.43, 'Entrega en la zona de Cambados', '02:15:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnico`
--

CREATE TABLE `tecnico` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user` varchar(50) NOT NULL,
  `pwd` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `user`, `pwd`) VALUES
(1, 'david', 'bba2d1bec283dd3b90add09797a9235b08069064');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `id_tecnico` (`id_tecnico`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `id_ruta` (`id_ruta`);

--
-- Indices de la tabla `tecnico`
--
ALTER TABLE `tecnico`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ruta`
--
ALTER TABLE `ruta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tecnico`
--
ALTER TABLE `tecnico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD CONSTRAINT `ruta_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ruta_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnico` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `servicio_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `servicio_ibfk_2` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
