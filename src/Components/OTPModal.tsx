import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../Context/ThemeContext";

interface OTPInputProps {
  length?: number;
  onChange?: (code: string) => void;
}

export default function OTPModal({ length = 5, onChange }: OTPInputProps) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>, idx: number) => {
    const input = e.target as HTMLInputElement;
    const val = input.value.replace(/[^0-9]/g, ""); 
    if (!val) return;

    const newValues = [...values];
    newValues[idx] = val[0] || ""; 
    setValues(newValues);
    onChange?.(newValues.join(""));


    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    } else if (val && idx === length - 1) {
      input.blur(); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div
      className="flex justify-center gap-2 items-center lg:w-[384px] w-[296px] lg:mt-8 lg:mb-12 mt-6 mb-8"
      dir="ltr" 
    >
      {values.map((val, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          value={val}
          onInput={(e) => handleInput(e, idx)} 
          onKeyDown={(e) => handleKeyDown(e, idx)}
          maxLength={1}
          className={`lg:w-[67px] lg:h-[71px] w-[44px] h-[46px] text-center flex justify-center items-center border border-gray12 rounded-lg text-lg ${
            theme === "dark" ? "bg-white8 text-black0" : "bg-white8 text-gray12"
          }`}
          inputMode="numeric" 
        />
      ))}
    </div>
  );
}