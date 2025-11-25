
import React, { useEffect, useRef } from "react";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";

interface OptionType {
  id: number;      
  name: string;
  value: string;
}

interface FilterDropdownProps {
  id: string;
  label: string;
  options: OptionType[];
  selected: OptionType | null;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string, option: OptionType) => void;
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  id,
  label,
  options,
  selected,
  isOpen,
  onToggle,
  onSelect,
  className,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) onToggle(id);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, id, onToggle]);

  return (
    <div  dir="rtl"
      ref={dropdownRef}
      className={`relative text-sm ${className || " w-44"}`}
    >
      <button
        onClick={() => onToggle(id)}
        className={`flex justify-between items-center w-full px-3 py-2 rounded-lg text-black0 border transition-colors
          ${isOpen ? "border-blue2" : "border-gray21"}
        `}
      >
        <span dir="rtl">{selected?.name || label}</span>
        <span
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <IconChervDown />
        </span>
      </button>

      {isOpen && (
        <div
          dir="rtl"
          className="absolute top-full mt-1 w-full bg-white8 rounded-lg z-20 border border-gray21 text-black0 shadow-md"
        >
          {options.map((option) => (
            <div
              key={option.value}
           onClick={() => {onSelect(id, option);onToggle(id); }}
              className={`px-4 py-2 cursor-pointer hover:bg-blue16 ${
                option.value === selected?.value
                  ? "bg-blue16 font-medium"
                  : ""
              }`}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
