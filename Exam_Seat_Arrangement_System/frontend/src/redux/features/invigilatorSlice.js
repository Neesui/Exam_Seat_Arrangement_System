import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedInvigilator: null,
};

const invigilatorSlice = createSlice({
  name: "invigilator",
  initialState,
  reducers: {
    setSelectedInvigilator: (state, action) => {
      state.selectedInvigilator = action.payload;
    },
    clearSelectedInvigilator: (state) => {
      state.selectedInvigilator = null;
    },
  },
});

export const { setSelectedInvigilator, clearSelectedInvigilator } = invigilatorSlice.actions;
export default invigilatorSlice.reducer;
