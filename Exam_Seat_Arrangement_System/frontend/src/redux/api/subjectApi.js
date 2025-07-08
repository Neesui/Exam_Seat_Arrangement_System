import { apiSlice } from "./apiSlice";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addSubject: builder.mutation({
        query: ({ semesterId, subjectName, code }) => ({
          url: `/api/subject/add`,
          method: "POST",
          body: { semesterId, subjectName, code },
        }),
      }),

    updateSubject: builder.mutation({
      query: ({ subjectId, subjectName, code, semesterId }) => ({
        url: `/subject/${subjectId}`, // ✅ Matches your backend
        method: "PUT",
        body: { subjectName, code, semesterId },
      }),
    }),

    deleteSubject: builder.mutation({
      query: (subjectId) => ({
        url: `/subject/${subjectId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
