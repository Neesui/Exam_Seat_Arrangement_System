import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: [],
  selectedSubject: null,
  isLoading: false,
  error: null,
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    addSubject: (state, action) => {
      state.subjects.push(action.payload);
    },
    updateSubject: (state, action) => {
      const updatedSubject = action.payload;
      state.subjects = state.subjects.map((subject) =>
        subject.id === updatedSubject.id ? updatedSubject : subject
      );
    },
    deleteSubject: (state, action) => {
      const subjectId = action.payload;
      state.subjects = state.subjects.filter((subject) => subject.id !== subjectId);
    },
    selectSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
    clearSelectedSubject: (state) => {
      state.selectedSubject = null;
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
  setSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  selectSubject,
  clearSelectedSubject,
  setLoading,
  setError,
} = subjectSlice.actions;

export default subjectSlice.reducer;