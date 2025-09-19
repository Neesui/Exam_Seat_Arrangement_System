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
      // Note: route is /room/:roomAssignmentId, not /assignments/:roomAssignmentId
      query: (roomAssignmentId) => `/api/invigilator/room/${roomAssignmentId}`,
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
    // Be sure you have a DELETE route in backend if you want to use this
    deleteInvigilatorAssign: builder.mutation({
      query: (id) => ({
        url: `/api/invigilator/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["INV_ASSIGN"],
    }),
  }),
});

export const {
  useGetAllInvigilatorAssignmentsQuery,
  useGetCurrentAssignedInvigilatorsQuery,
  useGetInvigilatorAssignmentsByRoomQuery,
  useGenerateInvigilatorAssignmentsMutation,
  useUpdateInvigilatorAssignMutation,
  useDeleteInvigilatorAssignMutation,
} = invigilatorAssignApi;
