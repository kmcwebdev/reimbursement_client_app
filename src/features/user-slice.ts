import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  user_id: string
  accessToken: string
}

const initialState: User = {
  user_id: "",
  accessToken: ""
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
    clearAccessToken(state) {
      state.accessToken = ""
    }
  }
})

export const { setAccessToken, clearAccessToken } = userSlice.actions

export default userSlice.reducer