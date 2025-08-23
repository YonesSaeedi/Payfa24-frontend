import React from "react";
import ValidationlightIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2 (1).png";
import ValidationDarkIcon from "./../../assets/images/Home/ValidationIcon/402384808_1bcd8fe0-5c1f-4e2b-9729-fddbb4cab579 2.png";
import ArrowLeftIcon from "../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";
import { Link } from "react-router";

interface IdentityCardProps {
  title: string;
  items: string[];
  accesses: string[];
  onClick: () => void;
}

const IdentityCard: React.FC<IdentityCardProps> = ({
  title,
  items,
  accesses,

}) => {
  return (
    <div className="border rounded-xl p-6 flex items-center justify-between  border-gray21 shadow">
      {/* Image placeholder */}
      <div className=" rounded-lg flex items-center justify-center ">
        <img src={ValidationlightIcon} className="block dark:hidden" />

        <img src={ValidationDarkIcon} className="hidden dark:block" />
      </div>

      <div className="w-1/2 flex flex-col gap-2 text-right">
        {/* <img/> */}
        <h2 className="text-xl font-semibold text-blue2 pb-4">{title}</h2>
        <ul className="list-disc pr-4 text-black1">
          {items.map((item, index) => (
            <li key={index} className="list-none">
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-2 font-medium text-gray5">: دسترسی‌ ها </span>
        <ul dir="rtl" className="list-disc list-inside pr-4 text-black1">
          {accesses.map((a, index) => (
            <li key={index}>{a}</li>
          ))}
        </ul>

        <Link to="/authentication" className="font-sans mt-4 bg-blue-500 text-white rounded-lg w-[198px] h-[40px] self-end flex items-center justify-center">
          <span className="pr-2 flex  w-8 h-8 ">
            <ArrowLeftIcon />
          </span>
          احراز هویت
        </Link>
      </div>
    </div>
  );
};

export default IdentityCard;
