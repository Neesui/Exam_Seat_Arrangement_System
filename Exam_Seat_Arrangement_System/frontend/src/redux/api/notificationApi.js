import { apiSlice } from "./apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications for invigilator (based on JWT)
    getInvigilatorNotifications: builder.query({
      query: () => `/api/notification/invigilator/notifications`,
      providesTags: ["Notifications"],
    }),

    // Get notifications for student (based on JWT)
    getStudentNotifications: builder.query({
      query: () => `/api/notification/student/notifications`,
      providesTags: ["Notifications"],
    }),

    // Send bulk notifications (admin only)
    sendBulkNotification: builder.mutation({
      query: (body) => ({
        url: `/api/notification/bulk`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Mark notification as read
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/notification/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetInvigilatorNotificationsQuery,
  useGetStudentNotificationsQuery,
  useSendBulkNotificationMutation,
  useMarkAsReadMutation,
} = notificationApi;
