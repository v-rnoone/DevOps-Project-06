const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'quoteuser',
  password: process.env.DB_PASSWORD || 'quotepass',
  database: process.env.DB_NAME || 'quotedb',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Retries the connection check with exponential-ish backoff.
// Call this once at startup before you start accepting traffic.
async function waitForDb(maxRetries = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connection established');
      return;
    } catch (err) {
      console.log(`DB not ready (attempt ${attempt}/${maxRetries}): ${err.message}`);
      if (attempt === maxRetries) {
        throw new Error('Could not connect to database after max retries');
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

module.exports = { pool, waitForDb };