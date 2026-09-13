-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-06-2026 a las 04:54:22
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
-- Base de datos: `mi_base_de_datos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `producto` varchar(100) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `rol` varchar(20) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`rol`, `descripcion`) VALUES
('admin', ''),
('moderador', ''),
('usuario', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellidos`, `correo`, `contrasena`, `rol`) VALUES
(1, 'Admin', 'Principal', 'admin@texcomerce.com', '1ed6128070ac0f2d4f2e627567a6c31a:89b5f4d524ce93ae1ab59e9e531fbcfae7cc5d70a72bd642f1f94dd138ec3383f33d24c6392991a3476416cfa8025fcb05b496dea4bb26d0f7886d0e81637ccd', 'admin'),
(2, 'Andres', 'Albaran', 'andres@gmail.com', 'b157ecbbe4ec3dfa0225e661729ef6cb:03b52e05c2858e339c9ca816eb11a95d3e1d3c231cc5a734a190c0e0c9da61e2861217266beb8123b81928cdeffb1276760a59f720b9336775418d86ca0d9f7e', 'moderador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `pedido_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`rol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `usuario_ibfk_1` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `telas`
--

CREATE TABLE IF NOT EXISTS `telas` (
  `id_tela` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fibra` varchar(100) NOT NULL,
  `ancho_cm` int(11) NOT NULL DEFAULT 150,
  `precio_metro` decimal(10,2) NOT NULL,
  `precio_min_mercado` decimal(10,2) NOT NULL,
  `precio_max_mercado` decimal(10,2) NOT NULL,
  `stock_metros` int(11) NOT NULL DEFAULT 100,
  `colores_disponibles` int(11) NOT NULL DEFAULT 8,
  PRIMARY KEY (`id_tela`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `telas`
--

INSERT INTO `telas` (`id_tela`, `codigo`, `nombre`, `descripcion`, `fibra`, `ancho_cm`, `precio_metro`, `precio_min_mercado`, `precio_max_mercado`, `stock_metros`, `colores_disponibles`) VALUES
(1, '#SED-01', 'Seda Natural Premium', 'Tela de seda suave y elegante, ideal para prendas delicadas y de alta costura.', '100% Seda', 150, 45000.00, 40000.00, 65000.00, 100, 8),
(2, '#POL-02', 'Polar Térmico de Alta Densidad', 'Tejido polar de gran aislamiento térmico, perfecto para invierno y ropa deportiva.', '100% Poliéster Polar', 150, 12500.00, 7500.00, 15000.00, 100, 8),
(3, '#LYC-03', 'Lycra Deportiva Elástica', 'Tejido ultra elástico y resistente, se adapta perfectamente al cuerpo, ideal para ropa deportiva y de baño.', '80% Nylon / 20% Elastano', 150, 18500.00, 14000.00, 23000.00, 100, 8),
(4, '#DEN-04', 'Denim Clásico Resistente', 'Tela vaquera tradicional de alta durabilidad, perfecta para jeans, chaquetas y accesorios.', '100% Algodón Denim', 150, 26000.00, 18000.00, 35000.00, 100, 8),
(5, '#POLS-05', 'Poliéster Ligero Versátil', 'Tejido de poliéster de fácil cuidado, resistente a arrugas y excelente durabilidad para uso general.', '100% Poliéster', 150, 8500.00, 4500.00, 12000.00, 100, 8),
(6, '#ALG-06', 'Algodón Orgánico Suave', 'Tela de algodón 100% natural, transpirable y suave al tacto, ideal para uso diario y pieles sensibles.', '100% Algodón', 150, 24000.00, 15000.00, 35000.00, 100, 8);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol`) REFERENCES `roles` (`rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
