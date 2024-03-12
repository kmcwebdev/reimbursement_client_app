import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type GroupType, type User } from "~/types/reimbursement.types";

interface IUserSession {
  user: User | null;
  assignedRole: GroupType | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export const initialState: IUserSession = {
  user: null,
  assignedRole: null,
  accessToken: null,
  refreshToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setAssignedRole(state, action: PayloadAction<GroupType | null>) {
      state.assignedRole = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },
    clearUserSession(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const {
  setUser,
  setAssignedRole,
  setAccessToken,
  setRefreshToken,
  clearUserSession,
} = userSlice.actions;

export default userSlice.reducer;
