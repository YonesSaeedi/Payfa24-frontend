// components/FloatingInput.tsx
import { useState, FC, ChangeEvent } from "react";

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const FloatingInput: FC<FloatingInputProps> = ({ label, value, onChange, type = "text" }) => {
  const [isFocused, setIsFocused] = useState(false);

  const shouldFloat = isFocused || value;

  return (
    <div dir="rtl" className="relative w-full ">
      <input
        dir="rtl"
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" " 
        className="peer block w-full px-3 py-4 border rounded-md  border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      />
      <label
        className={`absolute right-3 text-gray-400 transition-all duration-200 
          ${shouldFloat ? "text-xs -top-2 bg-gray-50 px-1" : "text-base top-5"}`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
