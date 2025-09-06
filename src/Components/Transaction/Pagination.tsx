import React from "react";

interface PaginationProps {
  current: number;
  total: number; // مثلاً 12
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onPageChange }) => {
  // ساختن آرایه مثل [1, 2, 3, "...", 12]
  const pages = [1, 2, 3, "...", total];

  return (
    <div dir="rtl" className="flex justify-center items-center gap-2 mt-4 text-sm">
      {pages.map((num, idx) =>
        num === "..." ? (
          <span key={idx} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num as number)}
            className={`px-3 py-1 rounded-md transition ${
              num === current
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
