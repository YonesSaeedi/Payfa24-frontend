import React, { forwardRef, useContext, useState } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

interface TextFieldProps {
  label: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      type = "text",
      error,
      icon,
      onIconClick,
      className = "",
      value,
      onChange,
      onBlur,
      name,
    },
    ref
  ) => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("ThemeContext is undefined");
    const { theme } = context;

    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;

    const inputId = name;

    const borderColorClass = hasError
      ? "border-[var(--error)]"
      : isFocused || value
      ? "border-[var(--primary)]"
      : "border-[var(--border-primary)]";

    const labelStyleClass =
      isFocused || value
        ? `top-[-12px] text-sm ${
            hasError ? "text-[var(--error)]" : "text-primary"
          } ${
            theme === "dark" ? "bg-[var(--extra-dark-background)]" : "bg-white"
          }`
        : "top-1/2 -translate-y-1/2 text-[14px] text-[var(--text-gray)] bg-transparent";

    return (
      <div
        className={`relative mb-2 lg:w-[392px] w-[343px] box-border ${className}`}
      >
        <input
          id={inputId}
          type={type}
          className={`w-full h-[56px] rounded-xl border px-4 pt-3 pb-1 text-[14px] font-normal transition-all duration-200 focus:outline-none ${
            theme === "dark" ? "bg-[var(--extra-dark-background)]" : "bg-white"
          } ${borderColorClass} ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
          style={{ paddingLeft: icon ? "2rem" : "1rem" }}
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
        />
        {icon && (
          <span
            onClick={onIconClick}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer h-5 w-5"
          >
            <span className="icon-wrapper h-5 w-5">{icon}</span>
          </span>
        )}
        <label
          htmlFor={inputId}
          className={`absolute right-3 transition-all duration-200 pointer-events-none px-1 ${labelStyleClass}`}
        >
          {label}
        </label>
      </div>
    );
  }
);

export default TextField;
