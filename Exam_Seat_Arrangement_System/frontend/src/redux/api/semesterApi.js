import { apiSlice } from "./apiSlice";

export const semesterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query({
      query: () => "/api/semester/all", // or your GET semesters API path
    }),

    addSemester: builder.mutation({
      query: ({ courseId, semesterNum, subjects }) => ({
        url: `/api/semester/add-with-subjects`,
        method: "POST",
        body: { courseId, semesterNum, subjects },
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
  useGetSemestersQuery,  // <-- add this here
  useAddSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
} = semesterApi;
