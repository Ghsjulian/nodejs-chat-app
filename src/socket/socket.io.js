const IO = app => {
    const io = require("socket.io")(app);

    // Store user sockets
    const userSockets = {};

    // Set up Socket.IO to listen for connections
    io.on("connection", socket => {
        console.log("New connection established");

        // Handle events here (e.g., connection requests, messages)

        // Send request
        io.on("sendRequest", data => {
            const from = data.from;
            const to = data.to;

            // Check if User 2 is online
            const user2Socket = userSockets[to];

            if (user2Socket) {
                // Send the connection request to User 2
                user2Socket.emit("connectionRequest", {
                    from: from,
                    to: to
                });
            } else {
                // User 2 is offline, handle accordingly
                socket.emit("userOffline", {
                    message: "User 2 is offline"
                });
            }
        });

        // Accept request
        io.on("acceptRequest", data => {
            const from = data.from;
            const to = data.to;

            // Establish the connection between User 1 and User 2
            const user1Socket = userSockets[from];
            const user2Socket = userSockets[to];

            user1Socket.join(from);
            user2Socket.join(to);

            // Both users are now connected and can chat with each other
            user1Socket.emit("connected", {
                message: "Connected to User 2"
            });
            user2Socket.emit("connected", {
                message: "Connected to User 1"
            });
        });

        // Decline request
        io.on("declineRequest", data => {
            const from = data.from;
            const to = data.to;

            // Send decline message to User 1
            const user1Socket = userSockets[from];
            user1Socket.emit("declined", {
                message: "User 2 declined your connection request"
            });
        });

        // Send message
        io.on("sendMessage", data => {
            const from = data.from;
            const to = data.to;
            const message = data.message;

            // Send the message to User 2
            const user2Socket = userSockets[to];
            user2Socket.emit("receiveMessage", {
                from: from,
                message: message
            });
        });

        // Receive message
        io.on("receiveMessage", data => {
            const from = data.from;
            const message = data.message;

            // Handle received message
            console.log(`Received message from ${from}: ${message}`);
        });

        // Disconnect
        io.on("disconnect", () => {
            console.log("User disconnected");

            // Remove user socket from storage
            delete userSockets[socket.id];
        });

        // Store user socket
        userSockets[socket.id] = socket;
    });

    
};

module.exports = IO;
