const express = require("express");
const {
  CreateColumn,
  UpdateColumn,
  DeleteColumn,
  GetColumns,
} = require("../Controllers/ColumnsController");

const ColumnsRouter = express.Router();

ColumnsRouter.post("/", CreateColumn);
ColumnsRouter.patch("/", UpdateColumn);
ColumnsRouter.delete("/:id", DeleteColumn);

ColumnsRouter.get("/:projectID", GetColumns);

module.exports = ColumnsRouter;
