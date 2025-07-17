import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../../constant";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AUTH", "USER", "INVIGILATOR", "COURSE", "SUBJECT","SEAT_PLAN"],
  endpoints: () => ({}),
});
