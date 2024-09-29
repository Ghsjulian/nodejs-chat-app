"use strict";

// client.js
const getCookie = cname => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
const socket = io();

// User 1 sends a connection request to User 2
socket.emit("sendRequest", {
    from: getCookie("u_id"),
    to: "User 2"
});

// User 2 receives the connection request
socket.on("connectionRequest", data => {
    const from = data.from;
    const to = data.to;
    alert(from);
    console.log(`Received connection request from ${from}`);

    // User 2 can either accept or decline the request
    const response = prompt(
        "Do you want to accept the connection request? (yes/no)"
    );

    if (response === "yes") {
        // User 2 accepts the request
        socket.emit("acceptRequest", {
            from: to,
            to: from
        });
    } else {
        // User 2 declines the request
        socket.emit("declineRequest", {
            from: to,
            to: from
        });
    }
});

// User 1 receives the connection response
socket.on("connected", data => {
    console.log(`Connected to User 2`);
});

socket.on("declined", data => {
    console.log(`User 2 declined your connection request`);
});

// Send message
socket.emit("sendMessage", {
    from: "User 1",
    to: "User 2",
    message: "Hello, User 2!"
});

// Receive message
socket.on("receiveMessage", data => {
    const from = data.from;
    const message = data.message;

    console.log(`Received message from ${from}: ${message}`);
});
