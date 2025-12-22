const express = require("express");
const router = express.Router();

const { login } = require("../controladores/login.controlador.js");

router.post("/login", login);

module.exports = router;
