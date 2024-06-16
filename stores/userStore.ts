import { User } from "@/schemas/userSchema";
import { create } from "zustand";

type State = {
  user: User | null;
};

type Actions = {
  setUser: (user: User) => void;
  removeUser: () => void;
};

export const useUserStore = create<State & Actions>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
}));
