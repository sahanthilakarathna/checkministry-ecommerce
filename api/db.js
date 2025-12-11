const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3WQhVtKPJzn8@ep-tiny-haze-aec64ubm-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
