import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IGroupType } from "~/types/group.type";
import { type AppClaims } from "~/types/permission-types";

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_staff: boolean;
  groups: IGroupType[];
  profile: IUserProfile;
  permissions: AppClaims[];
}

interface IUserProfile {
  employee_id: string;
  organization: string;
  hrbp: string[];
  manager: string[];
}

interface IUserSession {
  user: IUser | null;
  assignedRole: IGroupType | null;
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
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload;
    },
    setAssignedRole(state, action: PayloadAction<IGroupType | null>) {
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
