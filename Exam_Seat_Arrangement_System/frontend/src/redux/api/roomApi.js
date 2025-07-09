import { apiSlice } from "./apiSlice"; // Adjust path if needed

export const roomApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addRoom: builder.mutation({
      query: (newData) => ({
        url: "/api/room/add", 
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["ROOM"],
    }),

    getRooms: builder.query({
      query: () => "/api/room/get", 
      providesTags: ["ROOM"],
    }),

    getRoomById: builder.query({
      query: (id) => `/api/room/${id}`,
      providesTags: (result, error, id) => [{ type: "ROOM", id }],
    }),

    updateRoom: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/room/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ROOM"],
    }),

    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/api/room/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ROOM"],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApi;
