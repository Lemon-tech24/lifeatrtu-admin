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

//------------------ Approve Delete

interface ApproveDelete {
  postId: string;
  setPostId: (data: any) => void;
}

export const isApproveDelete = create<ApproveDelete>((set) => ({
  postId: "",

  setPostId: (data: any) => {
    set(() => ({ postId: data }));
  },
}));

//---------------- Mark as Done / Delete

interface MarkAsDone {
  postId: string;
  setPostId: (data: any) => void;
}
export const isMarkAsDone = create<MarkAsDone>((set) => ({
  postId: "",
  setPostId: (data: any) => {
    set(() => ({ postId: data }));
  },
}));

//------------------ Disregard

export const DisregardReport = create<MarkAsDone>((set) => ({
  postId: "",
  setPostId: (data: any) => {
    set(() => ({ postId: data }));
  },
}));

//-------------- Ban Account

interface BanAccount {
  userId: string;
  value: boolean;
  email: string;
  close: () => void;
  open: () => void;
  setUserId: (data: any) => void;
  setEmail: (data: any) => void;
}

export const isOpenBanAccount = create<BanAccount>((set) => ({
  userId: "",
  value: false,
  email: "",
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },

  setUserId: (data) => {
    set(() => ({ userId: data }));
  },
  setEmail: (data: any) => {
    set(() => ({ email: data }));
  },
}));

//-------------- Ban users
export const isOpenBanUsers = create<isOpen>((set) => ({
  value: false,
  close: () => {
    set(() => ({ value: false }));
  },

  open: () => {
    set(() => ({ value: true }));
  },
}));

//-------------------------- Selection

interface MultipleSelect {
  list: String[];
  isOpen: Boolean;
  setList: (data: any) => void;
  setOpen: () => void;
  setClose: () => void;
}
export const useMultipleSelect = create<MultipleSelect>((set, get) => ({
  list: [],
  isOpen: false,
  setList: (data: any) => {
    const dataList = Array.isArray(data) ? data : [];
    set(() => ({ list: dataList }));
  },
  setOpen: () => {
    set(() => ({ isOpen: true }));
  },

  setClose: () => {
    get().setList([]);
    set(() => ({ isOpen: false }));
  },
}));
