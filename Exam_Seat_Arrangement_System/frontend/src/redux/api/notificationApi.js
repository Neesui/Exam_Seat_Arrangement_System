import { apiSlice } from "./apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications for a user
    getUserNotifications: builder.query({
      query: (userId) => `/notification/user/${userId}`,
      providesTags: ["Notifications"],
    }),

    // Get notifications for a student
    getStudentNotifications: builder.query({
      query: (studentId) => `/notification/student/${studentId}`,
      providesTags: ["Notifications"],
    }),

    // Send bulk notifications (admin only)
    sendBulkNotification: builder.mutation({
      query: (body) => ({
        url: `/notification/bulk`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Mark notification as read
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useGetStudentNotificationsQuery,
  useSendBulkNotificationMutation,
  useMarkAsReadMutation,
} = notificationApi;
