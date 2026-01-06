// import { useState, FC } from "react";
// import TetherIcon from "../../../assets/icons/Home/WalletCardIcon/TetherIcon";
// import TomanIcon from "../../../assets/icons/Home/WalletCardIcon/TomanIcon";

// type Currency = "tether" | "toman";
// interface Props {
//   onChange?: (value: Currency) => void;
// }

// const CurrencyToggle: FC<Props> = ({ onChange }) => {
//   const [selected, setSelected] = useState<Currency>("toman");
//   const handleSelect = (value: Currency) => {
//     setSelected(value);
//     if (onChange) onChange(value);
//   };

//   return (
//     <div className="flex gap-2 rounded-lg border p-1 w-fit bg-backgroundMain2 border-gray19">
//       <button
//         onClick={() => handleSelect("tether")}
//         className={`flex items-center gap-1 px-3 py-1 rounded transition text-[10px] lg:text-sm
//           ${selected === "tether" ? "bg-blue-500 text-white font-medium" : "bg-transparent text-gray12 font-normal"}`}
//       >
//         <span className="font-normal  text-sm">تتر</span>
//         <span className="w-[18px] h-[18px]  rounded-sm inline-block"><TetherIcon /></span>
//       </button>
//       <button
//         onClick={() => handleSelect("toman")}
//         className={`flex items-center gap-1 px-3 py-1 rounded-md transition text-[10px] lg:text-sm
//           ${selected === "toman" ? "bg-blue-500 text-white font-medium" : "bg-transparent text-gray12 font-normal"}`}
//       >
//         <span className="font-normal  text-sm">تومان</span>
//         <span className="w-[18px] h-[17px]  rounded-sm inline-block "><TomanIcon /></span>
//       </button>
//     </div>
//   );
// };

// export default CurrencyToggle;
import { useState, FC } from "react";

interface ToggleOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface Props {
  options?: ToggleOption[];
  defaultValue?: string;
  showIcons?: boolean;
  onChange?: (value: string) => void;
}

const CurrencyToggle: FC<Props> = ({
  options = [],
  defaultValue,
  showIcons = true,
  onChange
}) => {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="flex gap-2 rounded-lg border p-1 lg:w-fit w-fit bg-backgroundMain2 border-gray19">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSelect(opt.value)}
          className={`flex items-center gap-1 px-3 py-1 rounded transition text-[10px] lg:text-sm
            ${selected === opt.value ? "bg-blue-500 text-white font-medium" : "bg-transparent text-gray12 font-normal"}`}
        >
          <span className="lg:text-sm text-xs">{opt.label}</span>
          {showIcons && opt.icon && (
            <span className="w-[18px] h-[18px] inline-block">{opt.icon}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CurrencyToggle;
