import { ReactNode } from "react";

type Item = {
  name: string;
  symbol: string; 
  icon: ReactNode;
  price: string;
  change: string;
  isPositive: boolean;

};

type CryptoBoxProps = {
  title: string;
    iconTop: React.ReactNode;
  items: Item[];
};

export default function CryptoBox({ title, items,iconTop }: CryptoBoxProps) {
  return (
<div className="bg-gray27 rounded-2xl p-4 w-full h-[359px]">

  <div className="flex items-center justify-end mb-4">
    <h2 className="font-bold text-black1 pr-2">{title}</h2>
    <span className="text-blue-500 bg-blue13 w-[40px] h-[40px] rounded-[8px]  text-center inline-flex items-center justify-center">
      <span className=" w-[20px] h-[20px] icon-wrapper ">{iconTop}</span></span>
  </div>


  <ul className="grid grid-cols-3 gap-y-2 pt-2" dir="rtl">
    {items.map((item) => (
      <>
  
        <div  className="flex items-center gap-2">
          <span className="w-[34px] h-[34px]">{item.icon}</span>
          <div className="flex flex-col text-right leading-tight">
            <span className="text-black1 mb-2">{item.name}</span>
            <span className="text-xs text-gray12 uppercase">{item.symbol}</span>
          </div>
        </div>

        <span className="text-gray5 tabular-nums text-center justify-center pt-2">
          {item.price}
        </span>

  
        <span
          className={` rounded-md text-xs font-bold text-center w-[68px] h-[30px] justify-self-end mt-2  flex items-center justify-center ${
            item.isPositive
              ? "bg-green9 text-green-600"
              : "bg-red7 text-red-600"
          }`}
        >
          {item.change}
        </span>
      </>
    ))}
  </ul>
</div>



  );
}
