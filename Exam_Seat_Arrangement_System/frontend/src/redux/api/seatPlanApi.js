import { apiSlice } from "./apiSlice";

export const seatPlanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateSeatPlan: builder.mutation({
      query: (examId) => ({
        url: `/api/seats/generate/${examId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "SEAT_PLAN", id: "LIST" }],
    }),

    getAllSeatPlans: builder.query({
      query: () => `/api/seats/all`,
      providesTags: (result) =>
        result?.data
          ? [
              { type: "SEAT_PLAN", id: "LIST" },
              ...result.data.map(({ id }) => ({ type: "SEAT_PLAN", id })),
            ]
          : [{ type: "SEAT_PLAN", id: "LIST" }],
    }),

    getSeatPlanByExam: builder.query({
      query: (examId) => `/api/seats/exam/${examId}`,
      providesTags: (result, error, examId) => [{ type: "SEAT_PLAN", id: examId }],
    }),
  }),
});

export const {
  useGenerateSeatPlanMutation,
  useGetAllSeatPlansQuery,
  useGetSeatPlanByExamQuery,
} = seatPlanApi;
