import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log({ API_URL });


const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

instance.interceptors.request.use(
  function (config) {
    console.log("baseURL", config.baseURL);
    // TODO: Handle auth token
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // TODO: handle refresh token
    return Promise.reject(error);
  }
);

export default instance;
