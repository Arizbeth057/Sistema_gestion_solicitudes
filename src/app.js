const express = require('express');
const pool = require('./db');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/health/db', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.post('/solicitudes', async (req, res) => {
  const { folio, titulo, descripcion, categoria, prioridad, reporta, correo } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO solicitudes
        (folio, titulo, descripcion, categoria, prioridad, reporta, correo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [folio, titulo, descripcion, categoria, prioridad, reporta, correo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create solicitud:', error.message);
    res.status(500).json({ error: 'No se pudo crear la solicitud' });
  }
});

app.get('/solicitudes', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM solicitudes ORDER BY fecha_registro DESC'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Failed to fetch solicitudes:', error.message);
    res.status(500).json({ error: 'No se pudieron consultar las solicitudes' });
  }
});

module.exports = app;
