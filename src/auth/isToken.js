const myFunction = require("./functions");
const isToken = async (req, res, next) => {
    if (!req.cookies["token"]) {
        next();
    } else {
        res.redirect("/");
    }
};

module.exports = isToken;
