const express = require("express");
const { CreateAccount, Login } = require("../controllers/UserController");

const UserRoutes = express.Router();

UserRoutes.post("/create", CreateAccount);
UserRoutes.post("/login", Login);

module.exports = UserRoutes;
