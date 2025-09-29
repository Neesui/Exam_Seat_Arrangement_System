import { apiSlice } from "./apiSlice";

export const invigilatorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
    getInvigilatorProfile: builder.query({
      query: () => "/api/invigilator/profile",
      providesTags: ["INVIGILATOR"],
    }),
    getInvigilatorById: builder.query({
      query: (id) => `/api/invigilator/${id}`,
    }),
    updateInvigilator: builder.mutation({
      query: ({ id, formData }) => ({
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
  useGetInvigilatorProfileQuery,
  useGetInvigilatorByIdQuery,
  useUpdateInvigilatorMutation,
  useDeleteInvigilatorMutation,
} = invigilatorApi;
