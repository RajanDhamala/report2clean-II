import { create} from "zustand";

const userStore = create((set) => ({
  currentUser: null,
  SetcurrentUser: (user) => set({ currentUser: user }),
  ClearcurrentUser: () => set({ currentUser: null }),
}));

export default userStore;
