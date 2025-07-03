import axios from "axios";
import { API_URL } from "./constants/api.constants.js";
import env from "#config/env/env.js";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Authorization": env.API_KEY,
        "Content-Type": "application/json",
    },
});
