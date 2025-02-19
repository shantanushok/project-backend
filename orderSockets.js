const users = {}; // Store user socket IDs

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Register user with their socket ID
        socket.on('registerUser', (userId) => {
            users[userId] = socket.id;
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        // Order status update (Only notify the specific user)
        socket.on('updateOrderStatus', ({ userId, orderData }) => {
            const userSocketId = users[userId];
            if (userSocketId) {
                io.to(userSocketId).emit('orderStatusChanged', orderData);
                console.log(`Order update sent to user ${userId}`);
            }
        });

        // Notify Waiter Bot
        socket.on('notifyWaiter', (orderData) => {
            io.emit('waiterNotification', orderData); // Notify all waiters
        });

        // Remove user on disconnect
        socket.on('disconnect', () => {
            Object.keys(users).forEach((userId) => {
                if (users[userId] === socket.id) delete users[userId];
            });
            console.log(`User with socket ${socket.id} disconnected`);
        });
    });
};
