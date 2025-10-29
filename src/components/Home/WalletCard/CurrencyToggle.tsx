import { useState, FC } from "react";
import TetherIcon from "../../../assets/icons/Home/WalletCardIcon/TetherIcon";
import TomanIcon from "../../../assets/icons/Home/WalletCardIcon/TomanIcon";

type Currency = "tether" | "toman";
interface Props {
  onChange?: (value: Currency) => void;
}

const CurrencyToggle: FC<Props> = ({ onChange }) => {
  const [selected, setSelected] = useState<Currency>("toman");
  const handleSelect = (value: Currency) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="flex gap-2 rounded-lg border p-1 w-fit bg-backgroundMain2 border-gray19">
      <button
        onClick={() => handleSelect("tether")}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition text-[10px] lg:text-sm
          ${selected === "tether" ? "bg-blue-500 text-white1 font-medium" : "bg-transparent text-black1 font-normal"}`}
      >
        <span>تتر</span>
        <span className="w-4 h-4  rounded-sm inline-block"><TetherIcon /></span>
      </button>
      <button
        onClick={() => handleSelect("toman")}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition text-[10px] lg:text-sm
          ${selected === "toman" ? "bg-blue-500 text-white1 font-medium" : "bg-transparent text-black1 font-normal"}`}
      >
        <span>تومان</span>
        <span className="w-4 h-4  rounded-sm inline-block "><TomanIcon /></span>
      </button>
    </div>
  );
};

export default CurrencyToggle;
