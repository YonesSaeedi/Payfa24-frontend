import { useState, FC } from "react";

interface FloatingTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
  placeholderColor?: string;
}

const FloatingTextarea: FC<FloatingTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
  placeholderColor = "placeholder-black0",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <label
        className={`absolute right-3 top-2 px-1 text-xs z-10 duration-200
          ${isFocused || value ? "-translate-y-3 text-xs" : "text-gray12"}
          ${isFocused ? "text-blue2" : "text-gray12"} bg-gray43`}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`block w-full px-3 pt-5 pb-3 border border-gray12 rounded-md bg-gray43 text-black0
          focus:outline-none focus:ring-0 focus:border-blue2 resize-none ${className} ${placeholderColor}`}
      />
    </div>
  );
};

export default FloatingTextarea;
