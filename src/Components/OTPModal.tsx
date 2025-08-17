import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../Context/ThemeContext";
useContext;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newValues = [...values];
    newValues[idx] = val[0];
    setValues(newValues);
    onChange?.(newValues.join(""));

    if (idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 items-center lg:w-[384px] w-[296px] lg:mt-8 lg:mb-12 mt-6 mb-8 ">
      {values.map((val, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          value={val}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          maxLength={1}
          className={`lg:w-[67px] lg:h-[71px] w-[44px] h-[46px] text-center flex justify-center items-center border border-[var(--border-primary)] rounded-lg text-lg ${
            theme === "dark" ? "bg-[var(--background)]" : "bg-[var(--info)]"
          }`}
        />
      ))}
    </div>
  );
}
