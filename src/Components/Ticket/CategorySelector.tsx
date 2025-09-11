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
    
<div className="grid grid-cols-2 gap-4 lg:flex lg:gap-4">
  {options.map((option) => (
    <button
      key={option.id}
      onClick={() => handleClick(option.id)}
      className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border border-gray26 transition-all
        ${
          active === option.id
            ? "border-blue2 text-blue2 bg-gray27"
            : "text-gray-700 bg-gray27"
        }`}
    >
      <div className="mb-2 text-2xl w-8 h-8 text-black1">{option.icon}</div>
      <span className="text-sm font-medium text-black1">{option.label}</span>
    </button>
  ))}
</div>


  );
};

export default OptionSelector;
