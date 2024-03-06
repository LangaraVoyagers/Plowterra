import axios, { AxiosRequestConfig } from "axios";
import endpoints from "./endpoints";
import { Cookies } from "react-cookie";

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
  function (error) {
    // TODO: handle refresh token
    return Promise.reject(error);
  }
);

export default instance;
