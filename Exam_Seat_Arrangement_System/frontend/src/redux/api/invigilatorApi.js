import { apiSlice } from "./apiSlice";

export const invigilatorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Add new invigilator
    addInvigilator: builder.mutation({
      query: (newData) => ({
        url: "/api/invigilator/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),

    // GET: Fetch all invigilators
    getInvigilators: builder.query({
        query: () => "/api/invigilator/profile",
        providesTags: ["INVIGILATOR"],
      }),
  
      // GET: Fetch one invigilator by ID
      getInvigilatorById: builder.query({
        query: (id) => `/api/invigilators/${id}`,
      }),

    // PUT: Update invigilator by ID
    updateInvigilator: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/invigilators/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),

    // DELETE: Remove invigilator by ID
    deleteInvigilator: builder.mutation({
      query: (id) => ({
        url: `/api/invigilators/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["INVIGILATOR"],
    }),
  }),
});

export const {
  useGetInvigilatorsQuery,
  useGetInvigilatorByIdQuery,
  useAddInvigilatorMutation,
  useUpdateInvigilatorMutation,
  useDeleteInvigilatorMutation,
} = invigilatorApi;
