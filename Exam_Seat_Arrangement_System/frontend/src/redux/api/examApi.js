import { apiSlice } from "./apiSlice"; 

export const examApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    addExam: builder.mutation({
      query: (newExam) => ({
        url: "/api/exam/add",
        method: "POST",
        body: newExam,
      }),
      invalidatesTags: ["EXAM"],
    }),


    getExams: builder.query({
      query: () => "/api/exam/all",
      providesTags: ["EXAM"],
    }),


    getExamById: builder.query({
      query: (id) => `/api/exam/${id}`,
      providesTags: (result, error, id) => [{ type: "EXAM", id }],
    }),


    updateExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/exam/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["EXAM"],
    }),


    deleteExam: builder.mutation({
      query: (id) => ({
        url: `/api/exam/${id}`,
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
