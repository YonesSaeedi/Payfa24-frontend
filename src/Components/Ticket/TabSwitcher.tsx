import React, { useState } from "react";

type TabType = "finance" | "tech" | "identity" | "orders";
import Icontechnical from "../../assets/icons/ticket/Icontechnical";


import TicketsDashboard from "./TicketChat/TicketsDashboard";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<TabType>("orders");

 
  const tabs: { key: TabType; label: string; icon: React.ReactNode; content: React.ReactNode }[] = [
    { key: "finance", label: "مالی", icon: <Icontechnical /> , content: <div>📊 صفحه مالی</div> },
    { key: "tech", label: "فنی", icon: <Icontechnical /> , content: <div>⚙️ صفحه فنی</div> },
    { key: "identity", label: "احراز هویت", icon: <Icontechnical /> , content: <div>🪪 صفحه احراز هویت</div> },
    { key: "orders", label: "پیگیری سفارش", icon: <Icontechnical /> , content: <TicketsDashboard /> },
  ];

  

  return (
    <div className="p-6">
      
      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center justify-center w-28 h-24 border rounded-xl transition 
            ${activeTab === tab.key ? "border-blue-500 text-blue-500" : "border-gray-200 text-gray-700"}
            hover:border-blue-400 hover:text-blue-400`}
          >
            <div className="text-2xl">{tab.icon}</div>
            <span className="text-sm mt-2">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="w-full border rounded-xl p-4">
        {tabs.find((t) => t.key === activeTab)?.content}
      </div>
    </div>
  );
}
