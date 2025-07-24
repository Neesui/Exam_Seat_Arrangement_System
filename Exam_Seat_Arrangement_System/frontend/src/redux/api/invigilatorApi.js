import { apiSlice } from "./apiSlice";

export const invigilatorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addInvigilator: builder.mutation({
      query: (newData) => ({
        url: "/api/invigilator/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),
    getAllInvigilators: builder.query({
        query: () => "/api/invigilator/all",
        providesTags: ["INVIGILATOR"],
      }),

    getInvigilators: builder.query({
      query: () => "/api/invigilator/profile",
      providesTags: ["INVIGILATOR"],
    }),

    getInvigilatorById: builder.query({
      query: (id) => `/api/invigilator/${id}`,
    }),

    updateInvigilator: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/invigilator/${id}`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),
    

    deleteInvigilator: builder.mutation({
      query: (id) => ({
        url: `/api/invigilator/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),
  }),
});

export const {
  useGetInvigilatorsQuery,
  useGetAllInvigilatorsQuery,
  useGetInvigilatorByIdQuery,
  useAddInvigilatorMutation,
  useUpdateInvigilatorMutation,
  useDeleteInvigilatorMutation,
} = invigilatorApi;
