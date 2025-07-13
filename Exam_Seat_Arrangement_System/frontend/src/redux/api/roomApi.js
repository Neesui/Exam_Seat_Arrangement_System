import { apiSlice } from "./apiSlice";

export const roomApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addRoom: builder.mutation({
      query: (newData) => ({
        url: "/api/rooms/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["ROOM"],
    }),

    getRooms: builder.query({
      query: () => "/api/rooms/get",
      providesTags: ["ROOM"],
    }),

    getRoomById: builder.query({
      query: (id) => `/api/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: "ROOM", id }],
    }),

    updateRoom: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/rooms/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ROOM"],
    }),

    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/api/rooms/${id}`,
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
