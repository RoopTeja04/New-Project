import { create } from "zustand";
import {
  CreateTask,
  DeleteTask,
  GetTaskByColumn,
  UpdateTaskColumn,
} from "../services/task";

interface TaskState {
  tasksByColumn: Record<string, any[]>;
  loading: boolean;
  creating: boolean;

  setTasksForColumn: (columnID: string, tasks: any[]) => void;
  reorderTasksInColumn: (columnID: string, tasks: any[]) => void;

  getTasksByColumn: (columnID: string) => Promise<any>;
  createTask: (data: any) => Promise<any>;
  moveTask: (
    taskID: string,
    fromColumnID: string,
    toColumnID: string,
  ) => Promise<any>;
  deleteTask: (taskID: string, columnID: string) => Promise<any>;
}

const useTaskStore = create<TaskState>((set, get) => ({
  tasksByColumn: {},
  loading: false,
  creating: false,

  setTasksForColumn: (columnID, tasks) =>
    set((state) => ({
      tasksByColumn: { ...state.tasksByColumn, [columnID]: tasks },
    })),

  reorderTasksInColumn: (columnID, tasks) =>
    set((state) => ({
      tasksByColumn: { ...state.tasksByColumn, [columnID]: tasks },
    })),

  getTasksByColumn: async (columnID: string) => {
    try {
      set({ loading: true });
      const res = await GetTaskByColumn(columnID);
      set((state) => ({
        tasksByColumn: {
          ...state.tasksByColumn,
          [columnID]: res.data.findTasks,
        },
      }));
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (data: any) => {
    try {
      set({ creating: true });
      const res = await CreateTask(data);
      const newTask = res.data.newTask;

      set((state) => ({
        tasksByColumn: {
          ...state.tasksByColumn,
          [data.columnID]: [
            ...(state.tasksByColumn[data.columnID] || []),
            newTask,
          ],
        },
      }));

      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ creating: false });
    }
  },

  moveTask: async (taskID, fromColumnID, toColumnID) => {
    const { tasksByColumn } = get();
    const fromTasks = tasksByColumn[fromColumnID] || [];
    const task = fromTasks.find((t) => t._id === taskID);
    if (!task) return;

    const toTasks = tasksByColumn[toColumnID] || [];

    set({
      tasksByColumn: {
        ...tasksByColumn,
        [fromColumnID]: fromTasks.filter((t) => t._id !== taskID),
        [toColumnID]: [...toTasks, { ...task, columnID: toColumnID }],
      },
    });

    try {
      const res = await UpdateTaskColumn(toColumnID, taskID);
      return res;
    } catch (err: any) {
      set({
        tasksByColumn: {
          ...get().tasksByColumn,
          [fromColumnID]: fromTasks,
          [toColumnID]: toTasks,
        },
      });
      throw err.response?.data ?? err;
    }
  },

  deleteTask: async (taskID, columnID) => {
    const { tasksByColumn } = get();
    const tasks = tasksByColumn[columnID] || [];

    set({
      tasksByColumn: {
        ...tasksByColumn,
        [columnID]: tasks.filter((t) => t._id !== taskID),
      },
    });

    try {
      const res = await DeleteTask(taskID);
      return res;
    } catch (err: any) {
      set({
        tasksByColumn: { ...get().tasksByColumn, [columnID]: tasks },
      });
      throw err.response?.data ?? err;
    }
  },
}));

export default useTaskStore;
