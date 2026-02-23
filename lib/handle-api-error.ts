import { AxiosError } from "axios";
import toast from "react-hot-toast";

export function handleApiError(error: unknown, fallback?: string) {
  if (error instanceof AxiosError && error.response) {
    toast.error(error.response.data.message);
  } else if (fallback) {
    toast.error(fallback);
  }
}
