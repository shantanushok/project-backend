// routes/ordersRoutes.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.post('/', ordersController.createOrder);  // Place a new order
router.get('/', ordersController.getOrders);  // Fetch all orders
router.put('/:order_id', ordersController.updateOrderStatus);  // Update order status

module.exports = router;
