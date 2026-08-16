import { createBrowserRouter } from "react-router-dom";
import WebsiteHeader from "../Components/GlobalComponents/Websiteheader";
import Home from "../Pages/Website/Home";
import About from "../Pages/Website/About";
import Create from "../Components/AuthComponents/Create";
import Login from "../Components/AuthComponents/Login";
import Layout from "../Components/GlobalComponents/Layout";
import Dashboard from "../Pages/Main/Dashboard/Dashboard";
import Projects from "../Pages/Main/Projects/Projects";
import AddProjects from "../Pages/Main/Projects/AddProjects";
import Invites from "../Pages/Main/Invites/Invites";
import Company from "../Pages/Main/Company/Company";
import InviteHistory from "../Pages/Main/Invites/InviteHistory";
import Invite from "../Pages/Main/Invites/Invite";
import ViewProject from "../Pages/Main/Projects/ViewProject";
import TasksViewProject from "../Pages/Main/Projects/TasksViewProject";
import UpdateProjectDetails from "../Pages/Main/Projects/UpdateProjectDetails";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <WebsiteHeader />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
    ],
  },

  { path: "/create", element: <Create /> },
  { path: "/login", element: <Login /> },

  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "projects", element: <Projects /> },
      { path: "add-projects", element: <AddProjects /> },
      { path: "invites", element: <Invites /> },
      { path: "invites-history", element: <InviteHistory /> },
      { path: "company", element: <Company /> },
      { path: "view-project", element: <ViewProject /> },
      { path: "tasks-view-project", element: <TasksViewProject /> },
      { path: "update-project-details", element: <UpdateProjectDetails /> },
    ],
  },

  {
    path: "/invite",
    element: <Invite />,
  },
]);

export default Router;
