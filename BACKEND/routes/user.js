const express = require("express");
const router = express.Router();
const  userControllers  = require("../controllers/userController.js");

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.get('/getUsers', userControllers.getUsers);

module.exports = router;
