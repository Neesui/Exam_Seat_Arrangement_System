import { apiSlice } from "./apiSlice";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Add subject
    addSubject: builder.mutation({
      query: ({ semesterId, subjectName, code }) => ({
        url: `/api/subject/add`,
        method: "POST",
        body: { semesterId, subjectName, code },
      }),
      invalidatesTags: ["SUBJECT"],
    }),

    // ✅ Update subject
    updateSubject: builder.mutation({
      query: ({ subjectId, subjectName, code }) => ({
        url: `/api/subject/${subjectId}`,
        method: "PUT",
        body: { subjectName, code },
      }),
      invalidatesTags: ["SUBJECT"],
    }),

    // ✅ Delete subject
    deleteSubject: builder.mutation({
      query: (subjectId) => ({
        url: `/api/subject/${subjectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUBJECT"],
    }),

    // ✅ Get all subjects
    getSubjects: builder.query({
      query: () => `/api/subject/all`, 
      providesTags: ["SUBJECT"],
    }),

    // ✅ Get subject by ID
    getSubjectById: builder.query({
      query: (id) => `/api/subject/${id}`,
      providesTags: (result, error, id) => [{ type: "SUBJECT", id }],
    }),
  }),
});

export const {
  useAddSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
} = subjectApi;
