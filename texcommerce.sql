-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-10-2026 a las 06:09:59
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
-- Base de datos: `texcommerce`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `producto` varchar(100) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `telas`
--

CREATE TABLE `telas` (
  `id_tela` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fibra` varchar(100) DEFAULT NULL,
  `ancho_cm` int(11) DEFAULT NULL,
  `precio_metro` decimal(10,2) DEFAULT NULL,
  `precio_min_mercado` decimal(10,2) DEFAULT NULL,
  `precio_max_mercado` decimal(10,2) DEFAULT NULL,
  `stock_metros` int(11) DEFAULT NULL,
  `colores_disponibles` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `telas`
--

INSERT INTO `telas` (`id_tela`, `codigo`, `nombre`, `descripcion`, `fibra`, `ancho_cm`, `precio_metro`, `precio_min_mercado`, `precio_max_mercado`, `stock_metros`, `colores_disponibles`, `created_at`) VALUES
(1, '#SED-01', 'Seda Natural Premium', 'Tela de seda suave y elegante, ideal para prendas de alta costura.', '100% Seda', 150, 45000.00, 40000.00, 65000.00, 100, 8, '2026-10-09 04:03:57'),
(2, '#POL-02', 'Polar Térmico de Alta Densidad', 'Tejido polar de gran aislamiento térmico, perfecto para climas fríos.', '100% Poliéster Polar', 150, 12500.00, 7500.00, 15000.00, 100, 8, '2026-10-09 04:03:57'),
(3, '#LYC-03', 'Lycra Deportiva Elástica', 'Tejido ultra elástico y resistente, se adapta perfectamente al movimiento.', '80% Nylon / 20% Elastano', 150, 18500.00, 14000.00, 23000.00, 100, 8, '2026-10-09 04:03:57'),
(4, '#DEN-04', 'Denim Clásico Resistente', 'Tela vaquera tradicional de alta durabilidad, perfecta para chaquetas y pantalones.', '100% Algodón Denim', 150, 26000.00, 18000.00, 35000.00, 100, 8, '2026-10-09 04:03:57'),
(5, '#POLS-05', 'Poliéster Ligero Versátil', 'Tejido de poliéster de fácil cuidado, resistente a las arrugas.', '100% Poliéster', 150, 8500.00, 4500.00, 12000.00, 100, 8, '2026-10-09 04:03:57'),
(6, '#ALG-06', 'Algodón Orgánico Suave', 'Tela de algodón 100% natural, transpirable y suave al tacto.', '100% Algodón', 150, 24000.00, 15000.00, 35000.00, 100, 8, '2026-10-09 04:03:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('admin','cliente') DEFAULT 'cliente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `correo`, `contrasena`, `rol`, `created_at`) VALUES
(1, 'Administrador Principal', 'Andres Albaran', 'admin@texcommerce.com', 'texcommerce.123', 'admin', '2026-10-07 01:39:39'),
(2, 'Juan', 'Osorio', 'osorio@gmail.com', 'osorio.123', 'cliente', '2026-10-08 22:41:50'),
(3, 'Leidy', 'Alvarado', 'alvarado@gmail.com', 'alvarado.123', 'cliente', '2026-10-08 22:45:06');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `telas`
--
ALTER TABLE `telas`
  ADD PRIMARY KEY (`id_tela`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `telas`
--
ALTER TABLE `telas`
  MODIFY `id_tela` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
