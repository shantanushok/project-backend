const db = require('../config/db');

exports.createOrder = async (req, res) => {
    try {
        const { client_id, order_details, total_amount } = req.body;
        const result = await db.query(
            'INSERT INTO Customer_Orders (Client_ID, Order_Details, Total_Amount, Order_Status) VALUES ($1, $2, $3, $4) RETURNING *',
            [client_id, order_details, total_amount, 'Pending']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Customer_Orders');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { order_status } = req.body;

        const result = await db.query(
            'UPDATE Customer_Orders SET Order_Status = $1, Updated_At = CURRENT_TIMESTAMP WHERE Order_ID = $2 RETURNING *',
            [order_status, order_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ error: err.message });
    }
};

