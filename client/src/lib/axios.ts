import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;
