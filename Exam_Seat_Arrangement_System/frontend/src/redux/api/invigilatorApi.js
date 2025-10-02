import { apiSlice } from "./apiSlice";

export const invigilatorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Add Invigilator
    addInvigilator: builder.mutation({
      query: (formData) => ({
        url: "/api/invigilator/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),

    getAllInvigilators: builder.query({
      query: () => "/api/invigilator/all",
      providesTags: ["INVIGILATOR"],
    }),

    getInvigilatorAssignments: builder.query({
      query: () => "/api/invigilator/assignments/all",
      providesTags: ["INVIGILATOR"],
    }),

    getInvigilatorProfile: builder.query({
      query: () => "/api/invigilator/profile",
      providesTags: ["INVIGILATOR"],
    }),

    getInvigilatorById: builder.query({
      query: (id) => `/api/invigilator/${id}`,
      providesTags: ["INVIGILATOR"],
    }),

    updateInvigilator: builder.mutation({
      query: ({ formData }) => ({
        url: `/api/invigilator/update-profile`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),

    deleteInvigilator: builder.mutation({
      query: (id) => ({
        url: `/api/invigilator/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),
  }),
});

export const {
  useAddInvigilatorMutation, 
  useGetAllInvigilatorsQuery,
  useGetInvigilatorAssignmentsQuery,
  useGetInvigilatorProfileQuery,
  useGetInvigilatorByIdQuery,
  useUpdateInvigilatorMutation,
  useDeleteInvigilatorMutation,
} = invigilatorApi;
