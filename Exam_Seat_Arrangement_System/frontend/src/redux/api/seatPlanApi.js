import { apiSlice } from "./apiSlice";

export const seatPlanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateSeatingPlan: builder.mutation({
      query: (examId) => ({
        url: `/api/seating/generate/${examId}`,
        method: "POST",
      }),
      invalidatesTags: ["SEAT_PLAN"],
    }),

    getAllSeatingPlans: builder.query({
      query: () => "/api/seating/all",
      providesTags: ["SEAT_PLAN"],
    }),
  }),
});

export const {
  useGenerateSeatingPlanMutation,
  useGetAllSeatingPlansQuery,
} = seatPlanApi;
