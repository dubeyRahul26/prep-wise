import { create } from "zustand";
import axios from "axios";

interface User {
  id:string
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<Boolean>;
  register: (name: string, email: string, password: string) => Promise<Boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(`/auth/login`, { email, password }, { withCredentials: true });
      set({ user: data.user, loading: false });
      localStorage.setItem("user", JSON.stringify(data.user));
      return true ;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false ;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`/auth/register`, { name, email, password }, { withCredentials: true });
      set({loading: false });
      return true ;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false ;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post(`/auth/logout`, {}, { withCredentials: true });
      set({ user: null, loading: false });
      localStorage.removeItem("theme");
      localStorage.removeItem("user");
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },
}));
