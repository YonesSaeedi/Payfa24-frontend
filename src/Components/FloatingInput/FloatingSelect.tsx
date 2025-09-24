// import { useState, useRef, useEffect, FC } from "react";
// import { ChevronDown } from "lucide-react";

// interface BankOption {
//   bank: string;
//   card: string;
// }

// interface Option {
//   value: BankOption;
//   label: React.ReactNode;
//   icon?: React.ReactNode;
// }

// interface FloatingSelectProps {
//   label: string;
//   value: BankOption | null;
//   options: Option[];
//   onChange: (value: BankOption) => void;
//   placeholder?: string;
//   placeholderColor?: string;
// }

// const FloatingSelect: FC<FloatingSelectProps> = ({
//   label,
//   value,
//   options,
//   onChange,
//   placeholder = "گزینه‌ای را انتخاب کنید",
//   placeholderColor = "text-gray12",
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const selected = options.find(
//     (o) => o.value.bank === value?.bank && o.value.card === value?.card
//   );

//   // بستن dropdown وقتی کلیک خارج شد
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div ref={containerRef} dir="rtl" className="relative w-full">
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="peer flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray12 lg:bg-gray43 focus:outline-none focus:ring-1 focus:ring-blue2"
//       >
//         <span className={`flex items-center gap-2 ${placeholderColor}`}>
//           {selected?.icon}
//           {selected?.label || placeholder}
//         </span>
//         <ChevronDown className="w-4 h-4 text-gray12" />
//       </button>

//       <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">
//         {label}
//       </label>

//       {isOpen && (
//         <div className="absolute z-20 w-full mt-1 bg-white8 border border-gray21 rounded-lg shadow-lg overflow-hidden">
//           {options.map((option) => {
//             const isSelected = value
//               ? option.value.bank === value.bank && option.value.card === value.card
//               : false;

//             return (
//               <button
//                 key={`${option.value.bank}-${option.value.card}`}
//                 type="button"
//                 onClick={() => {
//                   onChange(option.value);
//                   setIsOpen(false);
//                 }}
//                 className={`flex items-center justify-start w-full px-3 py-2 text-right hover:text-blue2 transition
//                   ${isSelected ? "text-blue2" : "text-black1"}`}
//               >
//                 <span
//                   className={`w-4 h-4 ml-2 rounded-full border border-gray12 flex-shrink-0
//                     ${isSelected ? "bg-blue2 border-blue2" : "bg-white"}`}
//                 ></span>
//                 <span className="flex items-center gap-3 text-black1 hover:text-blue2">
//                   {option.icon && <span className="w-4 h-4 icon-wrapper">{option.icon}</span>}
//                   {option.label}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FloatingSelect;
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Generic type T
interface Option<T> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface FloatingSelectProps<T> {
  label: string;
  value: T | null;
  options: Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  placeholderColor?: string;
}

function FloatingSelect<T extends { card?: string }>({
  label,
  value,
  options,
  onChange,
  placeholder = "گزینه‌ای را انتخاب کنید",
  placeholderColor = "text-gray12",
}: FloatingSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // پیدا کردن آیتم انتخاب شده با مقایسه کارت (یا null)
  const selected = options.find((o) => o.value.card === value?.card);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} dir="rtl" className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="peer flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray12 lg:bg-gray43 focus:outline-none focus:ring-1 focus:ring-blue2"
      >
        <span className={`flex items-center gap-2 ${placeholderColor}`}>
          {selected?.icon}
          {selected?.label || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray12" />
      </button>

      <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">
        {label}
      </label>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white8 border border-gray21 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => {
            const isSelected = option.value.card === value?.card;
            return (
              <button
                key={option.value.card}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-start w-full px-3 py-2 text-right hover:text-blue2 transition ${
                  isSelected ? "text-blue2" : "text-black1"
                }`}
              >
                <span
                  className={`w-4 h-4 ml-2 rounded-full border border-gray12 flex-shrink-0 ${
                    isSelected ? "bg-blue2 border-blue2" : "bg-white"
                  }`}
                ></span>
                <span className="flex items-center gap-3 text-black1 hover:text-blue2">
                  {option.icon && <span className="w-4 h-4 icon-wrapper">{option.icon}</span>}
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FloatingSelect;

