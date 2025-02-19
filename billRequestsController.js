const db = require('../config/db');

exports.createBillRequest = async (req, res) => {
    try {
        const { order_id } = req.body;

        // Check if the order exists and has a valid status
        const orderCheck = await db.query(
            'SELECT Order_Status FROM Customer_Orders WHERE Order_ID = $1',
            [order_id]
        );

        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const orderStatus = orderCheck.rows[0].order_status;
        const validStatuses = ['Pending', 'Preparing', 'Served', 'Cancelled'];

        console.log(`Order Status for Order_ID ${order_id}:`, orderStatus); // Debugging log

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ error: `Invalid order status '${orderStatus}' for bill request` });
        }
        // Insert the bill request
        const result = await db.query(
            'INSERT INTO Bill_Requests (Order_ID,Bill_Status) VALUES ($1,$2) RETURNING *',
            [order_id,'Pending']
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err); // Debugging log
        res.status(500).json({ error: err.message });
    }
};


exports.getBillRequests = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Bill_Requests');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateBillRequestStatus = async (req, res) => { 
    try {
        const { order_id } = req.params;  // Correct case
        const { bill_status } = req.body;  // Correct case

        const result = await db.query(
            'UPDATE Bill_Requests SET Bill_Status = $1 WHERE Order_id = $2 RETURNING *',
            [bill_status, order_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bill request not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


