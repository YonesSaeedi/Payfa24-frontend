import { useState, FC, ChangeEvent } from "react";

interface FloatingInputProps {
  label: string;
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  placeholderColor?: string;
}

const FloatingInput: FC<FloatingInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "گزینه‌ای را انتخاب کنید",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div dir="rtl" className="relative w-full">
      <label
        className={`
        absolute right-3 text-xs -top-2 px-1 duration-200 z-40 lg:bg-gray43 bg-gray38
        ${isFocused ? "text-blue2" : "text-gray12"}
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
        className="block w-full px-3 py-4 border border-gray12 rounded-md z-10 
         focus:outline-none focus:ring-0 focus:border-blue2 lg:bg-gray43 bg-gray38 text-black0"
// =======
//         placeholder={placeholder}
//         className={`
//           block w-full px-3 ${heightClass} border rounded-md z-10
//           focus:outline-none focus:ring-0 focus:border-blue2 lg:bg-gray43 bg-gray38 
//           ${borderClass} ${placeholderColor ? `placeholder-${placeholderColor}` : "placeholder-black0"}  ${className}`}
// >>>>>>> c971315d41958ac5ee50ccac869db7626dfcdc5d
      />
    </div>
  );
};

export default FloatingInput;


