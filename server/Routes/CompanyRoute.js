const express = require("express");
const {
  GetCompany,
  UpdateCompany,
} = require("../Controllers/CompanyController");

const CompanyRouter = express.Router();

CompanyRouter.get("/:id", GetCompany);

CompanyRouter.put("/:id", UpdateCompany);

module.exports = CompanyRouter;
