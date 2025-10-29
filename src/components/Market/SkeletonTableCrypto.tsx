import React from "react";

const SkeletonTable: React.FC = () => {
  // دسکتاپ
  const desktopSkeleton = Array.from({ length: 7 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-gray-200 last:border-b-0">
      {/* نام و نماد */}
      <td className="py-3 px-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 bg-gray-300 rounded"></div>
          <div className="h-2 w-10 bg-gray-300 rounded"></div>
        </div>
      </td>

      {/* قیمت به USDT */}
      <td className="py-3 px-4 hidden lg:table-cell">
        <div className="h-3 w-16 bg-gray-300 rounded mx-auto"></div>
      </td>

      {/* قیمت خرید */}
      <td className="py-3 px-4 text-center lg:text-right">
        <div className="h-3 w-14 bg-gray-300 rounded mx-auto"></div>
      </td>

      {/* قیمت فروش */}
      <td className="py-3 px-4 hidden lg:table-cell">
        <div className="h-3 w-14 bg-gray-300 rounded mx-auto"></div>
      </td>

      {/* تغییرات ۲۴h */}
      <td className="py-3 px-4 text-center">
        <div className="h-3 w-10 bg-gray-300 rounded mx-auto"></div>
      </td>

      {/* اقدام */}
      <td className="py-3 px-4 hidden lg:table-cell">
        <div className="h-6 w-20 bg-gray-300 rounded mx-auto"></div>
      </td>
    </tr>
  ));

  // موبایل
  const mobileSkeleton = Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="border rounded-2xl p-4 animate-pulse space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <div className="flex flex-col gap-1">
            <div className="h-3 w-20 bg-gray-300 rounded"></div>
            <div className="h-2 w-10 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-300"></div>
      </div>
      <div className="space-y-1">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  ));

  return (
    <div>
      {/* دسکتاپ */}
      <div className="hidden lg:block">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="py-3 px-4 text-center w-48 rounded-tl-lg">نام و نماد ارز</th>
              <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
              <th className="py-3 px-4 text-center lg:text-right">قیمت خرید</th>
              <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
              <th className="py-3 px-4 text-center rounded-tr-lg">تغییرات ۲۴h</th>
              <th className="py-3 px-4 hidden lg:table-cell"></th>
            </tr>
          </thead>
          <tbody>{desktopSkeleton}</tbody>
        </table>
      </div>

      {/* موبایل */}
      <div className="block lg:hidden space-y-4 mt-4">{mobileSkeleton}</div>
    </div>
  );
};

export default SkeletonTable;
