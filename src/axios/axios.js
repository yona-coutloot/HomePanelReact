import axios from "axios";

let baseURL = null;
if (process.env.NODE_ENV === "development") {
  baseURL = process.env.REACT_APP_DEV_BASE_URL;
} else if (process.env.NODE_ENV === "production") {
  baseURL = process.env.REACT_APP_PROD_BASE_URL;
} else if (process.env.NODE_ENV === "test") {
  baseURL = process.env.REACT_APP_LOCAL_BASE_URL;
}

const apiConfig = axios.create({
  baseURL,
  headers: {
    token: localStorage.getItem("token"),
  },
});

apiConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

export default apiConfig;
