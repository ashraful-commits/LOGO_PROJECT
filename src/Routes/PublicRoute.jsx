import { createBrowserRouter } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import Home from "../Pages/Home/Home";
import Profile from "../Pages/Profile/Profile";
import { Search } from "@mui/icons-material";
import SearchPage from "../Pages/SearchPage";
import Trending from "../Pages/Trending/Trending";
import Explore from "../Pages/Explore/Explore";

const PublicRoute = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/:id",
        element: <Profile />,
      },
      {
        path: "/search/:search",
        element: <SearchPage />,
      },
      {
        path: "/trending",
        element: <Trending />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
    ],
  },
]);

export default PublicRoute;
