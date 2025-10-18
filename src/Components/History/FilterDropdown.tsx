import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  id: string;
  label: string;
  options: string[];
  selected: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string, value: string) => void;
  className?: string;
  absolute?: boolean;
  withBorder?: boolean;
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
  absolute,
  withBorder
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {

        if (isOpen) {
          onToggle(id);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, id, onToggle]);

  return (
    <div ref={dropdownRef} className={`relative text-sm  ${className || "w-44"}`}>
      <button
        onClick={() => onToggle(id)}
        className="flex justify-between items-center w-full px-3 py-2 border border-gray20 rounded-lg bg-white1  text-black0"
      >
        <span dir="rtl" className="justify-start">{selected || label}</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 justify-end ${isOpen ? "rotate-180" : ""} `}
        />
      </button>

      {isOpen && (
        <div
          dir="rtl"
          className={`absolute top-full mt-1 w-full bg-white8 rounded-lg z-20  border border-gray12 text-black0`}
        >
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(id, option)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue16 ${option === selected ? "hover:bg-blue16 font-medium" : ""
                } `}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
