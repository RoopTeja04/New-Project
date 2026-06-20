const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const UserRoutes = require("./Routes/UserRoutes");
const InvitationRouter = require("./Routes/InvitationRoutes");
const ProjectRouter = require("./Routes/ProjectRoutes");
const ColumnsRouter = require("./Routes/ColumnsRoute");
const ProjectMemberRouter = require("./Routes/ProjectMemeberRoutes");
const TaskRoutes = require("./Routes/TaskRoutes");
const CommentRoutes = require("./Routes/CommentRoutes");
// const ActivityLogsRoutes = require("./Routes/ActivityLogsRoutes");
const MongoStore = require("connect-mongo").default;

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      touchAfter: 24 * 3600,
    }),

    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  }),
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  return res.status(200).json({ message: "server started running" });
});

app.use("/user", UserRoutes);
app.use("/invite", InvitationRouter);
app.use("/project", ProjectRouter);
app.use("/column", ColumnsRouter);
app.use("/project-member", ProjectMemberRouter);
app.use("/task", TaskRoutes);
app.use("/comment", CommentRoutes);
// app.use("/activity-log", ActivityLogsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
