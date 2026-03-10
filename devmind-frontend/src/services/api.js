import axios from "axios";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://devmindai-backend-fb76.onrender.com";
const baseURL = apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;

const api = axios.create({
  baseURL,
});

// Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
