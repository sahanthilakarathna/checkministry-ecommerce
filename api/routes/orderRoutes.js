const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');

// REST endpoints (prefix: /api)
router.get('/orders', ctrl.getAllOrders);
router.get('/orders/:id', ctrl.getOrderById);
router.post('/orders', ctrl.createOrder);
router.put('/orders/:id', ctrl.updateOrder);
router.delete('/orders/:id', ctrl.deleteOrder);

module.exports = router;
