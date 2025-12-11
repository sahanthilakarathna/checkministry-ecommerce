// api/index.js
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('../routes/orderRoutes');
const db = require('../db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// health check
app.get('/health', (req, res) => res.json({ ok: true }));

// products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, productName, productDescription FROM products ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('products route error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// order routes
app.use('/api', orderRoutes);

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);

// --- Local server run ---
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Server running locally on port ${port}`));
}
