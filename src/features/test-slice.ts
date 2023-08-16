import { createSlice } from "@reduxjs/toolkit";

interface TestState {
  id: number
}

const initialState: TestState = {
  id: 0
}

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {}
})

export const {} = testSlice.actions

export default testSlice.reducer