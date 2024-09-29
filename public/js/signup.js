"use strict";
const loginBtn = document.querySelector(".login-btn");
const message = document.querySelector("#message");

const setCookie = async (cookieName, cookieValue) => {
    const expirationDate = new Date();
    expirationDate.setTime(
        expirationDate.getTime() + 2 * 30 * 24 * 60 * 60 * 1000
    ); // 2 months in milliseconds
    document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
};
const deleteCookie = cookieName => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() - 1);
    document.cookie = `${cookieName}=; expires=${expirationDate.toUTCString()}; path=/`;
};
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

const login = async userData => {
    const url = "/api/user/signup";
    /*
    const userData = {
        email: "ghsjulian@gmail.com",
        password: "ghsjulian_&85;"
    };
    */
    try {
        const sendData = await fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userData)
        });
        const response = await sendData.json();
        if (response.type) {
            showMessage(true, response.message);
            setCookie("u_id", response.id);
            setCookie("u_name", response.name);
            window.location.href = "/";
            //console.log(response);
        } else {
            showMessage(false, response.error);
        }
    } catch (error) {
        showMessage(false, error);
    }
};

const showMessage = (type, msg) => {
    if (type) {
        message.style.display = "block";
        message.classList.add("success");
        message.textContent = msg;
    } else {
        message.style.display = "block";
        message.classList.add("error");
        message.textContent = msg;
    }
    setTimeout(() => {
        message.style.display = "none";
        message.textContent = "";
    }, 3000);
};

loginBtn.onclick = e => {
    e.preventDefault();
    var name = document.querySelector("#name").value;
    var email = document.querySelector("#email").value;
    var phone = document.querySelector("#phone").value;
    var password = document.querySelector("#password").value;
    if (name === "") {
        showMessage(false, "Please Enter Username !");
        return;
    }
    if (email === "") {
        showMessage(false, "Please Enter Email !");
        return;
    }
    if (phone === "") {
        showMessage(false, "Please Enter Phone Number!");
        return;
    }
    if (password === "") {
        showMessage(false, "Please Enter Password !");
        return;
    } else {
        login({ name, email, phone, password });
    }
};
