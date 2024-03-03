import { create } from "zustand";

interface isOpen {
  value: boolean;
  close: () => void;
  open: () => void;
}

// ------------------SETTINGS

export const isOpenSettings = create<isOpen>((set) => ({
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },
}));

// -----------------MODERATORS

export const isOpenModerators = create<isOpen>((set) => ({
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },
}));

// -----------------ADD MODERATORS

export const isOpenAddModerators = create<isOpen>((set) => ({
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },
}));
