import { useState, FC } from "react";

interface FloatingInputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  placeholderColor?: string;
   labelClassName?: string;
}

const FloatingInput: FC<FloatingInputProps> = ({ label, value, onChange, type = "text", placeholder = "گزینه‌ای را انتخاب کنید", className ,labelClassName}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div dir="rtl" className="relative w-full">
      <label
        className={`
        absolute right-3 text-xs -top-2 px-1 duration-200 z-40 lg:bg-gray43 bg-gray38
        ${isFocused ? "text-blue2" : "text-gray12"} ${labelClassName ? labelClassName : "lg:bg-gray43 bg-gray38"}
      `}
      >
        {label}
      </label>
      <input
        dir="rtl"
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={` ${className} block w-full px-3 lg:h-[56px] h-[48px] border border-gray12 rounded-lg z-10 
         focus:outline-none focus:ring-0 focus:border-blue2 lg:bg-gray43 bg-gray38 text-black0`}
         
      />
    </div>
  );
};

export default FloatingInput;
