const express = require("express");
const {
  AddCommnet,
  DeleteComment,
} = require("../Controllers/CommentsController");

const CommentRoutes = express.Router();

CommentRoutes.post("/", AddCommnet);
CommentRoutes.delete("/", DeleteComment);

module.exports = CommentRoutes;
