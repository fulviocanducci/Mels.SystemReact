import { useEffect } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IToast } from "../../@types";

export default function Toast({ show, change }: IToast) {
  const notify = () =>
    toast.success("Dados foram alterados com êxito", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  useEffect(() => {
    if (show) {
      notify();
      change(false);
    }
  }, [show, change]);
  return <ToastContainer />;
}
