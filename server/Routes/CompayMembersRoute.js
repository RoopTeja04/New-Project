const express = require("express");
const { getCompanyMembers } = require("../Controllers/CompanyMembersController");

const CompanyMembersRouter = express.Router();

CompanyMembersRouter.get("/:id", getCompanyMembers);

module.exports = CompanyMembersRouter;