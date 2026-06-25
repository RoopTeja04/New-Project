const express = require("express");
const { CreateAccount, Login, CheckSession } = require("../Controllers/UserController");

const UserRoutes = express.Router();

UserRoutes.post("/create", CreateAccount);
UserRoutes.post("/login", Login);
UserRoutes.get("/check-session", CheckSession);

module.exports = UserRoutes;
