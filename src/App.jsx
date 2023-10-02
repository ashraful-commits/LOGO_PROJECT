import "./App.scss";
import { RouterProvider } from "react-router-dom";
import PublicRoute from "./Routes/PublicRoute";

function App() {
  return (
    <>
      <RouterProvider router={PublicRoute} />
    </>
  );
}

export default App;
