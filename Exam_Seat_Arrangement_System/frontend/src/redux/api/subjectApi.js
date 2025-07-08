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
        query: ({ subjectId, subjectName, code }) => ({
          url: `/api/subject/${subjectId}`,
          method: "PUT",
          body: { subjectName, code },
        }),
      }),

    deleteSubject: builder.mutation({
      query: (subjectId) => ({
        url: `/api/subject/${subjectId}`,
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
