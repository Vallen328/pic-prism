//This is the normal menthod
// const express = require("express");
// const router = express.Router();

const { login, signup } = require("../controllers/authController");

//This is the good method
const router = require("express").Router();

router.post("/login", login);
router.post("/signup", signup);

module.exports = router;