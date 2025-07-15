import { apiSlice } from "./apiSlice";

export const roomAssignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new room assignment
    addRoomAssign: builder.mutation({
      query: (newData) => ({
        url: "/api/room-assignments/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ROOM_ASSIGN", id: "LIST" }, // Invalidate list cache to refetch
        ...(result ? [{ type: "ROOM_ASSIGN", id: result.id }] : []), // Invalidate specific if needed
      ],
    }),

    // Get all room assignments for a given exam
    getRoomAssignByExam: builder.query({
      query: (examId) => `/api/room-assignments/all/${examId}`,
      providesTags: (result, error, examId) =>
        result
          ? [
              { type: "ROOM_ASSIGN", id: "LIST" },
              ...result.assignments.map(({ id }) => ({ type: "ROOM_ASSIGN", id })),
            ]
          : [{ type: "ROOM_ASSIGN", id: "LIST" }],
    }),

    // Update a room assignment by id
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

    // Delete a room assignment by id
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
  useGetRoomAssignByExamQuery,
  useUpdateRoomAssignMutation,
  useDeleteRoomAssignMutation,
} = roomAssignApi;
