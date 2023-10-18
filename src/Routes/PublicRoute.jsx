import { createBrowserRouter } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import Home from "../Pages/Home/Home";
import Profile from "../Pages/Profile/Profile";
import { Search } from "@mui/icons-material";
import SearchPage from "../Pages/SearchPage";

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
    ],
  },
]);

export default PublicRoute;
