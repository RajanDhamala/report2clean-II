import { create } from "zustand";

const pageStore=create((set)=>({
    currentPage: "home",
    setCurrentPage: (page) => set({ currentPage: page }),
    clearCurrentPage: () => set({ currentPage: "home" }),
}))

export default pageStore;