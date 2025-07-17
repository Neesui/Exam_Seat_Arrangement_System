import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSeatPlan: null,
};

const seatPlanSlice = createSlice({
  name: "seatPlan",
  initialState,
  reducers: {
    setSelectedSeatPlan: (state, action) => {
      state.selectedSeatPlan = action.payload;
    },
    clearSelectedSeatPlan: (state) => {
      state.selectedSeatPlan = null;
    },
  },
});

export const { setSelectedSeatPlan, clearSelectedSeatPlan } = seatPlanSlice.actions;
export default seatPlanSlice.reducer;
