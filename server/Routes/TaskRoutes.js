const express = require("express");
const {
  CreateTask,
  GetTaskByColumn,
  UpdateTaskColumn,
  GetTask,
  DeleteTask,
} = require("../Controllers/TaskController");

const TaskRoutes = express.Router();

TaskRoutes.post("/", CreateTask);
TaskRoutes.get("/:columnID", GetTaskByColumn);
TaskRoutes.put("/:columnID/:TaskID", UpdateTaskColumn);
TaskRoutes.get("/one/:TaskID", GetTask);
TaskRoutes.delete("/:TaskID", DeleteTask);

module.exports = TaskRoutes;
