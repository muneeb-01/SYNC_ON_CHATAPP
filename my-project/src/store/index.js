import { create } from "zustand";
import { createAuthSlice } from "./slices/authSlices";
import { createChatSlice } from "./slices/ChatSlice";

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));
