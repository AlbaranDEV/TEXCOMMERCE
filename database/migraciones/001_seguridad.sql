-- Migración 001: tablas de seguridad y Hábeas Data (Ley 1581 de 2012)
-- Solo crea tablas nuevas; no modifica datos existentes.

-- Sesiones del servidor (las cookies solo guardan un id opaco; el JWT nunca llega al navegador)
CREATE TABLE IF NOT EXISTS sesiones (
  session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
  expires INT UNSIGNED NOT NULL,
  data MEDIUMTEXT COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Registro inmutable del consentimiento previo, expreso e informado.
-- No tiene llave foránea a usuarios a propósito: la prueba del consentimiento
-- debe conservarse aunque el titular solicite la supresión de su cuenta.
CREATE TABLE IF NOT EXISTS consentimientos (
  id_consentimiento INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  version_politica VARCHAR(20) NOT NULL,
  hash_politica CHAR(64) NOT NULL,          -- SHA-256 del texto aceptado
  finalidad VARCHAR(255) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  user_agent VARCHAR(255) DEFAULT NULL,
  aceptado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_consentimiento),
  KEY idx_consentimientos_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Solicitudes de supresión de datos (plazo legal máximo: 15 días hábiles)
CREATE TABLE IF NOT EXISTS solicitudes_supresion (
  id_solicitud INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  correo_hash CHAR(64) NOT NULL,            -- SHA-256 del correo: no se conserva el dato personal
  estado ENUM('pendiente','completada') NOT NULL DEFAULT 'pendiente',
  solicitada_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_limite DATE NOT NULL,
  completada_en TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id_solicitud)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bloquear UPDATE y DELETE sobre consentimientos (registro de auditoría inmutable)
DROP TRIGGER IF EXISTS consentimientos_no_update;
CREATE TRIGGER consentimientos_no_update BEFORE UPDATE ON consentimientos
FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'consentimientos es inmutable';

DROP TRIGGER IF EXISTS consentimientos_no_delete;
CREATE TRIGGER consentimientos_no_delete BEFORE DELETE ON consentimientos
FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'consentimientos es inmutable';
