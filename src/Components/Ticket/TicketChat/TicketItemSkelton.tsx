import React from "react";

const TicketItemSkeleton: React.FC = () => {
  return (
    <div
      className="p-3 mb-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 animate-pulse"
    >
      {/* عنوان و استاتوس */}
      <div className="flex justify-between mt-2 mb-3">
        <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>

      {/* شماره پیگیری و تاریخ */}
      <div dir="rtl" className="flex justify-between mt-3">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
};

export default TicketItemSkeleton;
