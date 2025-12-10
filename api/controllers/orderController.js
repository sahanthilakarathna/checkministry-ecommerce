const db = require('../db');

/**
 * GET /api/orders
 * Returns list of orders with product count
 */
async function getAllOrders(req, res) {
  try {
    const q = `
      SELECT o.id, o.orderdescription, o.createdat,
        COALESCE(COUNT(opm.productid),0) AS productCount
      FROM Orders o
      LEFT JOIN OrderProductMap opm ON opm.orderid = o.id
      GROUP BY o.id
      ORDER BY o.createdat DESC
    `;
    const { rows } = await db.query(q);
    res.json(rows);
  } catch (err) {
    console.error('getAllOrders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

/**
 * GET /api/orders/:id
 * Returns single order with products array
 */
async function getOrderById(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const orderRes = await db.query('SELECT id, orderdescription, createdat FROM Orders WHERE id=$1', [id]);
    if (orderRes.rowCount === 0) return res.status(404).json({ error: 'Order not found' });
    const order = orderRes.rows[0];

    const productsRes = await db.query(
      `SELECT p.id, p.productname, p.productdescription
       FROM Products p
       JOIN OrderProductMap opm ON opm.productid = p.id
       WHERE opm.orderid = $1
       ORDER BY p.id`,
      [id]
    );

    res.json({ ...order, products: productsRes.rows });
  } catch (err) {
    console.error('getOrderById error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

/**
 * POST /api/orders
 * Body: { orderDescription: string, productIds: number[] }
 */
async function createOrder(req, res) {
  const { orderdescription, productIds } = req.body;
  if (!orderdescription || !Array.isArray(productIds)) {
    return res.status(400).json({ error: 'orderDescription and productIds are required' });
  }

  try {
    await db.query('BEGIN');

    const insertOrder = await db.query(
      'INSERT INTO Orders (orderdescription, createdat) VALUES ($1, NOW()) RETURNING id, orderdescription, createdat',
      [orderdescription]
    );

    const orderId = insertOrder.rows[0].id;

    await Promise.all(
      productIds.map(pid =>
        db.query(
          'INSERT INTO OrderProductMap (orderid, productid) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [orderId, pid]
        )
      )
    );

    await db.query('COMMIT');
    res.status(201).json(insertOrder.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('createOrder error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
}


/**
 * PUT /api/orders/:id
 * Body: { orderDescription: string, productIds: number[] }
 */
async function updateOrder(req, res) {
  const id = +req.params.id;
  const { orderdescription, productIds } = req.body;

  if (!orderdescription || !Array.isArray(productIds)) {
    return res.status(400).json({ error: 'orderDescription and productIds required' });
  }

  try {
    await db.query('BEGIN');

    const up = await db.query(
      'UPDATE Orders SET orderdescription=$1 WHERE id=$2 RETURNING id',
      [orderdescription, id]
    );
    if (up.rowCount === 0) return res.status(404).json({ error: 'Order not found' });

    await db.query('DELETE FROM OrderProductMap WHERE orderid=$1', [id]);

    await Promise.all(
      productIds.map(pid =>
        db.query('INSERT INTO OrderProductMap (orderid, productid) VALUES ($1,$2)', [id, pid])
      )
    );

    await db.query('COMMIT');
    res.json({ message: 'Order updated' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('updateOrder error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
}

/**
 * DELETE /api/orders/:id
 */
async function deleteOrder(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const del = await db.query('DELETE FROM Orders WHERE id=$1 RETURNING id', [id]);
    if (del.rowCount === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('deleteOrder error:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
}

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
