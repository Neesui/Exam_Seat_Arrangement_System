import { apiSlice } from "./apiSlice";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addStudent: builder.mutation({
      query: (newData) => ({
        url: "/api/student/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["STUDENT"],
    }),
    getAllStudents: builder.query({
      query: () => "/api/student/all",
      providesTags: ["STUDENT"],
    }),
    getStudentsByCollege: builder.query({
      query: (collegeName) => `/api/student/college/${collegeName}`,
      providesTags: ["STUDENT"],
    }),    
    getStudentById: builder.query({
      query: (id) => `/api/student/${id}`,
      providesTags: ["STUDENT"],
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/student/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["STUDENT"],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/api/student/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["STUDENT"],
    }),
    importStudents: builder.mutation({
      query: (studentsArray) => ({
        url: "/api/student/import",
        method: "POST",
        body: studentsArray,
      }),
      invalidatesTags: ["STUDENT"],
    }),
  }),
});

export const {
  useAddStudentMutation,
  useGetAllStudentsQuery,
  useGetStudentsByCollegeQuery,
  useGetStudentByIdQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useImportStudentsMutation,
} = studentApi;
