import { ReactNode } from "react";

/* Type definition for a single cryptocurrency item.*/
type Item = {
                  
  name: string;             
  symbol: string;        
  icon: ReactNode;       
  price: string;        
  change: string;       
  isPositive: boolean;
};

/*Props for the CryptoBox component.*/
type CryptoBoxProps = {
  title: string;
  iconTop: ReactNode;
  items: Item[];
};

export default function CryptoBox({ title, iconTop, items }: CryptoBoxProps) {
  return (
    <div className="bg-gray27 rounded-2xl p-4 w-full h-[359px]">
      {/* Header Section */}
      <div className="flex items-center justify-end mb-4">
        <h2 className="font-bold text-black1 pr-2">{title}</h2>
        <span className="text-blue-500 bg-blue13 w-[40px] h-[40px] rounded-[8px] inline-flex items-center justify-center">
          <span className="w-[20px] h-[20px] icon-wrapper">{iconTop}</span>
        </span>
      </div>

      {/* Items Grid */}
      <ul className="grid grid-cols-3 gap-y-2 pt-2" dir="rtl">
        {items.map((item, index) => (
          <li key={`${item.symbol}-${index}`} className="contents">
            {/* Icon + Name + Symbol */}
            <div className="flex items-center gap-2">
              <span className="w-[34px] h-[34px]">{item.renderIcon}</span>
              <div className="flex flex-col text-right leading-tight">
    <span className="text-black1 mb-2 font-normal text-base whitespace-nowrap">
  {item.name.length > 10 ? item.name.substring(0, 10) + "..." : item.name}
</span>


                <span className="text-xs text-gray12 uppercase">
                  {item.symbol}
                </span>
              </div>
            </div>

            {/* Price */}
          {/* Price */}
{/* Price */}
<div className="flex justify-center w-[150px] pt-2">
  <span className="text-gray5 tabular-nums ">
    {item.buyPrice.toLocaleString()}
  </span>
  <span className="text-gray5 text-sm pr-1">تومان</span>
</div>



            {/* Change (positive or negative) */}
<div className="w-full flex justify-end">
  <span
    className={`rounded-md text-xs font-bold w-[68px] h-[30px] mt-2 flex items-center justify-center px-2 ${
      item.isPositive
        ? "bg-green9 text-green-600"
        : "bg-red7 text-red-600"
    }`}
  >
    {item.change}
  </span>
</div>



          </li>
        ))}
      </ul>
    </div>
  );
}
