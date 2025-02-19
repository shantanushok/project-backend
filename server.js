require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { Server } = require('socket.io');
const db = require('./src/config/db');

// Import routes
const ordersRoutes = require('./src/routes/ordersRoutes');
const billRequestsRoutes = require('./src/routes/billRequestsRoutes');
const userRoutes = require('./src/routes/userRoutes');
const tastePaletteRoutes = require('./src/routes/tastePaletteRoutes');

// Import socket handlers
const orderSockets = require('./src/sockets/orderSockets');
const billRequestSockets = require('./src/sockets/billRequestSockets');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE','SET'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// API Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/bill-requests', billRequestsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/taste-palette', tastePaletteRoutes);

// Initialize WebSocket connections
orderSockets(io);
billRequestSockets(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
