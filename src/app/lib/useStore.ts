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

interface isOpenUpdate {
  postId: string;
  value: boolean;
  close: () => void;
  open: () => void;
  setPostId: (data: any) => void;
}

export const isOpenUpdates = create<isOpenUpdate>((set) => ({
  postId: "",
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },

  setPostId: (data: any) => {
    set(() => ({ postId: data }));
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

// -------------- OPEN Report

interface isOpenReport {
  data: any;
  value: boolean;
  close: () => void;
  open: () => void;
  setData: (data: any) => void;
  clearData: () => void;
}

export const isOpenReport = create<isOpenReport>((set) => ({
  data: null,
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },

  setData: (data) => {
    set(() => ({ data: data }));
  },

  clearData: () => {
    set(() => ({ data: null }));
  },
}));
