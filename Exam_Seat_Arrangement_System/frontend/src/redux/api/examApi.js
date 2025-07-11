import { apiSlice } from "./apiSlice"; 

export const examApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Add new exam
    addExam: builder.mutation({
      query: (newExam) => ({
        url: "/api/exams",
        method: "POST",
        body: newExam,
      }),
      invalidatesTags: ["EXAM"],
    }),

    // Get all exams
    getExams: builder.query({
      query: () => "/api/exams",
      providesTags: ["EXAM"],
    }),

    // Get exam by ID
    getExamById: builder.query({
      query: (id) => `/api/exams/${id}`,
      providesTags: (result, error, id) => [{ type: "EXAM", id }],
    }),

    // Update exam
    updateExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/exams/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["EXAM"],
    }),

    // Delete exam
    deleteExam: builder.mutation({
      query: (id) => ({
        url: `/api/exams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EXAM"],
    }),
  }),
});

export const {
  useAddExamMutation,
  useGetExamsQuery,
  useGetExamByIdQuery,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examApi;
