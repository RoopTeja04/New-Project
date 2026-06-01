const Tasks = require("../Models/TaskModel");
const Projects = require("../Models/ProjectsModel");
const Column = require("../Models/ColumnsModel");
const User = require("../Models/UserModel");

exports.CreateTask = async (req, res) => {
  try {
    const {
      projectID,
      columnID,
      title,
      description,
      priority,
      // status,
      assigneedID,
      createdUser,
    } = req.body;

    const FindProject = await Projects.findById(projectID);

    if (!FindProject)
      return res.status(400).json({ message: "Project Not Found" });

    const FindColumn = await Column.findOne({ projectID, _id: columnID });

    if (!FindColumn)
      return res
        .status(400)
        .json({ messsage: "Column not found for this project" });

    const FindAssignedUser = await User.findById(assigneedID);

    if (!FindAssignedUser)
      return res.status(400).json({ message: "Assigned User Not Found" });

    const FindCreatedUser = await User.findById(createdUser);

    if (!FindCreatedUser)
      return res.status(400).json({ message: "Created User Not Found" });

    const columnTasks = await Tasks.find({ columnID });

    const newTask = await Tasks.create({
      projectID,
      columnID,
      title,
      description,
      priority,
      // status,
      assigneedID,
      createdUser,
      position: columnTasks.length + 1,
    });

    return res
      .status(201)
      .json({ message: "Task Created Successfully", newTask });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.GetTaskByColumn = async (req, res) => {
  const { columnID } = req.params;

  try {
    const FindColumn = await Column.findById(columnID);

    if (!FindColumn)
      return res.status(400).json({ message: "Column Not Found" });

    const findTasks = await Tasks.find({ columnID })
      .populate("columnID")
      .populate("assigneedID", "-password -email")
      .populate("createdUser", "-password -email");

    if (!findTasks) return res.status(400).json({ message: "Task Not Found" });

    return res
      .status(200)
      .json({ message: "Task Found", TotalTasks: findTasks.length, findTasks });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.UpdateTaskColumn = async (req, res) => {
  const { columnID, TaskID } = req.params;
  try {
    const FindColumn = await Column.findById(columnID);

    if (!FindColumn)
      return res.status(400).json({ message: "Column Not Found" });

    const findTasks = await Tasks.findById(TaskID);

    if (!findTasks) return res.status(400).json({ message: "Task Not Found" });

    const columns = await Tasks.find({ columnID });

    await Tasks.findByIdAndUpdate(
      TaskID,
      { columnID, position: columns.length + 1 },
      { new: true },
    );

    return res.status(200).json({ message: "Task moved successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.GetTask = async (req, res) => {
  const { TaskID } = req.params;

  try {
    const FindTask = await Tasks.findById(TaskID)
      .populate("assigneedID", "-password -email")
      .populate("createdUser", "-password -email");

    if (!FindTask) return res.status(400).json({ message: "Task not Found" });

    return res.status(200).json({ message: "Task Found", FindTask });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.DeleteTask = async (req, res) => {
  const { TaskID } = req.params;

  try {
    const FindTask = await Tasks.findById(TaskID);

    if (!FindTask) return res.status(400).json({ message: "Task not Found" });

    await Tasks.findByIdAndDelete(TaskID);

    return res.status(200).json({ message: "Task Delete Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
