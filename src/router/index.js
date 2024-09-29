const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/user/signup", userController.UserSignup);
router.post("/user/login", userController.UserLogin);
router.get("/get-user/:id", userController.getUserById);

module.exports = router;
