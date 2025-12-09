const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Sahan@123@localhost:5432/ecommerce'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
