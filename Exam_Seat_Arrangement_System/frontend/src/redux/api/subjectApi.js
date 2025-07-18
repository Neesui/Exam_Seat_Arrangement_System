import { apiSlice } from "./apiSlice";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    addSubject: builder.mutation({
      query: ({ semesterId, subjectName, code }) => ({
        url: `/api/subject/add`,
        method: "POST",
        body: { semesterId, subjectName, code },
      }),
      invalidatesTags: ["SUBJECT"],
    }),

   
    updateSubject: builder.mutation({
      query: ({ subjectId, subjectName, code }) => ({
        url: `/api/subject/${subjectId}`,
        method: "PUT",
        body: { subjectName, code },
      }),
      invalidatesTags: ["SUBJECT"],
    }),


    deleteSubject: builder.mutation({
      query: (subjectId) => ({
        url: `/api/subject/${subjectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUBJECT"],
    }),


    getSubjects: builder.query({
      query: () => `/api/subject/all`, 
      providesTags: ["SUBJECT"],
    }),

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
