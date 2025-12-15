const express = require("express");
const router = express.Router();
const loginController = require("../controladores/login.controlador");

router.post("/", loginController.login);

module.exports = router;
