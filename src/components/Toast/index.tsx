import { useEffect } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IToast } from "../../@types";

export default function Toast({
  message,
  show,
  change,
  type = "success",
}: IToast) {
  const notify = () => {
    if (type === "success") {
      toast.success(message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
    if (type === "error") {
      toast.error(message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
  useEffect(() => {
    if (show) {
      notify();
      change(false);
    }
  }, [change, show, type]);
  return <ToastContainer />;
}
