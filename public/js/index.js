"use strict";

const settingsBtn = document.querySelector(".settings");
const settingsBtnIcon = document.querySelector("#settings");
const navBtnIcon = document.querySelector("#side-bar");
const navBtn = document.querySelector(".nav-btn");
const sideBar = document.querySelector("aside");
const nav = document.querySelector("#nav");

/* For Messaging */

const usersContainer = document.querySelector("#active-users");
const chatbox = document.querySelector(".chatbox");
const message = document.querySelector("#message");
const send = document.querySelector(".send");

navBtn.onclick = () => {
    sideBar.classList.toggle("mobile-menu");
    navBtnIcon.classList.toggle("bi-x");
};
settingsBtn.onclick = () => {
    nav.classList.toggle("mobile-nav");
    settingsBtnIcon.classList.toggle("bi-x");
};

const updateUser = (id, name) => {
    usersContainer.innerHTML += `
    <a id="${id}" href="#">
       <img src="/icons/user.png" />
       <span>${name}</span>
    </a>
    `;
};

// Get Cookies

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

// Socket Will Be Create Here...
const socket = io();
const u_name = getCookie("u_name");
const u_id = getCookie("u_id");

socket.on("connection", () => {
    console.log("Connected to server");
});

socket.emit("user", JSON.stringify({ u_id, u_name }));

socket.on("activeUsers", users => {
    console.log("All Active Users : ", users);
    // alert(JSON.stringify(users));
});

socket.on("newUser", user => {
    console.log("New User : ",user);
 //  updateUser()
    // alert(JSON.stringify(user));
});

socket.on("userLeft", user => {
    console.log(user);
});

socket.on("disconnect", () => {
    console.log("User Disconnected");
});

const sendMessage = (message, id) => {
    console.log("Send Message Here : ", message);
};
// SENDING MESSAGES CODES HERE...
const updateMessage = (data, position) => {
    chatbox.innerHTML += `
    <div class="message ${position}">
    <p>${data}</p>
    <!--<small>2:30PM</small>-->
    </div>
    `;
    chatbox.scrollTop = chatbox.scrollHeight;
};
message.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        send.click();
    }
});
send.addEventListener("click", () => {
    if (message.value === "") return;
    message.focus();
    updateMessage(message.value.trim(), "right");
    sendMessage(message.value, 123);
    message.value = "";
});
