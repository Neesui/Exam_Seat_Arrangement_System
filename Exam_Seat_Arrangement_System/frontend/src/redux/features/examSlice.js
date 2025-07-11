import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exams: [],
  selectedExam: null,
  isLoading: false,
  error: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExams: (state, action) => {
      state.exams = action.payload;
    },
    addExam: (state, action) => {
      state.exams.push(action.payload);
    },
    updateExam: (state, action) => {
      const updatedExam = action.payload;
      state.exams = state.exams.map((exam) =>
        exam.id === updatedExam.id ? updatedExam : exam
      );
    },
    deleteExam: (state, action) => {
      const examId = action.payload;
      state.exams = state.exams.filter((exam) => exam.id !== examId);
    },
    selectExam: (state, action) => {
      state.selectedExam = action.payload;
    },
    clearSelectedExam: (state) => {
      state.selectedExam = null;
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
  setExams,
  addExam,
  updateExam,
  deleteExam,
  selectExam,
  clearSelectedExam,
  setLoading,
  setError,
} = examSlice.actions;

export default examSlice.reducer;
