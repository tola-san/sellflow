import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        || (import.meta.env.PROD ? "/api/v1" : "http://127.0.0.1:8000/api/v1"),
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
