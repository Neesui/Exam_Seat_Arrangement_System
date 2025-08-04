import { apiSlice } from "./apiSlice";

export const roomAssignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateRoomAssignments: builder.mutation({
      query: (body) => ({
        url: "/api/room-assignments/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ROOM_ASSIGN", id: "LIST" }],
    }),

    getAllRoomAssignments: builder.query({
      query: () => `/api/room-assignments/all`,
      providesTags: (result) =>
        result?.assignments
          ? [
              { type: "ROOM_ASSIGN", id: "LIST" },
              ...result.assignments.map(({ id }) => ({
                type: "ROOM_ASSIGN",
                id,
              })),
            ]
          : [{ type: "ROOM_ASSIGN", id: "LIST" }],
    }),

    getRoomAssignByExam: builder.query({
      query: (examId) => `/api/room-assignments/all/${examId}`,
      providesTags: (result) =>
        result?.assignments
          ? [
              { type: "ROOM_ASSIGN", id: "LIST" },
              ...result.assignments.map(({ id }) => ({
                type: "ROOM_ASSIGN",
                id,
              })),
            ]
          : [{ type: "ROOM_ASSIGN", id: "LIST" }],
    }),

    updateRoomAssign: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/room-assignments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ROOM_ASSIGN", id },
        { type: "ROOM_ASSIGN", id: "LIST" },
      ],
    }),

    deleteRoomAssign: builder.mutation({
      query: (id) => ({
        url: `/api/room-assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ROOM_ASSIGN", id },
        { type: "ROOM_ASSIGN", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGenerateRoomAssignmentsMutation,
  useGetAllRoomAssignmentsQuery,
  useGetRoomAssignByExamQuery,
  useUpdateRoomAssignMutation,
  useDeleteRoomAssignMutation,
} = roomAssignApi;
