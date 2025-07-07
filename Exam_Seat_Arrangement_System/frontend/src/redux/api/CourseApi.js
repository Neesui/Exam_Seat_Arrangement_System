import { apiSlice } from "./apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCourses: builder.mutation({
      query: (newData) => ({
        url: "/api/course/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),

    getCourses: builder.query({
      query: () => "/api/invigilator/profile",
      providesTags: ["INVIGILATOR"],
    }),

    getCoursesById: builder.query({
      query: (id) => `/api/invigilator/${id}`,
    }),

    updateCourses: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/invigilator/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),

    deleteCourses: builder.mutation({
      query: (id) => ({
        url: `/api/invigilator/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCoursesByIdQuery,
  useAddCoursesMutation,
  useUpdateCoursesMutation,
  useDeleteCoursesMutation,
} = courseApi;
