import { apiSlice } from "./apiSlice";

export const invigilatorAssignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvigilatorAssignments: builder.query({
      query: () => "/api/invigilator/assignments/all",
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
  useGetInvigilatorAssignmentsByRoomQuery,
  useGenerateInvigilatorAssignmentsMutation,
  useDeleteInvigilatorAssignMutation,
} = invigilatorAssignApi;
