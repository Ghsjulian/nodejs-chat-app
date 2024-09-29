"use strict";

const settingsBtn = document.querySelector(".settings");
const settingsBtnIcon = document.querySelector("#settings");
const navBtnIcon = document.querySelector("#side-bar");
const navBtn = document.querySelector(".nav-btn");
const sideBar = document.querySelector("aside");
const nav = document.querySelector("#nav");

/* For Messaging */
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
