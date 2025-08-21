import React from "react";
import Validation from "./../../../public/images/validation.png";
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
  onClick,
}) => {
  return (
    <div className="border rounded-xl p-6 flex items-center justify-between">
      {/* Image placeholder */}
      <div className=" rounded-lg flex items-center justify-center">
        <span>
          <img src={Validation} />
        </span>
      </div>

      <div className="w-1/2 flex flex-col gap-2 text-right">
        {/* <img/> */}
        <h2 className="text-xl font-semibold">{title}</h2>
        <ul className="list-disc pr-4">
          {items.map((item, index) => (
            <li key={index} className="list-none">
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-2 font-medium">دسترسی‌ ها :</span>
        <ul dir="rtl" className="list-disc list-inside pr-4">
          {accesses.map((a, index) => (
            <li key={index}>{a}</li>
          ))}
        </ul>
        <Link to={"/authentication"}>
          <button
            onClick={onClick}
            className="mt-4 bg-blue-500 text-white rounded-lg py-2 px-12 w-fit self-end"
          >
            احراز هویت
          </button>
        </Link>
      </div>
    </div>
  );
};

export default IdentityCard;
