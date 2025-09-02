
import { Bell, CheckCheck, X, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function NotificationPanel() {
  const queryClient = useQueryClient();

  // Fetch notifications
const { data: notificationshai = { notifications: [] }, isLoading, isError } = useQuery({
  queryKey: ["notification"],
  queryFn: async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/notifications`, {
      withCredentials: true,
    });
    return { notifications: res.data.data || [] }; // <-- wrap array into object
  },
  staleTime: 1000 * 60 * 5,
  retry:false
});

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count
  const calculateUnreadMsg = () => {
    if (notificationshai?.notifications) {
      const count = notificationshai.notifications.filter(n => !n.isReaded).length;
      setUnreadCount(count);
    }
  };

  useEffect(() => {
    calculateUnreadMsg();
  }, [notificationshai]);

  // Mark a notification as read
  const { mutate } = useMutation({
    mutationKey: ["mark-notification-as-read"],
    mutationFn: async ({ mainId, subId }) => {
      return axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/notifications`,
        { mainId, subId },
        { withCredentials: true }
      );
    },
    onMutate: async ({ subId }) => {
      await queryClient.cancelQueries({ queryKey: ["notification"] });
      const previousData = queryClient.getQueryData(["notification"]);

      queryClient.setQueryData(["notification"], oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          notifications: oldData.notifications.map(item =>
            item._id === subId ? { ...item, isReaded: true } : item
          ),
        };
      });

      return { previousData };
    },
    onError: (err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications"], context.previousData);
      }
    },
  });

const ReadAll = async () => {
  console.log("reading all messages");


  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/user/read-all`,
      { withCredentials: true }
    );
    console.log("response:", res.data);

    // Update cache instantly
    queryClient.setQueryData(["notification"], oldData => {
      if (!oldData) return { notifications: [] };

      return {
        ...oldData,
        notifications: oldData.notifications.map(noti => ({
          ...noti,
          isReaded: true,
        })),
      };
    });
  } catch (err) {
    console.error("ReadAll error:", err);
  }
};

  // Helpers
  const getTypeIcon = type => {
    switch (type) {
      case "success": return "🎉";
      case "event": return "🗓️";
      case "social": return "👋";
      case "reward": return "🏆";
      default: return "📢";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="Open notifications"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1 shadow-lg">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="bg-black bg-opacity-20 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-gray-200 
             rounded-xl shadow-xl z-50 overflow-hidden 
             max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={ReadAll}
                    className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
              ) : notificationshai.notifications.length === 0 ? (
                <div className="text-center py-10">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  {notificationshai.notifications.slice().map(notification => (
                    <button
                      key={notification._id}
                      onClick={() => {
                        if (notification.isReaded) return;
                        mutate({ mainId: notification._id, subId: notification._id });
                      }}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors rounded-md ${
                        !notification.isReaded
                          ? "bg-blue-50 ring-1 ring-blue-400 font-semibold"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5 text-xl">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${notification.isReaded ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${!notification.isReaded ? "text-blue-700" : "text-gray-400"}`}>
                              {new Date(notification.time).toLocaleString()}
                            </span>
                            {!notification.isReaded && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
              <button className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

