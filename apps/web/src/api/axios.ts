import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("filenest_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global Error Handling
    if (error.response && error.response.status === 401) {
      // If the backend says the token is invalid/expired (401), automatically log them out!
      console.warn("Unauthorized! Clearing token and redirecting to login...");
      localStorage.removeItem("filenest_token");
      localStorage.removeItem("filenest_user");

      // Force a redirect to login page (if window is available)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
