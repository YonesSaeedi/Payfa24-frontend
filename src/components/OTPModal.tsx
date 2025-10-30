import { useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  onChange?: (code: string) => void;
}

export default function OTPModal({ length = 5, onChange }: OTPInputProps) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  // handleInput ===========================================================================================================
  const handleInput = (e: React.FormEvent<HTMLInputElement>, idx: number) => {
    const input = e.target as HTMLInputElement;
    const val = input.value.replace(/[^0-9]/g, "");
    const newValues = [...values];
    newValues[idx] = val[0] || "";
    setValues(newValues);
    onChange?.(newValues.join(""));
    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };
  // handle key down ======================================================================================================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (values[idx]) {
        const newValues = [...values];
        newValues[idx] = "";
        setValues(newValues);
        onChange?.(newValues.join(""));
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        const newValues = [...values];
        newValues[idx - 1] = "";
        setValues(newValues);
        onChange?.(newValues.join(""));
      }
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 items-center lg:mt-8 lg:mb-12 mt-6 mb-8" dir="ltr">
      {values.map((val, idx) => (
        <input
          key={idx}
          ref={el => { inputsRef.current[idx] = el }} // the function assigned to ref={} here, must not return anything. that's why we've used {} instead of ()
          type="text"
          value={val}
          onInput={(e) => handleInput(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          maxLength={1}
          className='lg:w-[63px] lg:h-[63px] w-[48px] h-[48px] text-center flex justify-center items-center border border-gray12 outline-blue2 rounded-lg text-lg bg-white8 text-black0'
          inputMode="numeric"
        />
      ))}
    </div>
  );
}
