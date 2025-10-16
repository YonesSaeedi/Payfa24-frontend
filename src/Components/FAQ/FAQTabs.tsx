import React from "react";

type FAQTabsProps = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const FAQTabs: React.FC<FAQTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "all", label: "همه" },
    { id: "general", label: "سوالات عمومی" },
    { id: "buy-sell", label: "خرید و فروش ارز" },
    { id: "deposit-withdraw", label: "واریز و برداشت ارز" },
    { id: "register", label: "ثبت نام و احراز هویت" },
  ];

  return (
   <div className="flex gap-6 pb-3 mb-6 text-sm font-medium overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`pb-1 shrink-0 whitespace-nowrap ${
        activeTab === tab.id
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500 hover:text-blue-600"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>

  );
};

export default FAQTabs;
