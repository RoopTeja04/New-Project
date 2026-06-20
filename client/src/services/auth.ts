import axios from "axios";
import { data } from "react-router-dom";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/user",
});

export const createUser = async (Data: string) => {
  return await API.post("/create", Data);
};

export const LoginUser = async (Data: string) => {
  return await API.post("/login", Data);
};
