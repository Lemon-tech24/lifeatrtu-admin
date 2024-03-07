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

// ----------------- EXPORT DATA
export const isOpenExportData = create<isOpen>((set) => ({
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },
}));

// ----------------- UPDATES

export const isOpenUpdates = create<isOpen>((set) => ({
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },
}));

// ----------------- OPEN IMAGE
interface isOpenImage {
  src: string;
  value: boolean;
  close: () => void;
  open: () => void;
  source: (data: any) => void;
  clearSource: () => void;
}

export const isOpenImage = create<isOpenImage>((set) => ({
  src: "",
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },

  source: (data: any) => {
    set(() => ({ src: data }));
  },

  clearSource: () => {
    set(() => ({ src: "" }));
  },
}));
