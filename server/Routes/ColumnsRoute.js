const express = require("express");
const {
  CreateColumn,
  UpdateColumn,
  DeleteColumn,
} = require("../Controllers/ColumnsController");

const ColumnsRouter = express.Router();

ColumnsRouter.post("/", CreateColumn);
ColumnsRouter.patch("/", UpdateColumn);
ColumnsRouter.delete("/:id", DeleteColumn);

module.exports = ColumnsRouter;
