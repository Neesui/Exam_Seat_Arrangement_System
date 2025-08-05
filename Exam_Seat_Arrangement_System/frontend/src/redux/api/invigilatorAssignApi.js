import { apiSlice } from "./apiSlice";

export const invigilatorAssignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvigilatorAssignments: builder.query({
      query: () => "/api/invigilator/assignments/all",
      providesTags: ["INV_ASSIGN"],
    }),
    getCurrentAssignedInvigilators: builder.query({
      query: () => "/api/invigilator/assignments/current",
      providesTags: ["INV_ASSIGN"],
    }),
    getInvigilatorAssignmentsByRoom: builder.query({
      query: (roomAssignmentId) => `/api/invigilator/assignments/${roomAssignmentId}`,
      providesTags: ["INV_ASSIGN"],
    }),
    generateInvigilatorAssignments: builder.mutation({
      query: () => ({
        url: "/api/invigilator/generate",
        method: "POST",
      }),
      invalidatesTags: ["INV_ASSIGN"],
    }),
    updateInvigilatorAssign: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/invigilator/assignments/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["INV_ASSIGN"],
    }),
    
    deleteInvigilatorAssign: builder.mutation({
      query: (id) => ({
        url: `/api/invigilator/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["INV_ASSIGN"],
    }),
  }),
});

export const {
  useGetAllInvigilatorAssignmentsQuery,
  useUpdateInvigilatorAssignMutation,
  useGetInvigilatorAssignmentsByRoomQuery,
  useGenerateInvigilatorAssignmentsMutation,
  useDeleteInvigilatorAssignMutation,
  useGetCurrentAssignedInvigilatorsQuery,
} = invigilatorAssignApi;
