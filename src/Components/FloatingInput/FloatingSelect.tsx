// components/FloatingSelect.tsx
import { useState, FC } from "react";
import { ChevronDown } from "lucide-react"; // آیکون فلش

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FloatingSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

const FloatingSelect: FC<FloatingSelectProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const shouldFloat = isOpen || !!value;

  return (
    <div dir="rtl" className="relative w-full">
      {/* دکمه اصلی */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="peer flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="flex items-center gap-2">
          {selected?.icon}
          {selected?.label}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* لیبل شناور */}
      <label
        className={`absolute right-3 text-gray-400 transition-all duration-200 pointer-events-none 
          ${shouldFloat ? "text-xs -top-2 bg-gray-50 px-1" : "text-base top-5"}`}
      >
        {label}
      </label>

      {/* منوی کشویی */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-right hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
              {value === option.value && (
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingSelect;
