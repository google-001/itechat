// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store messages in memory
let messages = [];

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Listen for socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the chat history to the newly connected client
    socket.emit('chat history', messages);

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        messages.push(msg); // Store message in memory
        io.emit('chat message', msg); // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('User  disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});