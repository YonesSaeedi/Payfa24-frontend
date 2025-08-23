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
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition
          ${selected === "tether" ? "bg-blue-500 text-gray12" : "bg-transparent"}`}
      >
       
        <span className="w-4 h-4 rounded-sm inline-block text-gray12"><TetherIcon/></span>
        <span className="text-gray12">تتر</span>
      </button>

      <button
        onClick={() => handleSelect("toman")}
        className={`flex items-center gap-1 px-3 py-1 rounded-md transition
          ${selected === "toman" ? "bg-blue-500 text-white2" : "bg-transparent"}`}
      >
      
       <span>تومان</span>
        <span className="w-4 h-4  rounded-sm inline-block text-white2"><TomanIcon/></span>
       
      </button>
    </div>
  );
};

export default CurrencyToggle;
