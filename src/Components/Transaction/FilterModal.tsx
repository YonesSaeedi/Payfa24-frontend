// components/FilterModal.js
import React from "react";

export default function FilterModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 max-w-sm rounded-2xl p-4">
        {/* هدر مودال */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">فیلترها</h2>
          <button onClick={onClose} className="text-gray-500 font-bold">
            ×
          </button>
        </div>

        {/* محتویات مودال */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1">وضعیت</label>
            <select className="w-full border rounded p-2">
              <option>همه</option>
              <option>فعال</option>
              <option>غیرفعال</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">نوع تراکنش</label>
            <select className="w-full border rounded p-2">
              <option>همه</option>
              <option>دریافتی</option>
              <option>پرداختی</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">مرتب‌سازی بر اساس</label>
            <select className="w-full border rounded p-2">
              <option>جدیدترین</option>
              <option>قدیمی‌ترین</option>
              <option>بیشترین تراکنش</option>
              <option>کمترین تراکنش</option>
            </select>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700"
          >
            حذف فیلتر
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>
  );
}
