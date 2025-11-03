import React, { useState } from "react";

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface OptionSelectorProps {
  options: Option[];
  onSelect?: (id: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, onSelect }) => {
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:flex lg:gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleClick(option.id)}
          className={`group flex flex-col items-center justify-center w-full h-28 rounded-xl border transition-all duration-200
           ${active === option.id ? "border-blue2 text-blue2 bg-gray27" : "border-gray26 text-black1 bg-gray27 hover:border-blue2 hover:shadow-md"}`}>
          <div className={`mb-2 text-2xl w-8 h-8 transition-colors ${active === option.id ? "text-blue2" : "text-black1"}group-hover:text-blue2`}>
            {option.icon}
          </div>
          <span className={`text-sm font-medium transition-colors ${active === option.id ? "text-blue2" : "text-black1"} group-hover:text-blue2`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default OptionSelector; 
