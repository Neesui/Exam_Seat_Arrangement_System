import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedInvigilatorAssign: null,
};

const invigilatorAssignSlice = createSlice({
  name: "invigilatorAssign",
  initialState,
  reducers: {
    setSelectedInvigilatorAssign: (state, action) => {
      state.selectedInvigilatorAssign = action.payload;
    },
    clearSelectedInvigilatorAssign: (state) => {
      state.selectedInvigilatorAssign = null;
    },
  },
});

export const { setSelectedInvigilatorAssign, clearSelectedInvigilatorAssign } = invigilatorAssignSlice.actions;
export default invigilatorAssignSlice.reducer;
