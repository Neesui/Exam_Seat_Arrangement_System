import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seatPlans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,
};

const seatPlanSlice = createSlice({
  name: "seatPlan",
  initialState,
  reducers: {
    setSeatPlans: (state, action) => {
      state.seatPlans = action.payload;
    },
    addSeatPlan: (state, action) => {
      state.seatPlans.push(action.payload);
    },
    selectSeatPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
    setSeatPlanLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSeatPlanError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSeatPlans,
  addSeatPlan,
  selectSeatPlan,
  clearSelectedPlan,
  setSeatPlanLoading,
  setSeatPlanError,
} = seatPlanSlice.actions;

export default seatPlanSlice.reducer;
