import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedNotification: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
  },
});

export const { setSelectedNotification, clearSelectedNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
