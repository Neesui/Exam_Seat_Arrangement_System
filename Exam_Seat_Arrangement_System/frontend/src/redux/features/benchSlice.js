import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  benches: [],
  selectedBench: null,
  isLoading: false,
  error: null,
};

const benchSlice = createSlice({
  name: "bench",
  initialState,
  reducers: {
    setBenches: (state, action) => {
      state.benches = action.payload;
    },
    addBench: (state, action) => {
      state.benches.push(action.payload);
    },
    updateBench: (state, action) => {
      const updatedBench = action.payload;
      state.benches = state.benches.map((bench) =>
        bench.id === updatedBench.id ? updatedBench : bench
      );
    },
    deleteBench: (state, action) => {
      const benchId = action.payload;
      state.benches = state.benches.filter((bench) => bench.id !== benchId);
    },
    selectBench: (state, action) => {
      state.selectedBench = action.payload;
    },
    clearSelectedBench: (state) => {
      state.selectedBench = null;
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
  setBenches,
  addBench,
  updateBench,
  deleteBench,
  selectBench,
  clearSelectedBench,
  setLoading,
  setError,
} = benchSlice.actions;

export default benchSlice.reducer;
