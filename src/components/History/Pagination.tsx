// import React from "react";
// import { formatPersianDigits } from "../../utils/formatPersianDigits";


// interface PaginationProps {
//   current: number;
//   total: number;
//   onPageChange: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   current,
//   total,
//   onPageChange,
// }) => {
//   const getPages = (): (number | string)[] => {
//     const pages: (number | string)[] = [];

//     pages.push(1);

//     if (total <= 5) {
//       for (let i = 2; i <= total; i++) pages.push(i);
//       return pages;
//     }

//     if (current <= 3) {
//       for (let i = 2; i <= Math.min(4, total - 1); i++) pages.push(i);
//       if (total > 4) pages.push("...");
//       pages.push(total);
//       return pages;
//     }

//     // if (current >= total - 2) {
//     //   pages.push("...");
//     //   for (let i = total - 3; i < total; i++) pages.push(i);
//     //   return pages;
//     // }
//     if (current >= total - 2) {
//   pages.push("...");
//   for (let i = total - 3; i <= total; i++) {
//     if (i > 1) pages.push(i);
//   }
//   return pages;
// }


//     pages.push("...");
//     pages.push(current - 1);
//     pages.push(current);
//     pages.push(current + 1);
//     pages.push("...");
//     pages.push(total);

//     return pages;
//   };

//   const pages = getPages();

//   return (
//     <div
//       dir="rtl"
//       className="flex justify-center items-center gap-1 mt-4 text-sm pb-6"
//     >
//       <button
//         onClick={() => current > 1 && onPageChange(current - 1)}
//         disabled={current === 1}
//         className={`px-3 py-1 rounded-md transition ${
//           current === 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
//         }`}
//       >
//         قبلی
//       </button>

//       {pages.map((num, idx) =>
//         num === "..." ? (
//           <span key={idx} className="px-2 text-gray-500">
//             ...
//           </span>
//         ) : (
//           <button
//             key={idx}
//             onClick={() => onPageChange(num as number)}
//             className={`px-3 py-1 rounded-md transition ${
//               num === current
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//            {formatPersianDigits(num)}

//           </button>
//         )
//       )}

//       <button
//         onClick={() => current < total && onPageChange(current + 1)}
//         disabled={current === total}
//         className={`px-3 py-1 rounded-md transition ${
//           current === total
//             ? "text-gray-300"
//             : "text-gray-600 hover:bg-gray-100"
//         }`}
//       >
//         بعدی
//       </button>
//     </div>
//   );
// };

// export default Pagination;
import React from "react";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import IconArrowRight from "../../assets/icons/Deposit/IconArrowRight";


interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onPageChange }) => {
  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    pages.push(1);

    if (total <= 7) {
      for (let i = 2; i <= total; i++) pages.push(i);
      return pages;
    }

    if (current <= 3) {
      pages.push(2, 3, 4, "…", total);
      return pages;
    }

    if (current >= total - 2) {
      pages.push("…", total - 3, total - 2, total - 1, total);
      return pages;
    }

    pages.push("…", current - 1, current, current + 1, "…", total);
    return pages;
  };

  const pages = getPages();

  const baseClass =
    "w-9 h-9 flex items-center justify-center rounded-xl transition text-[15px]";

  return (
    <div className="flex justify-center items-center gap-2 py-4" dir="rtl">
      {/* Prev */}
      <button
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        className={`${baseClass} ${
          current === 1
            ? "text-gray-300 bg-gray-100"
            : "text-gray-600 bg-gray-100 hover:bg-gray-200 rotate-180"
        }`}
      >
        <IconArrowRight/>
      </button>

      {/* Numbers */}
      {pages.map((p, index) =>
        p === "…" ? (
          <span
            key={index}
            className="w-8 h-8 flex items-center justify-center text-gray-500"
          >
            …
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(p as number)}
            className={`${baseClass} ${
              p === current
                ? "bg-blue2 text-white font-semibold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {formatPersianDigits(p)}
          </button>
        )
      )}

      {/* Next */}
      <button
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
        className={`${baseClass} ${
          current === total
            ? "text-gray-300 bg-gray-100"
            : "text-gray-600 bg-gray-100 hover:bg-gray-200 "
        }`}
      >
        <IconArrowRight/>
      </button>
    </div>
  );
};

export default Pagination;
