import React, { useEffect, useState } from "react";
import { useSendBulkNotificationMutation } from "../../redux/api/notificationApi";
import { socket } from "../../utils/socket";
import { toast } from "react-toastify";

const SendNotification = () => {
  const [target, setTarget] = useState("students");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]); 

  const [sendBulkNotification, { isLoading }] = useSendBulkNotificationMutation();

  useEffect(() => {
    socket.on("notificationStatus", (data) => {
      setLogs((prev) => [...prev, data]);
    });

    return () => {
      socket.off("notificationStatus");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !message) {
      toast.error("Please fill in both Title and Message!");
      return;
    }

    try {
      const res = await sendBulkNotification({ target, title, message }).unwrap();
      toast.success("Notifications sent successfully!");
      setTitle("");
      setMessage("");
      setLogs((prev) => [
        ...prev,
        `Sent to ${res.count.students} students and ${res.count.invigilators} invigilators.`,
      ]);
    } catch (err) {
      console.error("Error sending notification:", err);
      toast.error("Failed to send notifications.");
    }
  };

  return (
    <div className="mx-auto  max-w-[97%] bg-white p-6 rounded-lg shadow-md mt-3">
      <h2 className="text-2xl font-bold text-gray-800 text-center underline mb-6">
        Send Bulk Notification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Target selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Target</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="students">Students</option>
            <option value="invigilators">Invigilators</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Message</label>
          <textarea
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>

      {/* Optional Log Display */}
      {logs.length > 0 && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Notification Logs
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            {logs.map((log, idx) => (
              <li key={idx}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SendNotification;
