import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AppClaims } from "~/types/permission-types";

interface User {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  pictureUrl?: string;
  username?: string;
  assignedRole?: string;
  mfaEnabled: boolean;
  legacyUserId?: string;
  lastActiveAt: number;
  createdAt: number;
  permissions?: AppClaims[];
}

interface Session {
  user: User | null;
  accessToken: string | null;
}

const initialState: Session = {
  user: null,
  accessToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearAccessToken(state) {
      state.accessToken = null;
    },
  },
});

export const { setUser, clearUser, setAccessToken, clearAccessToken } =
  userSlice.actions;

export default userSlice.reducer;
