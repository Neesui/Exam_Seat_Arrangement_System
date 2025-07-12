import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [],
  selectedAssignment: null,
  isLoading: false,
  error: null,
};

const roomAssignSlice = createSlice({
  name: "roomAssign",
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, action) => {
      state.assignments.push(action.payload);
    },
    updateAssignment: (state, action) => {
      const updated = action.payload;
      state.assignments = state.assignments.map((assign) =>
        assign.id === updated.id ? updated : assign
      );
    },
    deleteAssignment: (state, action) => {
      const assignmentId = action.payload;
      state.assignments = state.assignments.filter(
        (assign) => assign.id !== assignmentId
      );
    },
    selectAssignment: (state, action) => {
      state.selectedAssignment = action.payload;
    },
    clearSelectedAssignment: (state) => {
      state.selectedAssignment = null;
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
  setAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  selectAssignment,
  clearSelectedAssignment,
  setLoading,
  setError,
} = roomAssignSlice.actions;

export default roomAssignSlice.reducer;
