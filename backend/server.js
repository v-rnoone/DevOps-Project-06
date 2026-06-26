const express = require('express');
const path = require('path');
const { pool, waitForDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

app.get('/api/quote', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT text, author FROM quotes ORDER BY RANDOM() LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No quotes found in database' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching quote:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function start() {
  await waitForDb();
  app.listen(PORT, () => {
    console.log(`Quote app server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});