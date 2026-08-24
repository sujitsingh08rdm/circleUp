import axios from "axios";
import { toast, type ToastPosition } from "react-toastify";

const CatchError = (error: unknown, position: ToastPosition = "top-right") => {
  if (axios.isAxiosError(error)) {
    return toast.error(error.response?.data.message, { position });
  }

  if (error instanceof Error) {
    return toast.error(error.message, { position });
  }
  toast.error("Something went wrong", { position });
};

export default CatchError;
