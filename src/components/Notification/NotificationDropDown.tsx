import  { useEffect, useState, useMemo } from "react";
import IconCircle from "../../assets/icons/Notifications/IconCircle";
import { apiRequest } from "../../utils/apiClient";
import { useNavigate } from "react-router";
import IconRead from "../../assets/icons/Notifications/IconRead";




interface NotificationItem {
  id: number;
  keyword:
  | "user-level" //صفحه احراز هویت
  | "ticket" // صفحه تیکت
  | "tr-internal" // صفحه تاریخچه تراکنش های تومان
  | "cardbank" // صفحه کارت‌های بانکی
  | "trade" // صفحه معاملات
  | "tr-crypto" // صفحه تاریخچه تراکنش های رمزارز
  | "referral" // صفحه AddFriend
  | "tr-referral" // صفحه AddFriend 
  | "message" // نوتیفیکیشن بمونه
  | "deposit-id" // صفحه شناسه واریز
  ;
  message: {
    en: string;
    fa: string;
  };
  seen: "unseen" | "seen";
  time: number;
  formattedTime?: string;
  title: string;
}
export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // فرمت زمان هنگام fetch
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<NotificationItem[]>({ url: "/notifications" });
      const formatted = response.map((n) => ({ ...n, formattedTime: formatTime(n.time) }));
      setNotifications(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNotificationClick = async (item: NotificationItem) => {
    try {
      if (item.seen === "unseen") {
        await apiRequest({
          url: `/api/notifications/seen/${item.id}`,
          method: "PUT",
        });
        setNotifications((prev) => prev.filter((n) => n.id !== item.id));
      }
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (!notifications.length) return [];
    return notifications.filter((item) => {
      if (item.seen !== "unseen") return false;
      if (tab === "news") return item.keyword === "message";
      if (tab === "activities") return item.keyword !== "message";
      return true;
    });
  }, [notifications, tab]);

  return (
    <div className="w-[500px] rounded-2xl shadow-lg bg-white8">
      {/* Header */}
      <div className="flex justify-between bg-gray33 h-14 items-center p-6">
        <div className="text-blue2 flex items-center cursor-pointer">
          <span className="w-6 h-6 icon-wrapper mr-1">
            <IconRead/>
          </span>
          خواندن همه
        </div>
        <p className="text-black1 text-[18px] font-medium">اعلانات</p>
      </div>

      {/* Tabs */}
      <div className="flex text-sm">
        {["all", "news", "activities"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-center text-sm font-normal ${tab === t ? "border-b-2 border-blue2 font-medium text-blue2" : "text-gray-500"}`}
          >
            {t === "all" ? "همه" : t === "news" ? "اعلانات و اخبار" : "فعالیت‌ها"}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="divide-y px-4 py-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-bg h-6 w-full"></div>
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className="py-3 text-right text-sm cursor-pointer"
              onClick={() => handleNotificationClick(item)}
            >
              <div className="flex justify-between">
                <div className="flex items-center justify-start text-gray-400 text-xs mb-1">
                  <span>{item.formattedTime}</span>
                </div>
                <div className="font-medium text-black1 mb-1 flex items-center mr-1 gap-2">
                  {item.title}
                  <span className="w-2 h-2 flex items-center justify-center">
                    <IconCircle />
                  </span>
                </div>
              </div>
              {item.message?.fa && (
                <div className="text-gray17 text-xs leading-relaxed mt-1">
                  {item.message.fa}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4 text-sm">
            اعلانی وجود ندارد
          </div>
        )}
      </div>

      <div
        onClick={() => navigate("/notifications")}
        className="border-t py-3 text-center text-blue2 text-sm font-semibold m-1 cursor-pointer hover:underline"
      >
        مشاهده همه اعلانات
      </div>
    </div>
  );
}

