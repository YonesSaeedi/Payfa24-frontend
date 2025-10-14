import React from "react";

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onPageChange }) => {

  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    // همیشه شماره اول را اضافه کن
    pages.push(1);

    if (total <= 5) {
      for (let i = 2; i <= total; i++) pages.push(i);
      return pages;
    }

    if (current <= 3) {
      // نمایش شماره‌های ابتدایی و تعداد بعدی به ترتیب
      for (let i = 2; i <= Math.min(4, total - 1); i++) pages.push(i);
      if (total > 4) pages.push("...");
      pages.push(total);
      return pages;
    }

    if (current >= total - 2) {
      pages.push("...");
      for (let i = total - 3; i < total; i++) pages.push(i);
      return pages;
    }

    // حالت وسط
    pages.push("...");
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push("...");
    pages.push(total);

    return pages;
  };

  const pages = getPages();

  return (
    <div dir="rtl" className="flex justify-center items-center gap-2 mt-4 text-sm pb-6">

      {/* دکمه قبلی */}
      <button
        onClick={() => current > 1 && onPageChange(current - 1)}
        disabled={current === 1}
        className={`px-3 py-1 rounded-md transition ${current === 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
      >
        قبلی
      </button>

      {/* شماره صفحات */}
      {pages.map((num, idx) =>
        num === "..." ? (
          <span key={idx} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(num as number)}
            className={`px-3 py-1 rounded-md transition ${num === current
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {num}
          </button>
        )
      )}

      {/* دکمه بعدی */}
      <button
        onClick={() => current < total && onPageChange(current + 1)}
        disabled={current === total}
        className={`px-3 py-1 rounded-md transition ${current === total ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
      >
        بعدی
      </button>
    </div>
  );
};

export default Pagination;
