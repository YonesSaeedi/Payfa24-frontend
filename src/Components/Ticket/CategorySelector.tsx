import React, { useState } from "react";

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode; 
}
interface OptionSelectorProps {
  options: Option[];
  defaultActive?: string;
  onSelect?: (id: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  defaultActive,
  onSelect,
}) => {
  const [active, setActive] = useState(defaultActive || options[0].id);

  const handleClick = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleClick(option.id)}
          className={`flex flex-col items-center justify-center w-32 h-28 rounded-xl border transition-all
            ${
              active === option.id
                ? "border-blue2 text-blue2 bg-white"
                : "border-gray-200 text-gray-700 bg-gray-50 hover:border-blue-300"
            }`}
        >
          
          <div className="mb-2 text-3xl w-8 h-8 "><span className="text-blue2"></span>{option.icon}</div>
          <span className="text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;

