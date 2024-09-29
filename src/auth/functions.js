const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });


class myFunction {
    async makeHash(password) {
        try {
            const salt = await bcrypt.genSalt(10); // generate a salt with 10 rounds
            const hash = await bcrypt.hash(password, salt); // hash the password with the salt
            return hash;
        } catch (error) {
            return null;
        }
    }
    async matchHash(password, hash) {
        try {
            const isMatch = await bcrypt.compare(password, hash); // compare the password with the hash
            return isMatch;
        } catch (error) {
            return false;
        }
    }

    async encodeJWT(payload) {
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn : process.env.EXPIRES_IN});
    }
    async decodeJWT(token) {
        try {
            return jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return null;
        }
    }
    
}

module.exports = new myFunction();
