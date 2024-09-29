const myFunction = require("./functions");
const isLogin = async (req, res, next) => {
    if (req.cookies["token"]) {
        const user = await myFunction.decodeJWT(req.cookies["token"]);
        next();
    }else{
       res.redirect("/login");
    }
};

module.exports = isLogin;
