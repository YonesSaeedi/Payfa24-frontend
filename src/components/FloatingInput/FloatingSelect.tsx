import { useState, FC, useEffect, useRef } from "react";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";
import IconChervUp from "../../assets/icons/Withdrawal/IconChervUp";

interface Option {
  value?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  hideIndicator?: boolean;
}

interface FloatingSelectProps {
  label: string;
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderColor?: string;
  onOpen?: () => void;
  placeholderIcon?: React.ReactNode;
  placeholderClasses?: string;
  isBankSelect?: boolean;
  disabled?: boolean; // ✅ از بیرون
}

const FloatingSelect: FC<FloatingSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = "گزینه‌ای را انتخاب کنید",
  placeholderColor = "text-gray12 ",
  onOpen,
  placeholderIcon,
  placeholderClasses,
  disabled = false, // ⬅️ مقدار پیش‌فرض
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const handleButtonClick = () => {
    if (disabled) return; // ⬅️ در حالت غیرفعال اصلاً باز نشود
    if (onOpen) {
      onOpen();
    } else {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div dir="rtl" className="relative w-full" ref={selectRef}>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled} 
        className={`
          flex items-center justify-between w-full px-4 lg:h-[56px] h-[48px] rounded-lg
          lg:bg-gray43
          ${
            disabled
              ? "border border-gray-300 text-gray-400 cursor-pointer focus:border-gray-300 focus:ring-0"
              : isOpen
              ? "border border-blue2"
              : "border border-gray12"
          }
        `}
      >
        <span
          className={`flex items-center gap-3 w-full text-xs lg:text-sm ${
            placeholderClasses || placeholderColor
          }`}
        >
          {!selected && placeholderIcon && (
            <span className="w-6 h-6">{placeholderIcon}</span>
          )}
          {selected ? (
            <div className="flex items-center justify-between w-full ">
              {selected.icon && (
                <span className="w-6 h-6 flex-shrink-0 ml-2">
                  {selected.icon}
                </span>
              )}
              {selected.label}
            </div>
          ) : (
            placeholder
          )}
        </span>
        <div className="pr-2 mb-1">
          {isOpen ? (
            <span className="icon-wrapper w-5 h-5 text-blue2">
              <IconChervUp />
            </span>
          ) : (
            <span
              className={`icon-wrapper w-5 h-5 ${
                disabled ? "text-gray-300" : "text-gray12"
              }`}
            >
              <IconChervDown />
            </span>
          )}
        </div>
      </button>

      <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">
        {label}
      </label>

      {!onOpen && isOpen && options.length > 0 && (
        <div className="w-full p-2 absolute z-50 mt-1 bg-gray43 border border-gray21 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value ?? "");
                setIsOpen(false);
              }}
              disabled={option.disabled}
              className={`w-full flex items-center justify-start px-3 py-2 text-right transition ${
                option.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : value === option.value
                  ? "text-blue2"
                  : "text-gray12 hover:text-blue2"
              }`}
            >
              {!option.hideIndicator && (
                <span
                  className={`relative w-4 h-4 ml-2 rounded-full border flex-shrink-0 ${
                    value === option.value ? "border-blue2" : "border-gray-400"
                  }`}
                >
                  {value === option.value && (
                    <span className="absolute w-2 h-2 top-1/2 left-1/2 bg-blue2 -translate-x-1/2 -translate-y-1/2 rounded-full"></span>
                  )}
                </span>
              )}
              <div className="flex items-center justify-end w-full flex-row-reverse">
                {option.label}
                {option.icon && (
                  <span className="w-5 h-5 ml-2">{option.icon}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingSelect;
