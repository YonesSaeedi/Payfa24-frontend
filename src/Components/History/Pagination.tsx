import React from "react";

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onPageChange }) => {

  const getPages = () => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    if (current <= 3) return [1, 2, 3, "...", total];
    if (current >= total - 2) return [1, "...", total - 2, total - 1, total];

    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const pages = getPages();

  return (
    <div dir="rtl" className="flex justify-center items-center gap-2 mt-4 text-sm pb-6">
      {pages.map((num, idx) =>
        num === "..." ? (
          <span key={idx} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num as number)}
            className={`px-3 py-1  rounded-md transition ${num === current
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
