import { apiSlice } from "./apiSlice";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addSubject: builder.mutation({
      query: ({ semesterId, subjectName, code }) => ({
        url: `/subject/add/${semesterId}`,
        method: "POST",
        body: { subjectName, code },
      }),
    }),

    updateSubject: builder.mutation({
      query: ({ subjectId, subjectName, code }) => ({
        url: `/subject/update/${subjectId}`,
        method: "PUT",
        body: { subjectName, code },
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
