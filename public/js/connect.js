"use strict";

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

const connectBtn = document.querySelector(".connect");
const playground = document.querySelector(".playground");
const socket = io();
const u_name = getCookie("u_name");
const u_id = getCookie("u_id");

socket.on("connection", () => {
    console.log("Connected to server");
});

socket.emit("user", JSON.stringify({ u_id, u_name }));


socket.on("activeUsers", users => {
    alert(JSON.stringify(users))
});


socket.on("newUser", user => {
    alert(JSON.stringify(user));
});

socket.on("disconnect", () => {
    console.log("User Disconnected");
});

// SEND MESSAGES
const sendMessage = message => {
    socket.emit("sendMessage", message);
};

// UIPDATE BUTTON
const updateButton = (type, id) => {
    if (type === "REQUEST") {
        const thisBtn = document.getElementById(id);
        const conn = thisBtn.querySelector(".connect");
        conn.onclick = () => {
            sendMessage("ACCEPTED");
        };
        conn.style.backgroundColor = "#ff2f05";
        conn.style.color = "#ffffff";
        conn.style.border = "1px solid #ff2f05";
        conn.textContent = "Accept Request";
    } else if (type === "ACCEPTED") {
        const thisBtn = document.getElementById(id);
        const conn = thisBtn.querySelector(".connect");

        // Add play Function here
        conn.onclick = () => {
            sendMessage("ACCEPTED");
        };
        conn.style.backgroundColor = "#07b929";
        conn.style.color = "#ffffff";
        conn.style.border = "1px solid #05af1a";
        conn.textContent = "Play Now";
    }
};
// CONNECTING WITH A USER
const Connect = id => {
    const thisBtn = document.getElementById(id);
    const conn = thisBtn.querySelector(".connect");
    // conn.disabled = true;
    conn.style.backgroundColor = "#00700b";
    conn.textContent = "Request Sent";
    socket.emit("connectToUser", id);
    sendMessage("REQUEST");
    conn.onclick = "";
};

// Handle new connection event

socket.on("newConnection", userId => {
    console.log(`Connected to user ${userId}`);
});

// Handle receive message event
socket.on("receiveMessage", (message, u_id) => {
    updateButton(message, u_id);
    console.log(message);
    console.log(u_id);
    // alert(message.user.u_id);
    // console.log(`Received message from ${userId}: ${message}`);
});
