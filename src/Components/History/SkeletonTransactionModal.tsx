import React from "react";

const SkeletonTransactionModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md relative shadow-xl border border-gray-100 max-h-[85vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <h2 className="font-semibold text-lg text-gray-800">جزئیات تراکنش</h2>
          <div className="h-6 w-6 rounded-full skeleton-bg" />
        </div>

        {/* Icon + Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-full skeleton-bg mb-3" />
          <div className="h-4 w-24 rounded-md skeleton-bg mb-2" />
          <div className="h-3 w-12 rounded-md skeleton-bg" />
        </div>

        {/* Detail grid (مشابه layout واقعی) */}
        <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-gray-100 pb-2"
            >
              <div className="h-3 w-20 rounded-md skeleton-bg" />
              <div className="h-3 w-24 rounded-md skeleton-bg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonTransactionModal;
