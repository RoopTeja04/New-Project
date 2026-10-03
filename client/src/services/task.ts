import axios from "axios";

interface CreateTaskPayload {
  projectID: string;
  columnID: string;
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  assigneedID: string;
  createdUser: string;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API + "/task",
  withCredentials: true,
});

export const CreateTask = async (data: CreateTaskPayload) => {
  return await API.post("/", data);
};

export const GetTaskByColumn = async (columnID: string) => {
  return await API.get(`/${columnID}`);
};

export const UpdateTaskColumn = async (columnID: string, taskID: string) => {
  return await API.put(`/${columnID}/${taskID}`);
};

export const GetTask = async (taskID: string) => {
  return await API.get(`/one/${taskID}`);
};

export const DeleteTask = async (taskID: string) => {
  return await API.delete(`/${taskID}`);
};
