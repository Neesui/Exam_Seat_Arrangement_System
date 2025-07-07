import { apiSlice } from "./apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCourses: builder.mutation({
      query: (newData) => ({
        url: "/api/course/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["COURSE"],
    }),

    getCourses: builder.query({
      query: () => "/api/course/all",
      providesTags: ["COURSE"],
    }),

    getCoursesById: builder.query({
      query: (id) => `/api/course/${id}`,
    }),

    updateCourses: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/course/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["COURSE"],
    }),

    deleteCourses: builder.mutation({
      query: (id) => ({
        url: `/api/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COURSE"],
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
