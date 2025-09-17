import { useState, FC } from "react";
import { ChevronDown } from "lucide-react";
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
  placeholder?: string;
  placeholderColor?: string;
}

const FloatingSelect: FC<FloatingSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = "گزینه‌ای را انتخاب کنید",
  placeholderColor = "text-gray12",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const shouldFloat = isOpen || !!value;

  return (
    <div dir="rtl" className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="peer flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray12 lg:bg-gray43 focus:outline-none focus:ring-1  focus:ring-blue2"
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
        <div className="absolute z-20 w-full mt-1 bg-gray43 border border-gray21 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex  items-center justify-start w-full px-3 py-2 text-right hover:text-blue2 transition 
          ${value === option.value ? "text-blue2" : "text-blue2"}`}
            >
              <span
                className={`w-4 h-4 ml-2 rounded-full border border-gray12 flex-shrink-0 
        ${value === option.value ? "bg-blue2 border-blue2" : "bg-white"}`}
              ></span>

              <span className="flex items-center gap-3 text-black1 hover:text-blue2">
                {option.icon && (
                  <span className="w-4 h-4 icon-wrapper">{option.icon}</span>
                )}
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingSelect;
