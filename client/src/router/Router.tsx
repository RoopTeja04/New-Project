import { createBrowserRouter } from "react-router-dom";
import WebsiteHeader from "../Components/GlobalComponents/Websiteheader";
import Home from "../Pages/Website/Home";
import About from "../Pages/Website/About";
import Create from "../Components/AuthComponents/Create";
import Login from "../Components/AuthComponents/Login";
import Layout from "../Components/GlobalComponents/Layout";
import Dashboard from "../Pages/Main/Dashboard/dashboard";
import Projects from "../Pages/Main/Projects/projects";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <WebsiteHeader />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
    ]
  },

  { path: "/create", element: <Create /> },
  { path: "/login", element: <Login /> },

  {
    path:"/dashboard",
    element: <Layout />,
    children:[
      { index: true, element: <Dashboard /> },
      { path: "projects", element:<Projects /> },
    ]
  }
]);

export default Router;