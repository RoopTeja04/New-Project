const express = require("express");

const CompanyRouter = express.Router();
const { GetCompany } = require("../Controllers/CompanyController");

CompanyRouter.get("/:id", GetCompany);

module.exports = CompanyRouter;
