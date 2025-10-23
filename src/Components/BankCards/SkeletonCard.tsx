// components/BankCards/SkeletonCard.tsx
import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div
      className="rounded-xl shadow p-4 flex flex-col justify-between relative animate-pulse bg-gray-200 dark:bg-gray-700"
      style={{
        height: "180px",
      }}
    >
      <div className="flex justify-start items-center space-x-2 mb-4">
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full ml-1" />
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="flex flex-col gap-1 items-end">
          <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
