import { useEffect, useState, useMemo } from "react";
import IconCircle from "../../assets/icons/Notifications/IconCircle";
import { apiRequest } from "../../utils/apiClient";
import { Link } from "react-router";
import IconRead from "../../assets/icons/Notifications/IconRead";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ROUTES } from "../../routes/routes";
import NotificationDropdownLoading from "./NotificationDropdownLoading";

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
  // make all unseen notifications as seen =============================================================================
  const handleSeeNotifications = async () => {
    try {
      await apiRequest({ url: '/notifications/seen/all', method: "POST" })
      fetchData()
    } catch (err) { toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در ثب همه اعلانات به عنوان خوانده شده مشکلی پیش آمد.') }
  }
  // fetch unseen notifications ========================================================================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<NotificationItem[]>({ url: "/notifications", params: { seen: 'unseen' } });
      const formatted = response.map((n) => ({ ...n, formattedTime: formatTime(n.time) }));
      setNotifications(formatted);
    } catch (error) { toast.error((error as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در دریافت اعلانات مشکلی پیش آمد.') }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
  const handleNotificationClick = async (item: NotificationItem) => {
    try {
      if (item.seen === "unseen") {
        await apiRequest({ url: `/notifications/seen/${item.id}`, method: "PUT", });
        setNotifications((prev) => prev.filter((n) => n.id !== item.id));
      }
    } catch (error) { toast.error((error as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در ثبت اعلان به عنوان "خوانده شده" مشکلی پیش آمد.') }
  };
  const filteredNotifications = useMemo(() => {
    if (!notifications.length) return [];
    return notifications.filter((item) => {
      // if (item.seen !== "unseen") return false;
      if (tab === "news") return item.keyword === "message";
      if (tab === "activities") return item.keyword !== "message";
      return true;
    });
  }, [notifications, tab]);

  return (
    <div className="w-[300px] lg:w-[500px] h-[460px] lg:h-[420px] rounded-2xl shadow-lg bg-white8 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between bg-gray33 h-14 items-center p-6">
        <div onClick={handleSeeNotifications} className="text-blue2 flex items-center cursor-pointer text-xs lg:text-sm font-normal">
          <span className="w-6 h-6 icon-wrapper mr-1"><IconRead /></span>خواندن همه
        </div>
        <h4 className="text-black1 text-lg font-medium">اعلانات</h4>
      </div>
      {/* Tabs */}
      <div className="flex text-sm py-3" dir="rtl">
        {["all", "news", "activities"].map((t) =>
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm ${tab === t ? "border-b-2 border-blue2 font-medium text-blue2" : "text-gray-500 font-normal"}`}
          >
            {t === "all" ? "همه" : t === "news" ? "اعلانات و اخبار" : "فعالیت‌ها"}
          </button>
        )}
      </div>
      {/* Notifications */}
      <div className="px-4 py-3 flex-1 overflow-y-auto">
        {loading ?
          // loadings ==============================================================
          <NotificationDropdownLoading />
          : filteredNotifications.length > 0 ?
            filteredNotifications.map((item) =>
              <div dir="rtl" key={item.id} className="py-3 text-right text-sm cursor-pointer border-t border-gray21 first:border-none" onClick={() => handleNotificationClick(item)}>
                <div className="flex justify-between">
                  <div className="font-medium text-black1 mb-1 flex items-center mr-1 gap-2">
                    {item.title}<span className="w-2 h-2 flex items-center justify-center"><IconCircle /></span>
                  </div>
                  <div className="flex items-center justify-start text-gray-400 text-xs mb-1">
                    <span>{item.formattedTime}</span>
                  </div>
                </div>
                {item.message?.fa && <div className="text-gray17 text-xs leading-relaxed mt-1">{item.message.fa}</div>}
              </div>
            )
            :
            <div className="text-gray-400 py-4 text-sm w-full h-full flex items-center justify-center" dir="rtl">اعلان جدیدی وجود ندارد.</div>
        }
      </div>
      <Link to={ROUTES.NOTIFICATIONS} className="border-t border-gray19 py-3 w-full text-center text-blue2 text-sm font-semibold hover:underline">مشاهده همه اعلانات</Link>
    </div>
  );
}

