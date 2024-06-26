import axios from "axios";

import config from "@/config/index";

axios.defaults.baseURL = config.baseUrl;
axios.defaults.withCredentials = true;

const axiosClient = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

export default axiosClient;
