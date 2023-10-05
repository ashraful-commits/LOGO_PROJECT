import "./App.scss";
import { RouterProvider } from "react-router-dom";
import PublicRoute from "./Routes/PublicRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <ToastContainer />
      {/* Same as */}

      <RouterProvider router={PublicRoute} />
    </>
  );
}

export default App;
