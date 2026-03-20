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
    const requestUrl = error.config?.url || "";
    const isSessionCheck = requestUrl.includes("/auth/me");
    const hadToken = !!error.config?.headers?.["x-auth-token"];

    // Only redirect on 401 if:
    // 1. The request had a token (session expired), not an unauthenticated visitor
    // 2. It's not the session check endpoint
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isSessionCheck &&
      hadToken
    ) {
      Cookies.remove("token", { path: "/" });
      const lang = window.location.pathname.split("/")[1] || "en";
      window.location.href = `/${lang}/log-in`;
    }
    return Promise.reject(error);
  }
);

export default instance;
