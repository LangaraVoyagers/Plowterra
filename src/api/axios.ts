import axios, { AxiosRequestConfig } from "axios";
import endpoints from "./endpoints";
import { Cookies } from "react-cookie";
import paths from "shared/paths";

const cookies = new Cookies();

const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    const token = cookies.get("_t");
    config.headers = config.headers ?? {};
    config.headers.Authorization = token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response.config.url === endpoints.signin) {
      const token = response?.data?.data?.token;
      cookies.set("_t", token);
    }

    return response;
  },
  async function (error) {
    const code = error.response.status;
    const originalRequest = error.config;

    if (code === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      window.location.replace(paths.logout);

      // const {
      //   data: { data },
      // } = await instance.get("/auth/refresh", {
      //   headers: {
      //     Authorization: cookies.get("_t"),
      //   },
      // });

      // if (data?.token) {
      //   cookies.set("_t", data?.token);
      //   originalRequest.headers["Authorization"] = data?.token;
      //   return axios.request(originalRequest);
      // }
    }

    // TODO: handle refresh token
    return Promise.reject(error);
  }
);

export default instance;
