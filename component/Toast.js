import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Toast = (msg) => {
  toast(msg, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Flip,
    progress: undefined,
  });
};

export default Toast;
