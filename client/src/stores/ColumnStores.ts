import { create } from "zustand";
import {
  CreateColumn,
  DeleteColumn,
  UpdateColumnPositions,
  GetColumnsByProjectID,
} from "../services/column";

interface ColumnState {
  columns: any[];
  creating: boolean;

  setColumns: (columns: any[]) => void;

  createColumn: (projectID: string, title: string) => Promise<any>;
  reorderColumns: (columns: any[]) => Promise<any>;
  deleteColumn: (id: string) => Promise<any>;
  getColumns: (projectID: string) => Promise<any>;
}

const useColumnStore = create<ColumnState>((set, get) => ({
  columns: [],
  creating: false,

  setColumns: (columns) => set({ columns }),

  createColumn: async (projectID, title) => {
    try {
      set({ creating: true });
      const res = await CreateColumn({ projectID, title });
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    } finally {
      set({ creating: false });
    }
  },

  reorderColumns: async (columns) => {
    const previous = get().columns;
    set({ columns });

    try {
      const res = await UpdateColumnPositions(
        columns.map((c) => ({
          _id: c._id,
          title: c.title,
          position: c.position,
        })),
      );
      return res;
    } catch (err: any) {
      set({ columns: previous });
      throw err.response?.data ?? err;
    }
  },

  deleteColumn: async (id) => {
    const previous = get().columns;
    set({ columns: previous.filter((c) => c._id !== id) });

    try {
      const res = await DeleteColumn(id);
      return res;
    } catch (err: any) {
      set({ columns: previous });
      throw err.response?.data ?? err;
    }
  },

  getColumns: async (projectID) => {
    try {
      const res = await GetColumnsByProjectID(projectID);
      const sorted = [...(res.data?.foundColumns ?? [])].sort(
        (a: any, b: any) => a.position - b.position,
      );
      set({ columns: sorted });
      return res;
    } catch (err: any) {
      throw err.response?.data ?? err;
    }
  },
}));

export default useColumnStore;
