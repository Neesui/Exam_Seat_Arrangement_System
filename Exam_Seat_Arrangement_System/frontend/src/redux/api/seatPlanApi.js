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

    getActiveSeatingPlan: builder.query({
      query: () => "/api/seating/active",
      providesTags: ["SEAT_PLAN"],
    }),

    getStudentActiveSeating: builder.query({
      query: ({ symbolNumber, college }) => {
        if (!symbolNumber || !college) return "";
        return `/api/seating/student/active?symbolNumber=${encodeURIComponent(
          symbolNumber
        )}&college=${encodeURIComponent(college)}`;
      },
      providesTags: ["SEAT_PLAN"],
    }),    
  }),
});

export const {
  useGenerateSeatingPlanMutation,
  useGetAllSeatingPlansQuery,
  useGetActiveSeatingPlanQuery,
  useGetStudentActiveSeatingQuery,
} = seatPlanApi;
