import { create } from "zustand";
import axiosInstance from "../lib/axios.ts";

interface JobApplication {
  _id: string;
  title: string;
  company: string;
  link?: string;
  applicationDate: string;
  deadline?: string;
  status: "Applied" | "Interviewing" | "Rejected" | "Offer";
  notes?: string;
}

interface ApplicationState {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  fetchApplications: () => Promise<void>;
  addApplication: (appData: Partial<JobApplication>) => Promise<boolean>;
  updateApplication: (id: string, appData: Partial<JobApplication>) => Promise<boolean>;
  deleteApplication: (id: string) => Promise<boolean>;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  loading: false,
  error: null,

  fetchApplications: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/applications");
      set({ applications: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  addApplication: async (appData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/applications", appData);
      set((state) => ({
        applications: [...state.applications, data],
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    }
  },

  updateApplication: async (id, appData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.put(`/applications/${id}`, appData);
      set((state) => ({
        applications: state.applications.map((app) => (app._id === id ? data : app)),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    }
  },

  deleteApplication: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/applications/${id}`);
      set((state) => ({
        applications: state.applications.filter((app) => app._id !== id),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    }
  },
}));
