import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import dayjs from "dayjs";
import { useGetUserNotificationsQuery, useMarkAsReadMutation } from "../../redux/api/notificationApi";
import { socket } from "../../utils/socket";

const Notification = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const { data, isLoading, refetch } = useGetUserNotificationsQuery(userId, {
    skip: !userId,
  });
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = data?.notifications || [];

  useEffect(() => {
    if (!userId) return;

    // Backend listens to `join` → join correct room
    socket.emit("join", `user-${userId}`);
    console.log("Joined room:", `user-${userId}`);

    // Listen for same event emitted from backend controller
    socket.on("invigilatorNotification", (note) => {
      console.log("📩 New notification:", note);
      refetch(); // refresh list when a new one arrives
    });

    return () => {
      socket.off("invigilatorNotification");
    };
  }, [userId, refetch]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="relative">
      {/* Bell icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-700 hover:text-blue-600"
      >
        <FaBell size={22} />
        {notifications.some((n) => !n.isRead) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
          <div className="p-3 border-b">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <p className="p-3 text-gray-500 text-sm text-center italic">
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p className="p-3 text-gray-500 text-sm text-center italic">
                No new notifications
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                    !n.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="text-sm text-gray-800 font-medium">
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-500">
                    {dayjs(n.createdAt).format("MMM D, YYYY h:mm A")}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-2 text-center border-t text-sm text-blue-600 hover:underline cursor-pointer">
            See all notifications
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
