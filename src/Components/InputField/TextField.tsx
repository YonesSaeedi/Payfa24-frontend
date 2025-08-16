import React, { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

interface TextFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  error,
  onFocus,
  onBlur,
  focused,
  icon,
  onIconClick,
}: TextFieldProps) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const inputId = `input-${label.replace(/\s/g, "-")}`;

  return (
    <div className="relative mb-2 w-[343px] lg:w-[392px]">
      <input
        id={inputId}
        type={type}
        placeholder=""
        className={`w-full h-[56px] rounded-xl border px-4 pt-3 pb-1 text-[14px] font-normal transition-all duration-200 focus:outline-none
          ${
            theme === "dark"
              ? "bg-[var(--extra-dark-background)]"
              : "bg-white"
          }
          ${
            error
              ? "border-[var(--error)] text-[var(--error)]"
              : focused || value
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-[var(--border-primary)] text-[var(--primary)]"
          }
          focus:border-[var(--primary)]`}
        style={{ paddingLeft: icon ? "2rem" : "1rem" }} 
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
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
        className={`absolute right-3 transition-all duration-200 pointer-events-none px-1
          ${
            focused || value || error
              ? `top-[-12px] text-sm ${
                  error ? "text-[var(--error)]" : "text-primary"
                } ${
                  theme === "dark"
                    ? "bg-[var(--extra-dark-background)]"
                    : "bg-white"
                }`
              : "top-1/2 -translate-y-1/2 text-[14px] text-[var(--text-gray)] bg-transparent"
          }`}
      >
        {label}
      </label>
    </div>
  );
}