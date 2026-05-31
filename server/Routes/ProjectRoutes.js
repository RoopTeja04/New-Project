const express = require("express");
const {
  CreateProject,
  GetProjectDetails,
  GetProjectByCompany,
} = require("../Controllers/ProjectsController");

const ProjectRouter = express.Router();

ProjectRouter.post("/", CreateProject);
ProjectRouter.get("/:projectID", GetProjectDetails);
ProjectRouter.get("/total-projects/:companyID", GetProjectByCompany);

module.exports = ProjectRouter;
