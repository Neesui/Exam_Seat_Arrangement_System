import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStudent: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
  },
});

export const { setSelectedStudent, clearSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;
