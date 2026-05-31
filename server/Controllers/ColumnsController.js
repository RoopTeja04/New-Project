const Columns = require("../Models/ColumnsModel");
const Projects = require("../Models/ProjectsModel");

exports.CreateColumn = async (req, res) => {
  const { projectID, title } = req.body;

  try {
    const FindCompany = await Projects.findById(projectID);

    if (!FindCompany)
      return res.status(404).json({ message: "Project Not Found" });

    const FindColumns = await Columns.find({ projectID });

    await Columns.create({
      projectID,
      title,
      position: FindColumns.length + 1,
    });

    return res.status(200).json({ message: "Column Added Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.UpdateColumn = async (req, res) => {
  const { columns } = req.body;

  try {
    if (!columns || !Array.isArray(columns) || columns.length === 0)
      return res.status(400).json({ message: "Columns Data Required" });

    const UpdatePositions = columns.map((column) => {
      return Columns.findByIdAndUpdate(
        column._id,
        {
          position: column.position,
          title: column.title,
        },
        { new: true },
      );
    });

    await Promise.all(UpdatePositions);

    return res.status(200).json({
      message: "Column Positions Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.DeleteColumn = async (req, res) => {
  const { id } = req.params;

  try {
    const FindColumn = await Columns.findById(id);

    if (!FindColumn) {
      return res.status(404).json({
        message: "Column Not Found",
      });
    }

    const projectID = FindColumn.projectID;

    await Columns.findByIdAndDelete(id);

    const remainingColumns = await Columns.find({
      projectID,
    }).sort({
      position: 1,
    });

    const updatePromises = remainingColumns.map((column, index) => {
      return Columns.findByIdAndUpdate(
        column._id,

        {
          position: index + 1,
        },
      );
    });

    await Promise.all(updatePromises);

    return res.status(200).json({
      message: "Column Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
