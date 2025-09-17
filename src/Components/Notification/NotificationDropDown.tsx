import React, { useState } from "react";
import IconRingNotif from "../../assets/icons/Notifications/IconRingNotif";
import IconCircle from "../../assets/icons/Notifications/IconCircle";
import { useNavigate } from "react-router-dom";


interface NotificationItem {
  id: number;
  date: string;
  time: string;
  title: string;
  description?: string;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    date: "1404/09/08",
    time: "13:45",
    title: "ورود به حساب کاربری",
    description:
      "دستگاهی با نام phone, AndroidOS 7.1.0.8 در تاریخ 1404/09/08 و در ساعت 13:45 وارد حساب کاربری شما شده است",
  },
  {
    id: 2,
    date: "1404/09/08",
    time: "13:45",
    title: "فعال شدن واریز با شناسه",
    description: "کاربر گرامی واریز شناسه‌دار برای حساب شما فعال گردید",
  },
  {
    id: 3,
    date: "1404/09/08",
    time: "13:45",
    title: "جدیدترین فاز پیفا ۲۴ درحال ارائه",
    description: "کاربر گرامی واریز شناسه‌دار برای حساب شما فعال گردید",
  },
  {
    id: 4,
    date: "1404/09/08",
    time: "13:45",
    title: "جدیدترین فاز پیفا ۲۴ درحال ارائه",
    description: "کاربر گرامی واریز شناسه‌دار برای حساب شما فعال گردید",
  },
  {
    id: 5,
    date: "1404/09/08",
    time: "13:50",
    title: "یک اعلان جدید دیگر",
    description: "این فقط یک تست است",
  },
];

export default function NotificationsDropdown() {
  const [tab, setTab] = useState("all");
  const navigate = useNavigate();
  const [showAll] = useState(false);

  const visibleNotifications = showAll ? notifications : notifications.slice(0, 4);

  return (
    <div className="w-[500px] rounded-2xl shadow-lg bg-white8">
      {/* Header */}
      <div className="flex justify-between bg-gray33 h-14 items-center p-6">
        <div className="text-blue2 flex items-center ">
          <span className="w-6 h-6 icon-wrapper mr-1"><IconRingNotif/></span>
          خواندن همه
        </div>
        <p className="text-black1">اعلانات</p>
      </div>

      {/* Tabs */}
      <div className="flex text-sm">
        <button
          onClick={() => setTab("all")}
          className={`flex-1 py-2 text-center ${
            tab === "all" ? "border-b-2 border-blue2 font-medium text-blue2" : "text-gray-500"
          }`}
        >
          همه
        </button>
        <button
          onClick={() => setTab("news")}
          className={`flex-1 py-2 text-center ${
            tab === "news" ? "border-b-2 border-blue2 font-medium text-blue2" : "text-gray-500"
          }`}
        >
          اعلانات و اخبار
        </button>
        <button
          onClick={() => setTab("activities")}
          className={`flex-1 py-2 text-center ${
            tab === "activities" ? "border-b-2 border-blue2 font-medium text-blue2" : "text-gray-500"
          }`}
        >
          فعالیت‌ها
        </button>
      </div>

      {/* Notifications */}
      <div className="divide-y">
        {visibleNotifications.map((item) => (
          <div key={item.id} className="px-4 py-3 text-right text-sm mt-2">
            <div className="flex justify-between">
              <div className="flex items-center justify-start text-gray-400 text-xs mb-1">
                <span>{item.date}</span>
                <span>{item.time}</span>
              </div>
              <div className="font-medium text-black1 mb-1 flex items-center mr-1">
                {item.title}
                <span className="w-2 h-2 icon-wrapper flex items-center justify-center ml-1">
                  <IconCircle />
                </span>
              </div>
            </div>
            {item.description && (
              <div className="text-gray17 text-xs leading-relaxed mt-1">
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show all link */}
      {notifications.length > 4 && !showAll && (
        <div
        onClick={() => navigate("/notifications")}
          className="border-t py-3 text-center text-blue2 text-sm font-semibold m-1 cursor-pointer hover:underline"
        >
          مشاهده همه اعلانات
        </div>
      )}
    </div>
  );
}
