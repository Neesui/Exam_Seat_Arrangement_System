import { apiSlice } from "./apiSlice";

export const benchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addBench: builder.mutation({
      query: (newData) => ({
        url: "/api/bench/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["BENCH", "ROOM"], // ✅ also invalidate ROOM
    }),

    getBenches: builder.query({
      query: () => "/api/bench/get",
      providesTags: ["BENCH"],
    }),

    getBenchById: builder.query({
      query: (id) => `/api/bench/${id}`,
      providesTags: (result, error, id) => [{ type: "BENCH", id }],
    }),

    getBenchesByRoom: builder.query({
      query: (roomId) => `/api/bench/get-by-room/${roomId}`,
      providesTags: ["BENCH"],
    }),

    updateBench: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/bench/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BENCH", "ROOM"], // ✅ also invalidate ROOM
    }),

    deleteBench: builder.mutation({
      query: (id) => ({
        url: `/api/bench/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BENCH", "ROOM"], // ✅ also invalidate ROOM
    }),
  }),
});

export const {
  useGetBenchesQuery,
  useGetBenchByIdQuery,
  useGetBenchesByRoomQuery,
  useAddBenchMutation,
  useUpdateBenchMutation,
  useDeleteBenchMutation,
} = benchApi;
