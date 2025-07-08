
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  semesters: [],
  selectedSemester: null,
  isLoading: false,
  error: null,
};

const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {
    setSemesters: (state, action) => {
      state.semesters = action.payload;
    },
    addSemester: (state, action) => {
      state.semesters.push(action.payload);
    },
    updateSemester: (state, action) => {
      const updatedSemester = action.payload;
      state.semesters = state.semesters.map((semester) =>
        semester.id === updatedSemester.id ? updatedSemester : semester
      );
    },
    deleteSemester: (state, action) => {
      const semesterId = action.payload;
      state.semesters = state.semesters.filter((semester) => semester.id !== semesterId);
    },
    selectSemester: (state, action) => {
      state.selectedSemester = action.payload;
    },
    clearSelectedSemester: (state) => {
      state.selectedSemester = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSemesters,
  addSemester,
  updateSemester,
  deleteSemester,
  selectSemester,
  clearSelectedSemester,
  setLoading,
  setError,
} = semesterSlice.actions;

export default semesterSlice.reducer;