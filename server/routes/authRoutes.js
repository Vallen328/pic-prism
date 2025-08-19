//This is the normal menthod
// const express = require("express");
// const router = express.Router();

const { login, signup, refresh, switchProfile } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken");

//This is the good method
const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refresh);
router.get("/switch", verifyToken, switchProfile);

module.exports = router;