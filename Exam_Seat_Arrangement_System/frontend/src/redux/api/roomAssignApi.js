import { apiSlice } from "./apiSlice";

export const roomAssignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create
    addRoomAssign: builder.mutation({
      query: (newData) => ({
        url: "/api/room-assignment/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["ROOM_ASSIGN"],
    }),

    // Read - All assignments for an exam
    getRoomAssignByExam: builder.query({
      query: (examId) => `/api/room-assignment/all/${examId}`,
      providesTags: ["ROOM_ASSIGN"],
    }),

    // Update
    updateRoomAssign: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/room-assignment/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ROOM_ASSIGN"],
    }),

    // Delete
    deleteRoomAssign: builder.mutation({
      query: (id) => ({
        url: `/api/room-assignment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ROOM_ASSIGN"],
    }),
  }),
});

export const {
  useAddRoomAssignMutation,
  useGetRoomAssignByExamQuery,
  useUpdateRoomAssignMutation,
  useDeleteRoomAssignMutation,
} = roomAssignApi;
