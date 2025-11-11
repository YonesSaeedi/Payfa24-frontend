import { useEffect, useState, useMemo } from "react";
import IconRingNotif from "../../assets/icons/Notifications/IconRingNotif";
import HeaderLayout from "../../layouts/HeaderLayout";
import { apiRequest } from "../../utils/apiClient";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ROUTES } from "../../routes/routes";
import NotificationPageLoading from "../../components/Notification/NotificationPageLoading";

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
  title: string;
}

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
  // fetch notifications data ==================================================================================================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<NotificationItem[]>({ url: "/notifications" });
      setNotifications(response);
    } catch (error) { toast.error((error as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در دریافت اعلانات مشکلی پیش آمد.') }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
  const handleNotificationClick = async (item: NotificationItem) => {
    try {
      if (item.seen === "unseen") {
        await apiRequest({ url: `/notifications/seen/${item.id}`, method: "PUT", });
        setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, seen: "seen" } : n)));
      }
      // navigation based on keyword
      switch (item.keyword) {
        case "user-level": navigate(ROUTES.USER_ACCOUNT); break;
        case "ticket": navigate(ROUTES.TICKET.ROOT); break;
        case "tr-internal":
        case "trade":
        case "tr-crypto":
        case "deposit-id": navigate(ROUTES.TRANSACTION.ROOT); break;
        case "cardbank": navigate(ROUTES.BANK_CARDS); break;
        case "referral":
        case "tr-referral": navigate(ROUTES.ADD_FRIEND); break;
        case "message": break; // هیچ کاری نکن
        default: navigate(ROUTES.HOME);
      }
    } catch (error) {
      toast.error((error as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در ثبت اعلان به عنوان "خوانده شده" مشکلی پیش آمد.')
    }
  };
  const handleSeenAll = async () => {
    try {
      await apiRequest({ url: "/notifications/seen/all", method: "POST" });
      // setNotifications((prev) => prev.map((n) => ({ ...n, seen: "seen" })));
      fetchData()
    } catch (error) { toast.error((error as AxiosError<{ msg?: string }>)?.response?.data?.msg || 'در ثبت همه اعلانات به عنوان "خوانده شده" مشکلی پیش آمد.') }
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
    <div className="w-full min-h-screen bg-white">
      <HeaderLayout>
        <div className="w-full container-style">
          <div className="flex justify-between h-16 items-center px-6">
            <div className="text-blue2 flex items-center cursor-pointer" onClick={handleSeenAll}><span className="w-5 h-5 mr-1"><IconRingNotif /></span>خواندن همه</div>
            <h4 className="text-black1 text-base font-medium">اعلانات</h4>
          </div>
          <div className="flex text-sm justify-end pr-6">
            <div className="flex gap-6" dir="rtl">
              {["all", "news", "activities"].map((t) =>
                <button key={t} onClick={() => setTab(t)} className={`py-3 text-center ${tab === t ? "border-b-2 border-blue2 font-medium text-blue2" : "text-gray-500"}`}>
                  {t === "all" ? "همه" : t === "news" ? "اعلانات و اخبار" : "فعالیت‌ها"}
                </button>
              )}
            </div>
          </div>
          {/* Notifications */}
          <div className="divide-y">
            {loading ?
              // Skeleton هنگام لود
              <NotificationPageLoading />
              : filteredNotifications.length > 0 ?
                filteredNotifications.map((item) =>
                  <div key={item.id} className="px-6 py-4 text-right text-sm border-b border-gray19 cursor-pointer" onClick={() => handleNotificationClick(item)}>
                    <div className="flex justify-between">
                      <div className="flex items-center justify-end gap-2 text-gray-400 text-xs mb-1"><span>{formatTime(item.time)}</span></div>
                      <div className="flex font-medium text-black1 mb-1 justify-start items-center gap-2">
                        <span>{item.title}</span>
                        {item.seen === "unseen" && <div className="w-[6px] h-[6px] bg-blue2 rounded-full"></div>}
                      </div>
                    </div>
                    {item.message && <div dir="rtl" className="text-gray5 font-sm text-xs leading-relaxed pt-2">{item.message.fa}</div>}
                  </div>
                )
                :
                <div className="text-center text-gray-400 py-4 text-sm" dir="rtl">اعلانی وجود ندارد.</div>
            }
          </div>
        </div>
      </HeaderLayout>
    </div>
  );
}
