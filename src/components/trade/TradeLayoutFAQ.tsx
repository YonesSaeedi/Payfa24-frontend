
import { useState } from "react";
import IconMinus from "../../assets/icons/trade/IconMinus";
import IconPlus from "../../assets/icons/trade/IconPlus";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface TradeLayoutFAQProps {
  items: FAQItem[];
  isFixedHeightMobile?: boolean;
  isFixedHeightDesktop?: boolean;
  fixedHeightMobile?: string;
  fixedHeightDesktop?: string;
}
const TradeLayoutFAQ: React.FC<TradeLayoutFAQProps> = ({ items, isFixedHeightMobile = true, isFixedHeightDesktop = true, fixedHeightDesktop = 'lg:h-20', fixedHeightMobile = 'h-14' }) => {
// isFixedHeightMobile & isFixedHeightDesktop specify if height of the question box must be fixed or not (so the container wont expand and collapse)
// and fixedHeightDesktop fixedHeightMobile specify desired heights
  const [openQuestionID, setOpenQuestionID] = useState<number>(items[0].id);
  const toggleOpenQuestionID = (dataID: number) => {
    if (dataID === openQuestionID) return;
    setOpenQuestionID(dataID);
  };

  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      {items.map((data) => (
        <div
          onClick={() => toggleOpenQuestionID(data.id)}
          key={data.id}
          className={`lg:py-5 lg:px-6 px-4 py-3.5 flex flex-col border border-gray21 rounded-[10px] cursor-pointer ${data.id === openQuestionID ? "" : "overflow-hidden"}`}
        >
          <div className={`flex items-center justify-between ${data.id === openQuestionID ? "border-b border-borderSecondary lg:pb-4 pb-3" : ""}`}>
            <p className="font-normal text-sm lg:text-base xl:text-lg text-black1">{data.question}</p>
            <span className="icon-wrapper w-6 h-6 lg:w-7 lg:h-7 text-blue2">{data.id === openQuestionID ? <IconMinus /> : <IconPlus />}</span>
          </div>
          <p
            className={`text-xs lg:text-sm xl:text-base font-normal text-gray5 transition-all duration-300 ease-out ${data.id === openQuestionID
              ? `${isFixedHeightMobile ? fixedHeightMobile : ''} ${isFixedHeightDesktop ? fixedHeightDesktop : 'lg:h-auto'} h-0 opacity-100 mt-3 lg:mt-4`
              : `h-0 opacity-0 mt-0 lg:mt-0`
              }`}
          >
            {data.answer}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TradeLayoutFAQ;
