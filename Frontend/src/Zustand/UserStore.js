
// UserStore.js
import { create } from "zustand";
import Cookies from "js-cookie";

const rawCookie = Cookies.get("currentUser");
let initialUser = null;

if (rawCookie) {
  try {
    initialUser = JSON.parse(rawCookie);
    console.log("Parsed user from cookie:", initialUser);
  } catch (err) {
    console.error("Failed to parse cookie:", err);
  }
}

const userStore = create((set) => ({
  currentUser: initialUser,
  SetcurrentUser: (user) => set({ currentUser: user }),
  ClearcurrentUser: () => set({ currentUser: null }),
}));

export default userStore;


