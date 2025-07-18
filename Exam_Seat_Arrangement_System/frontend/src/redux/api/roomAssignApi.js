import { apiSlice } from "./apiSlice";

export const roomAssignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //  Generate room assignments (via Python algorithm)
    addRoomAssign: builder.mutation({
      query: () => ({
        url: "/api/room-assignments/generate",
        method: "POST",
      }),
      invalidatesTags: [{ type: "ROOM_ASSIGN", id: "LIST" }],
    }),

    //  Get ALL room assignments (not filtered by exam)
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

    //  Get assignments filtered by examId
    getRoomAssignByExam: builder.query({
      query: (examId) => `/api/room-assignments/all/${examId}`,
      providesTags: (result, error, examId) =>
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

    // Update room assignment
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

    // Delete room assignment
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
  useAddRoomAssignMutation,
  useGetAllRoomAssignmentsQuery,
  useGetRoomAssignByExamQuery,
  useUpdateRoomAssignMutation,
  useDeleteRoomAssignMutation,
} = roomAssignApi;
