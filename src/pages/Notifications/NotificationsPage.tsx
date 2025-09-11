import React, { useState } from "react";
import IconRingNotif from "../../assets/icons/Notifications/IconRingNotif";
import HeaderLayout from "../../layouts/HeaderLayout";

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
    title: "جدیدترین فاز پیفا ۲۴ درحال ارائه برای شما",
    description: "کاربر گرامی واریز شناسه‌دار برای حساب شما فعال گردید",
  },
  {
    id: 4,
    date: "1404/09/08",
    time: "13:45",
    title: "جدیدترین فاز پیفا ۲۴ درحال ارائه برای شما",
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

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");

  return (
    <div className="w-full min-h-screen bg-white ">
   
       <HeaderLayout>
        <div className="w-full container-style">
           
      <div className="flex justify-between  h-16 items-center px-6">
        <div className="text-blue2 flex items-center cursor-pointer">
          <span className="w-5 h-5 mr-1">
            <IconRingNotif />
          </span>
          خواندن همه
        </div>
        <p className="text-black1 text-base font-medium">اعلانات</p>
      </div>

<div className="flex  text-sm justify-end pr-6">
  <div className="flex gap-6">
    <button
      onClick={() => setTab("all")}
      className={`py-3 text-center ${
        tab === "all"
          ? "border-b-2 border-blue2 font-medium text-blue2"
          : "text-gray-500"
      }`}
    >
      همه
    </button>
    <button
      onClick={() => setTab("news")}
      className={`py-3 text-center ${
        tab === "news"
          ? "border-b-2 border-blue2 font-medium text-blue2"
          : "text-gray-500"
      }`}
    >
      اعلانات و اخبار
    </button>
    <button
      onClick={() => setTab("activities")}
      className={`py-3 text-center ${
        tab === "activities"
          ? "border-b-2 border-blue2 font-medium text-blue2"
          : "text-gray-500"
      }`}
    >
      فعالیت‌ها
    </button>
  </div>
</div>


      
       
        {notifications.map((item) => (
          <div key={item.id} className="px-6 py-4 text-right text-sm border-b border-b-gray19">
            <div className="flex justify-between">
               <div className="flex items-center justify-end gap-2 text-gray-400 text-xs mb-1">
              <span>{item.date}</span>
              <span>{item.time}</span>
            </div>
            <div className="font-medium text-black1 mb-1 justify-start">{item.title}</div>
            </div>
           


            {item.description && (
              <div className="text-gray24 font-sm text-xs leading-relaxed pt-2">
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
       </HeaderLayout>
    
    </div>
  );
}
