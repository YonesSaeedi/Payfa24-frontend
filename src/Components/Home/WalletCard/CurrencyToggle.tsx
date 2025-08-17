import { useState, FC } from "react";
import TetherIcon from "../../Icons/Home/WalletCard/TetherIcon";
import TomanIcon from "../../Icons/Home/WalletCard/TomanIcon";

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
    <div className="flex gap-2 rounded-xl border p-1 w-fit bg-white">

      <button
        onClick={() => handleSelect("tether")}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition
          ${selected === "tether" ? "bg-blue-500" : "bg-transparent"}`}
      >
       
        <span className="w-4 h-4 rounded-sm inline-block"><TetherIcon/></span>
        <span>تتر</span>
      </button>

      <button
        onClick={() => handleSelect("toman")}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition
          ${selected === "toman" ? "bg-blue-500 text-white" : "bg-transparent"}`}
      >
      
        <span className="w-4 h-4  rounded-sm inline-block"><TomanIcon/></span>
        <span>تومان</span>
      </button>
    </div>
  );
};

export default CurrencyToggle;
