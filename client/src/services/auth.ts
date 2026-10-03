import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/user",
  withCredentials: true,
});

export const createUser = async (Data: any) => {
  return await API.post("/create", Data);
};

export const LoginUser = async (Data: any) => {
  return await API.post("/login", Data);
};

export const checkSession = async () => {
  return await API.get("/check-session");
};
