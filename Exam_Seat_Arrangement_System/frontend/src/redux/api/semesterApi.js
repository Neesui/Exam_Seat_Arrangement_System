import { apiSlice } from "./apiSlice";

export const semesterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addSemester: builder.mutation({
      query: ({ courseId, semesterNum, subjects }) => ({
        url: `/semester/add/${courseId}`,
        method: "POST",
        body: { semesterNum, subjects },
      }),
    }),

    updateSemester: builder.mutation({
      query: ({ semesterId, semesterNum }) => ({
        url: `/semester/update/${semesterId}`,
        method: "PUT",
        body: { semesterNum },
      }),
    }),

    deleteSemester: builder.mutation({
      query: (semesterId) => ({
        url: `/semester/${semesterId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
} = semesterApi;
