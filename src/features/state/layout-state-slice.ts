import { createSlice } from "@reduxjs/toolkit";

interface LayoutState {
  sideBarCollapsed: boolean;
}

const initialState: LayoutState = {
  sideBarCollapsed: false,
};

const layoutStateSlice = createSlice({
  name: "layoutStateSlice",
  initialState,
  reducers: {
    toggleSidebarCollapse(state) {
      state.sideBarCollapsed = !state.sideBarCollapsed;
    },
  },
});

export const { toggleSidebarCollapse } = layoutStateSlice.actions;

export default layoutStateSlice.reducer;
