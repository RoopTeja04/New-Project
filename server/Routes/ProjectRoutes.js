const express = require("express");
const {
  CreateProject,
  GetProjectDetails,
  GetProjectByCompany,
  GetProjectStats,
} = require("../Controllers/ProjectsController");

const ProjectRouter = express.Router();

ProjectRouter.post("/", CreateProject);

ProjectRouter.get("/:projectID", GetProjectDetails);
ProjectRouter.get("/total-projects/:companyID", GetProjectByCompany);
ProjectRouter.get("/stats/:companyID", GetProjectStats);

module.exports = ProjectRouter;
