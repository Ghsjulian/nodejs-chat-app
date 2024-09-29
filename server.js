const express = require("express");
const ejs = require("ejs");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const server = require("http").createServer(app);
//const IO = require("./src/socket/socket.io");
const socketManager = require("./src/socket/connection");
const router = require("./src/router/");
dotenv.config();
const isLogin = require("./src/auth/isLogin");
const isToken = require("./src/auth/isToken");
const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";
const dbName = process.env.DB;
const URI = process.env.URI;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(cors({ origin: "*" }));
app.use("/api", router);
app.get("/",isLogin, (req, res) => {
    socketManager.init(server);
    res.render("chatbox");
});
app.get("/signup", isToken, (req, res) => {
    res.render("signup");
});
app.get("/login", isToken, (req, res) => {
    res.render("login");
});
app.get("/chatbox", isLogin, (req, res) => {
    res.render("chatbox");
});

mongoose
    .connect(URI, { dbName })
    .then(() => {
        server.listen(PORT, () => {
            console.clear();
            console.log(
                `\n ____________________________________________________`
            );
            console.log(`\n [+]  DATABASE CONNECTED SUCCESSFULLY !`);
            console.log(`\n [+]  SOCKET CONNECTION ESTABLISHED SUCCESSFULLY !`);
            console.log(`\n [+]  SERVER IS RUNNING ON PORT - ${HOST}:${PORT}`);
            console.log(`\n [+]  WEB DEVELOPER NAME : GHS JULIAN`);
            console.log(`\n [+]  https://github.com/Ghsjulian`);
            console.log(`\n [+]  https://ghsresume.netlify.app`);
            console.log(
                ` ____________________________________________________\n\n`
            );
        });
    })
    .catch(error => {
        console.clear();
        console.log(error);
    });
