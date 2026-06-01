const Comments = require("../Models/CommentsModel");
const Task = require("../Models/TaskModel");
const User = require("../Models/UserModel");

exports.AddCommnet = async (req, res) => {
  const { taskID, userID, message } = req.body;

  try {
    const FindTask = await Task.findById(taskID);

    if (!FindTask) return res.status(400).json({ message: "Task Not Found" });

    const FindUser = await User.findById(userID);

    if (!FindUser) return res.status(400).json({ message: "User Not Found" });

    await Comments.create({
      taskID,
      userID,
      message,
    });

    return res.status(200).json({ message: "Comment Added Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.DeleteComment = async (req, res) => {
  const { commentID } = req.params;

  try {

    const FindComment = await Comments.findById(commentID);

    if(!FindComment)
      return res.status(400).json({ message: "Comment Not Found" });

    await Comments.findByIdAndDelete(commentID);

    return res.status(200).json({ message: "Comment Deleted Successfully" })
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
