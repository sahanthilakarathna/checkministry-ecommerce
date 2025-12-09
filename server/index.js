const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// small health route
app.get('/health', (req, res) => res.json({ ok: true }));

// small products endpoint for frontend convenience
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, productName, productDescription FROM products ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('products route error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// order routes under /api
app.use('/api', orderRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
