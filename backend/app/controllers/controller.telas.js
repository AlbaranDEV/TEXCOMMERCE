import pool from '../config/db.js';

// GET /api/telas - Obtener todas las telas del catálogo
export const getTelas = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM telas ORDER BY id_tela ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener telas:', error);
    res.status(500).json({ error: 'Error al consultar el catálogo de telas' });
  }
};

// GET /api/telas/:codigo - Obtener una tela por su código (#SED-01, etc.)
export const getTelaByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query('SELECT * FROM telas WHERE codigo = ?', [codigo]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tela no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener tela:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
