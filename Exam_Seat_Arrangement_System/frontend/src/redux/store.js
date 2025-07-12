import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

import authReducer from "./features/authReduer";
import invigilatorReducer from "./features/invigilatorSlice";
import courseReducer from "./features/courseSlice";
import roomReducer from "./features/roomSlice";
import benchReducer from "./features/benchSlice";
import roomAssignReducer from "./features/roomAssignSlice"; // ✅ Import roomAssignSlice

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    invigilator: invigilatorReducer,
    course: courseReducer,
    room: roomReducer,
    bench: benchReducer,
    roomAssign: roomAssignReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), 
  devTools: true,
});

export default store;
