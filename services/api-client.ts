import getSessionFromToken from "@/actions/get-session-from-token";
import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  const session = await getSessionFromToken();
  let token = "";
  if (session && session.token) token = session.token;
  config.headers["x-auth-token"] = token;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("token", { path: "/" });
      window.location.href = "/log-in";
    }
    return Promise.reject(error);
  }
);

export default instance;
