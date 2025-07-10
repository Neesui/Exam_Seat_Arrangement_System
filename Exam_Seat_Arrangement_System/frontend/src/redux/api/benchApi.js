import { apiSlice } from "./apiSlice"; 

export const benchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addBench: builder.mutation({
      query: (newData) => ({
        url: "/api/bench/add",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["BENCH"],
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
        query: (roomId) => `/api/benches/get-by-room/${roomId}`,
        providesTags: ["BENCH"],
      }),

    updateBench: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/bench/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BENCH"],
    }),

    deleteBench: builder.mutation({
      query: (id) => ({
        url: `/api/bench/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BENCH"],
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
