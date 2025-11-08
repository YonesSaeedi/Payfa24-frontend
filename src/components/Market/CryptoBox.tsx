import { ReactNode } from "react";
import { formatPersianDigits } from "../../utils/formatPersianDigits";

type Item = {
  name: string;
  symbol: string;
  buyPrice: number;
  change: number;
  isPositive: boolean;
  icon: React.ReactNode;
};

type CryptoBoxProps = {
  title: string;
  iconTop: ReactNode;
  items: Item[];
  isLoading?: boolean;
};

export default function CryptoBox({ title, iconTop, items, isLoading = false }: CryptoBoxProps) {
  const skeletonArray = Array.from({ length: 6 });

  return (
    <div className="bg-gray27 rounded-2xl p-4 w-full h-[359px]">
      <div className="flex items-center justify-end mb-4">
        <h2 className="font-bold text-black1 pr-2">{title}</h2>
        <span className="text-blue-500 bg-blue13 w-[40px] h-[40px] rounded-[8px] inline-flex items-center justify-center">
          <span className="w-[20px] h-[20px] icon-wrapper">{iconTop}</span>
        </span>
      </div>

      <ul className="grid grid-cols-3 gap-y-2 pt-2" dir="rtl">
        {isLoading
          ? skeletonArray.map((_, i) => (
              <li key={i} className="contents animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-[34px] h-[34px] skeleton-bg rounded-full"></div>
                  <div className="flex flex-col text-right leading-tight">
                    <div className="h-3 w-16 skeleton-bg rounded mb-1"></div>
                    <div className="h-3 w-10 skeleton-bg rounded"></div>
                  </div>
                </div>

                <div className="flex justify-center w-[150px] pt-2">
                  <div className="h-3 w-16 skeleton-bg rounded"></div>
                </div>

                <div className="w-full flex justify-end">
                  <div className="h-6 w-[68px] skeleton-bg rounded mt-2"></div>
                </div>
              </li>
            ))
          : items.map((item, index) => (
              <li key={`${item.symbol}-${index}`} className="contents">
                <div className="flex items-center gap-2">
                  <span className="w-[34px] h-[34px] flex items-center justify-center">{item.icon}</span>
                  <div className="flex flex-col text-right leading-tight">
                    <span className="text-black1 mb-1/2 font-normal text-base whitespace-nowrap">{item.name.length > 10 ? item.name.substring(0, 10) + "..." : item.name}</span>
                    <span className="text-xs text-gray12 uppercase">{item.symbol}</span>
                  </div>
                </div>

                <div className="flex justify-center w-[150px] pt-2">
                  <span className="text-gray5 tabular-nums">{formatPersianDigits(item.buyPrice.toLocaleString())}</span>
                  <span className="text-gray5 text-sm pr-1">تومان</span>
                </div>

                <div className="w-full flex justify-end">
                  <span
                    className={`rounded-md text-xs font-bold w-[68px] h-[30px] mt-2 flex items-center justify-center px-2 ${
                      item.isPositive ? "bg-green9 text-green-600" : "bg-red7 text-red-600"
                    }`}
                  >
                    {formatPersianDigits(Math.abs(item.change).toFixed(2))}%{item.isPositive ? "+" : "-"}
                  </span>
                </div>
              </li>
            ))}
      </ul>
    </div>
  );
}
