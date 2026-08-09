/// <reference types="vite/client" />
import axios from "axios";
import { getAuthToken } from "./authSession";

const configuredBaseUrl = import.meta.env.VITE_API_URL
    || (import.meta.env.PROD ? "/api/v1" : "http://127.0.0.1:8000/api/v1");

const api = axios.create({
    baseURL: configuredBaseUrl.replace(/\/+$/, ""),
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
