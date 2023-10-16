import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const ToastifyFunc = ( msg, type = "error" ) => {
  const toastOptions = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  switch (type) {
    case "error":
      toast.error(msg, toastOptions);
      break;
    case "success":
      toast.success(msg, toastOptions);
      break;
    case "warning":
      toast.warning(msg, toastOptions);
      break;
    default:
      return true;
  }
};
