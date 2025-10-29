// import React, { forwardRef, useContext, useState } from "react";
// import { ThemeContext } from "../../Context/ThemeContext";

// interface TextFieldProps {
//   label: string;
//   type?: string;
//   error?: string;
//   icon?: React.ReactNode;
//   onIconClick?: () => void;
//   className?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
//   name: string;
//   labelClassName?: string;
//   labelStyle?: React.CSSProperties;
//   labelBgClass?: string;
//   inputBgClass?: string;
//   placeholder?: string; // اضافه کردن پراپس placeholder
//   [key: string]: any;
// }

// const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
//   (
//     {
//       label,
//       type = "text",
//       error,
//       icon,
//       onIconClick,
//       className = "",
//       value,
//       onChange,
//       onBlur,
//       name,
//       labelBgClass,
//       inputBgClass,
//       placeholder, // استفاده از placeholder
//     },
//     ref
//   ) => {
//     const context = useContext(ThemeContext);
//     if (!context) throw new Error("ThemeContext is undefined");
//     const { theme } = context;

//     const [isFocused, setIsFocused] = useState(false);
//     const hasError = !!error;

//     const inputId = name;

//     const borderColorClass = hasError
//       ? "border-red1"
//       : isFocused
//       ? "border-blue2"
//       : value
//       ? "border-blue2"
//       : "border-gray5";

//     const labelStyleClass =
//       isFocused || value
//         ? `top-[-12px] right-[13px] text-sm ${
//             hasError ? "text-red1" : "text-blue2"
//           } ${labelBgClass || ""}`
//         : "top-1/2 -translate-y-1/2 text-xs text-gray5 bg-transparent";

//     return (
//       <div className={`relative mb-4 box-border w-full ${className}`}>
//         <input
//           dir="rtl"
//           id={inputId}
//           type={type}
//           className={`
//             w-full lg:h-[56px] h-[48px] rounded-xl border px-4  text-[14px] font-normal transition-all duration-200 focus:outline-none
//             ${inputBgClass || (theme === "dark" ? "bg-transparent text-black2" : "bg-white4 text-gray12")}
//             ${borderColorClass}
//           `}
//           style={{ paddingLeft: icon ? "2.5rem" : "1rem" }}
//           ref={ref}
//           value={value}
//           onChange={onChange}
//           onBlur={(e) => {
//             setIsFocused(false);
//             onBlur(e);
//           }}
//           onFocus={() => setIsFocused(true)}
//           placeholder={placeholder} // اضافه کردن placeholder به input
//         />

//         {icon && (
//           <span
//             onClick={onIconClick}
//             className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer h-5 w-5"
//           >
//             <span className="icon-wrapper h-5 w-5">{icon}</span>
//           </span>
//         )}

//         <label
//           htmlFor={inputId}
//           className={`absolute right-3 transition-all duration-200 pointer-events-none px-1 ${labelStyleClass}`}
//         >
//           {label}
//         </label>

//         {hasError && (
//           <p className="text-red1 text-xs mt-2 pr-3" dir="rtl">
//             {error}
//           </p>
//         )}
//       </div>
//     );
//   }
// );

// export default TextField;



import React, { forwardRef, useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

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
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  labelBgClass?: string; // ✅ رنگ بک‌گراند لیبل از بیرون
   inputBgClass?: string;   // ✅  داخل اضافه کردن برای بک‌گراند input
   labelStyleClass?: string
  placeholder?: string;
  showError?: boolean; // باید بولی باشه
  [key: string]: any;

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
      labelBgClass,
      inputBgClass,
      placeholder,
      showError = false, // پیش‌فرض false
    },
    ref
  ) => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("ThemeContext is undefined");
    const { theme } = context;

    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error; // برای border و لیبل

    const inputId = name;

    const borderColorClass = hasError
      ? "border-red1"
      : isFocused
      ? "border-blue2"
      : value
      ? "border-blue2"
      : "border-gray5";

    const labelStyleClass =
      isFocused || value || hasError
        ? `top-[-12px] right-[13px] lg:text-sm text-xs ${hasError ? "text-red1" : "text-blue2"} ${
            labelBgClass || ""
          }`
        : "top-1/2 -translate-y-1/2 text-xs text-gray5 bg-transparent";

   

    return (
      <div className={`relative mb-4 box-border w-full ${className}`}>
        <input
          dir="rtl"
          id={inputId}
          type={type}

          className={`w-full lg:h-[56px] h-[48px] rounded-xl border px-4  pb-1 text-sm font-normal transition-all duration-200 focus:outline-none 
    ${theme === "dark" ? "bg-transparent text-black2" : " text-gray12"} 
    ${borderColorClass} 
    ${inputBgClass || ""}   // ✅ اضافه کردن کلاس بک‌گراند
  `}
          style={{ paddingLeft: icon ? "2rem" : "1rem" }}


          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
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

        {showError && error && ( // متن خطا فقط با showError true و وقتی error وجود داره
          <p className="text-red1 text-xs mt-2 pr-3" dir="rtl">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default TextField;