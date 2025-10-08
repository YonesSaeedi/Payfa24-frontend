// <<<<<<< HEAD
import { useState, FC } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
// =======

// import React, { useEffect, useRef, useState } from "react";

// type Option<T> = {
//   value: T;
//   label: React.ReactNode;
// >>>>>>> 5018db416b70f9ab4c020668bdc3087e672472a5
  icon?: React.ReactNode;
};

interface FloatingSelectProps {
  label: string;
// <<<<<<< HEAD
  value: string;
  options: Option[];
  onChange: (value: string) => void;
// =======
//   value?: T | null;
//   options: Option<T>[];
//   onChange: (value: T) => void;
// >>>>>>> 5018db416b70f9ab4c020668bdc3087e672472a5
  placeholder?: string;
  placeholderColor?: string;
  onOpen?: () => void;
  placeholderIcon?: React.ReactNode;
  placeholderClasses?: string;
  isBankSelect?: boolean;
}

// <<<<<<< HEAD
const FloatingSelect: FC<FloatingSelectProps> = ({
// =======
// /** ساده‌ترین chevron svg برای جلوگیری از import خارجی */
// const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
//   <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
//     <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// function FloatingSelect<T>({
// >>>>>>> 5018db416b70f9ab4c020668bdc3087e672472a5
  label,
  value,
  options,
  onChange,
  placeholder = "گزینه‌ای را انتخاب کنید",
  placeholderColor = "text-gray12",
// <<<<<<< HEAD
  onOpen,
  placeholderIcon, // دریافت پراپ جدید
  placeholderClasses, // دریافت پراپ جدید
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const handleButtonClick = () => {
    if (onOpen) {
      onOpen();
    } else {
      setIsOpen(!isOpen);
    }
// =======
//   placeholderIcon,
//   isBankSelect = false,
// }: FloatingSelectProps<T>) {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // پیدا کردن گزینه انتخاب‌شده — با casting به any برای جلوگیری از خطاهای تایپ جنریک
//   const selected = options.find((o) => {
//     if (isBankSelect) {
//       // در حالت بانک ما فرض می‌کنیم value و option.value آبجکت با فیلد card هستند
//       const ov = (o.value as any) ?? {};
//       const vv = (value as any) ?? {};
//       return ov?.card && vv?.card && ov.card === vv.card;
//     }
//     // حالت عمومی: مقایسه مرجع / پرمییتیو
//     return Object.is(o.value as any, value as any);
//   });

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const formatCard = (card?: string) => {
//     if (!card) return "";
//     return card.replace(/(\d{4})(?=\d)/g, "$1-");
// >>>>>>> 5018db416b70f9ab4c020668bdc3087e672472a5
  };

  return (
    <div dir="rtl" className="relative w-full">
      <button
        type="button"
// <<<<<<< HEAD
        onClick={handleButtonClick}
        className={`peer flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray12 lg:bg-gray43 focus:outline-none focus:ring-1 focus:ring-blue2`}
      >
        <span className={`flex items-center gap-2 ${placeholderClasses || placeholderColor}`}>
          {/* نمایش آیکون و متن placeholder */}
          {!selected && placeholderIcon && (
            <span className="w-6 h-6">{placeholderIcon}</span>
          )}
          {/* نمایش مقدار انتخاب شده یا placeholder */}
          {selected?.label || placeholder}
        </span>
{/* =======
        onClick={() => setIsOpen(!isOpen)}
        className="peer flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray12 lg:bg-gray43 focus:outline-none focus:ring-1 focus:ring-blue2"
      >
        {!selected ? (
          <span className={`flex items-center gap-2 ${placeholderColor}`}>
            {placeholderIcon && <span className="w-6 h-6">{placeholderIcon}</span>}
            {placeholder}
          </span>
        ) : isBankSelect ? (
          // نمایش مخصوص کارت/بانک (اگر استفاده می‌کنید)
          <span className="flex justify-between w-full">
            <span className="text-right">{(selected.value as any)?.bankName}</span>
            <span className="text-left ml-2">{formatCard((selected.value as any)?.card)}</span>
          </span>
        ) : (
          <>{selected.label}</>
        )}
>>>>>>> 5018db416b70f9ab4c020668bdc3087e672472a5 */}
        <ChevronDown className="w-4 h-4 text-gray12" />
      </button>

      <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">
        {label}
      </label>

{/* <<<<<<< HEAD */}
      {!onOpen && isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray43 border border-gray21 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex items-center justify-start w-full px-3 py-2 text-right hover:text-blue2 transition ${
                value === option.value ? "text-blue2" : "text-blue2"
              }`}
            >
              <span className={`w-4 h-4 ml-2 rounded-full border border-gray12 flex-shrink-0 ${
                value === option.value ? "bg-blue2 border-blue2" : "bg-white"
              }`}></span>
              <span className="flex items-center gap-3 text-black1 hover:text-blue2">
                {option.icon && (
                  <span className="w-4 h-4 icon-wrapper">{option.icon}</span>
                )}
                {option.label}
              </span>
            </button>
          ))}
{/* =======
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white8 border border-gray21 rounded-lg shadow-lg overflow-hidden">
          {options.map((option, idx) => {
            const isSelected = isBankSelect
              ? (option.value as any)?.card === (value as any)?.card
              : Object.is(option.value as any, value as any);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex justify-start w-full px-3 py-2 text-right hover:text-blue2 transition ${
                  isSelected ? "text-blue2" : "text-black1"
                }`}
              >
                {isBankSelect ? (
                  <>
                    <span
                      className={`w-4 h-4 rounded-full border border-gray21 flex-shrink-0 ml-2
                        ${isSelected ? "bg-blue2 border-blue2" : "bg-white"}
                        hover:bg-blue2 cursor-pointer`}
                    ></span>

                    <span className="flex w-full justify-between">
                      <span>{(option.value as any)?.bankName}</span>
                      <span>{formatCard((option.value as any)?.card)}</span>
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-3">
                    {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                    {option.label}
                  </span>
                )}
              </button>
            );
          })}
>>>>>>> 5018db416b70f9ab4c020668bdc3087e672472a5 */}
        </div>
      )}
    </div>
  );
};

export default FloatingSelect;






// import React, { useEffect, useRef, useState } from "react";

// type Option<T> = {
//   value: T;
//   label: React.ReactNode;
//   icon?: React.ReactNode;
// };

// interface FloatingSelectProps<T> {
//   label: string;
//   value?: T | null;
//   options: Option<T>[];
//   onChange: (value: T) => void;
//   placeholder?: string;
//   placeholderColor?: string;
//   onOpen?: () => void;
//   placeholderIcon?: React.ReactNode;
//   placeholderClasses?: string;
//   isBankSelect?: boolean;
// }

// /** ساده‌ترین chevron svg برای جلوگیری از import خارجی */
// const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
//   <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
//     <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// function FloatingSelect<T>({
//   label,
//   value,
//   options,
//   onChange,
//   placeholder = "گزینه‌ای را انتخاب کنید",
//   placeholderColor = "text-gray12",
//   placeholderIcon,
//   isBankSelect = false,
// }: FloatingSelectProps<T>) {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // پیدا کردن گزینه انتخاب‌شده — با casting به any برای جلوگیری از خطاهای تایپ جنریک
//   const selected = options.find((o) => {
//     if (isBankSelect) {
//       // در حالت بانک ما فرض می‌کنیم value و option.value آبجکت با فیلد card هستند
//       const ov = (o.value as any) ?? {};
//       const vv = (value as any) ?? {};
//       return ov?.card && vv?.card && ov.card === vv.card;
//     }
//     // حالت عمومی: مقایسه مرجع / پرمییتیو
//     return Object.is(o.value as any, value as any);
//   });

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const formatCard = (card?: string) => {
//     if (!card) return "";
//     return card.replace(/(\d{4})(?=\d)/g, "$1-");
//   };

//   return (
//     <div ref={containerRef} dir="rtl" className="relative w-full">
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="peer flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray12 lg:bg-gray43 focus:outline-none focus:ring-1 focus:ring-blue2"
//       >
//         {!selected ? (
//           <span className={`flex items-center gap-2 ${placeholderColor}`}>
//             {placeholderIcon && <span className="w-6 h-6">{placeholderIcon}</span>}
//             {placeholder}
//           </span>
//         ) : isBankSelect ? (
//           // نمایش مخصوص کارت/بانک (اگر استفاده می‌کنید)
//           <span className="flex justify-between w-full">
//             <span className="text-right">{(selected.value as any)?.bankName}</span>
//             <span className="text-left ml-2">{formatCard((selected.value as any)?.card)}</span>
//           </span>
//         ) : (
//           <>{selected.label}</>
//         )}
//         <ChevronDown className="w-4 h-4 text-gray12" />
//       </button>

//       <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">
//         {label}
//       </label>

//       {isOpen && (
//         <div className="absolute z-20 w-full mt-1 bg-white8 border border-gray21 rounded-lg shadow-lg overflow-hidden">
//           {options.map((option, idx) => {
//             const isSelected = isBankSelect
//               ? (option.value as any)?.card === (value as any)?.card
//               : Object.is(option.value as any, value as any);

//             return (
//               <button
//                 key={idx}
//                 type="button"
//                 onClick={() => {
//                   onChange(option.value);
//                   setIsOpen(false);
//                 }}
//                 className={`flex justify-start w-full px-3 py-2 text-right hover:text-blue2 transition ${
//                   isSelected ? "text-blue2" : "text-black1"
//                 }`}
//               >
//                 {isBankSelect ? (
//                   <>
//                     <span
//                       className={`w-4 h-4 rounded-full border border-gray21 flex-shrink-0 ml-2
//                         ${isSelected ? "bg-blue2 border-blue2" : "bg-white"}
//                         hover:bg-blue2 cursor-pointer`}
//                     ></span>

//                     <span className="flex w-full justify-between">
//                       <span>{(option.value as any)?.bankName}</span>
//                       <span>{formatCard((option.value as any)?.card)}</span>
//                     </span>
//                   </>
//                 ) : (
//                   <span className="flex items-center gap-3">
//                     {option.icon && <span className="w-4 h-4">{option.icon}</span>}
//                     {option.label}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default FloatingSelect;
