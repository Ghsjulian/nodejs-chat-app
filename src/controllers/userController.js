const User = require("../models/Users");
const myFunction = require("../auth/functions");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

class userController {
    async UserSignup(req, res) {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                code: 403,
                type: false,
                status: "failed",
                message: "All Fields Are Required"
            });
        }
        if (name.length < 3) {
            return res.status(400).json({
                code: 403,
                status: "failed",
                type: false,
                message: "Username Must Be At Least 3 Characters"
            });
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).json({
                code: 403,
                status: "failed",
                type: false,
                message: "Invalid Email Address"
            });
        }
        if (password.length < 5) {
            return res.status(400).json({
                code: 403,
                status: "failed",
                type: false,
                message: "Password Must Be At Least 8 Characters"
            });
        }
        try {
            const isExist = await User.findOne({ email, name });
            if (isExist) {
                return res.status(403).json({
                    code: 403,
                    status: "failed",
                    type: false,
                    message: "User Already Registered!"
                });
            } else {
                const encPassword = await myFunction.makeHash(password);
                var date = new Date();
                const today = date.toDateString();
                const token = await myFunction.encodeJWT({
                    name,
                    email,
                    today
                });
                const newUser = new User({
                    name,
                    email,
                    phone,
                    password: encPassword,
                    token,
                    type: "Admin"
                });
                const save = await newUser.save();
                if (save) {
                    date.setDate(date.getDate() + 30);
                    res.cookie("token", token, {
                        expires: date
                    });
                    return res.status(201).json({
                        code: 201,
                        status: "success",
                        type: "User",
                        token,
                        date: today,
                        id: newUser._id,
                        name ,
                        message: "User Registration Successfully!"
                    });
                } else {
                    throw new Error("Error User Registration");
                }
            }
        } catch (error) {
            return res.status(500).json({
                code: 500,
                status: "faild",
                type: false,
                message: error.message || "Server Error!"
            });
        }
    }
    async UserLogin(req, res) {
        const email = req.body.email.trim();
        const password = req.body.password.trim();
        // Validation
        if (!email || !password) {
            return res.status(403).json({
                code: 403,
                type: false,
                status: "failed",
                message: "All Fields Are Required"
            });
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).json({
                code: 403,
                type: false,
                status: "failed",
                message: "Invalid Email Address"
            });
        }
        if (password.length < 5) {
            return res.status(400).json({
                code: 403,
                type: false,
                status: "failed",
                message: "Password Must Be At Least 8 Characters"
            });
        }
        try {
            const isExist = await User.findOne({ email });
            if (isExist) {
                if (isExist.email === email) {
                    try {
                        const isMatch = await myFunction.matchHash(
                            password,
                            isExist.password
                        );
                        if (isMatch) {
                            var date = new Date();
                            const today = date.toDateString();
                            const name = isExist.name;
                            const token = await myFunction.encodeJWT({
                                name,
                                email,
                                today
                            });
                            const update = await User.findOneAndUpdate(
                                { email },
                                { token }
                            );
                            if (update) {
                                date.setDate(date.getDate() + 30);
                                res.cookie("token", token, {
                                    expires: date
                                });
                                res.status(200).json({
                                    code: 200,
                                    type: isExist.type,
                                    id: isExist._id,
                                    token,
                                    name : isExist.name,
                                    date: today,
                                    status: "success",
                                    message: "User Logged In Successfully"
                                });
                            } else {
                                return res.status(403).json({
                                    code: 403,
                                    type: false,
                                    status: "failed",
                                    message: "Invalid Username Or Password"
                                });
                            }
                        } else {
                            return res.status(403).json({
                                code: 403,
                                type: false,
                                status: "failed",
                                message: "Invalid User Credentials !"
                            });
                        }
                    } catch (err) {
                        return res.status(500).json({
                            code: 403,
                            type: false,
                            message: "Error User Login"
                        });
                    }
                }
            } else {
                res.status(403).json({
                    code: 403,
                    type: false,
                    status: "failed",
                    message: "Invalid Credentials , Please Try Again"
                });
            }
        } catch (err) {
            return res.status(500).json({
                code: 403,
                type: false,
                status: "failed",
                message: err.message || "Error User Login"
            });
        }
    }
    async logout(req, res) {
        const token = req.body.token.trim();
        const userId = req.body.userId.trim();
        // Validation
        if (!token || !userId) {
            return res.status(400).json({
                code: 403,
                type: false,
                status: "failed",
                message: "All Fields Are Required"
            });
        }
        try {
            const isExist = await myFunction.findOne({
                user_token: token,
                _id: userId
            });
            if (isExist) {
                if (isExist.user_token === token && isExist._id == userId) {
                    const date = new Date();
                    const today = date.toDateString();
                    const username = isExist.user_name;
                    const email = isExist.user_email;
                    const token = await myFunction.encodeJWT({
                        username,
                        email,
                        today
                    });
                    const update = await User.findOneAndUpdate(
                        { user_email: email },
                        { user_token: "" }
                    );
                    if (update) {
                        return res.status(201).json({
                            code: 201,
                            type: true,
                            status: "success",
                            message: "User Logged Out Successfully"
                        });
                    } else {
                        return res.status(403).json({
                            code: 403,
                            type: false,
                            status: "failed",
                            message: "Invalid Logout"
                        });
                    }
                } else {
                    res.status(403).json({
                        code: 403,
                        type: false,
                        status: "failed",
                        message: "Invalid Logout !"
                    });
                }
            } else {
                res.status(403).json({
                    code: 403,
                    type: false,
                    status: "failed",
                    message: "ghs Invalid Logout !"
                });
            }
        } catch (err) {
            res.status(403).json({
                code: 403,
                type: false,
                status: "failed",
                message: "Invalid Logout !"
            });
        }
    }
    async users(req, res) {
        try {
            const users = await User.find().exec();
            // console.log(users);
            return res.status(200).json(users);
        } catch (err) {
            console.log(err);
            return res.status(404).json({
                code: 404,
                status: "failed",
                message: "No User Found!"
            });
        }
    }
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            return res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(404).json({
                code: 404,
                status: "failed",
                message: "No User Found!"
            });
        }
    }
    async deleteUser(req, res) {
        const userId = req.params.id;
        try {
            const isExist = await myFunction.findOne({ _id: userId });
            if (isExist) {
                const isDelete = await User.findByIdAndDelete(userId);
                return res.status(204).json({
                    code: 204,
                    status: "success",
                    message: "User Deleted Successfully"
                });
            } else {
                return res.status(404).json({
                    code: 404,
                    status: "failed",
                    message: "User Doesn't Exist"
                });
            }
        } catch (err) {
            return res.status(403).json({
                code: 403,
                status: "failed",
                message: "User Deleted Failed"
            });
        }
    }
}

module.exports = new userController();
