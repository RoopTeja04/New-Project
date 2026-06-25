const express = require("express");
const { GetCompany } = require("../Controllers/CompanyController");

const CompanyRouter = express.Router();

CompanyRouter.get("/:id", GetCompany);

module.exports = CompanyRouter;
