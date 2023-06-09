const express = require('express');
const WebSocket = require('ws');

function startServer() {
    const app = express();
    const server = app.listen(3000, () => {
        console.log('Server started on port 3000');
    });

    // Using web socket for a simpler implementation. Ideally the chat would use a WebRTC server to create a connection
    const wss = new WebSocket.Server({ server });

    // Store messages
    const messages = [];

    // Handle incoming WebSocket connection
    wss.on('connection', (socket) => {
        console.log('WebSocket connection established');

        // Send existing messages to the client
        if (messages.length > 0) {
            socket.send(JSON.stringify({ type: 'log', data: messages }));
        }

        // Handle incoming messages from the client
        socket.on('message', (message) => {
            console.log('Received message:', message.toString());

            // Generate a random response
            const response = {
                sender: 'Someone',
                content: 'Imagine this as a pretty reply to your message!'
            };

            // Add the message and response to the messages array
            messages.push(message);
            messages.push(response);

            // Send the new message and response to the connected client
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'message', data: response }));
                }
            });
        });
    });
}

module.exports = startServer;
