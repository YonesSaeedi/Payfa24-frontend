import React from "react";
import ArrowLeftIcon from "../Icons/Home/CryptoTable/ArrowLeftIcon"; 
interface CryptoItem {
  name: string;
  symbol: string;
  priceUSDT: number;
  buyPrice: number;
  sellPrice: number;
  change24h: number;
  logo: React.ReactElement;
}

type TabType = "همه" | "بیشترین معامله" | "پربازدیدترین" | "تازه‌های بازار";

interface Props {
  data: CryptoItem[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const CryptoTable: React.FC<Props> = ({ data, active, setActive }) => {
  const tabs: TabType[] = ["همه", "بیشترین معامله", "پربازدیدترین", "تازه‌های بازار"];

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow">
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center gap-2 px-3 py-1 rounded-xl text-sm text-primary ml-2 ">
          <span className="w-4 h-4 text-primary mr-2 rounded"><ArrowLeftIcon/></span>
          همه ارزها
        </button>

        <h2 className="text-xl font-bold flex items-center gap-2">
          بازار پی‌فا ۲۴
        </h2>
      </div>

      <div className="flex flex-row-reverse gap-4 text-sm mb-4">
        {tabs.map((tab, index) => (
          <span
            key={index}
            onClick={() => setActive(index)}
            className={`cursor-pointer pb-1 ${
              active === index
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* ===== Body ===== */}
      <table dir="rtl" className="w-full text-right">
        <thead className="rounded-md">
          <tr className="bg-gray-100 text-gray-600 rounded-md text-center">
            <th className="py-3 px-4">نام و نماد ارز</th>
            <th className="py-3 px-4">قیمت خرید</th>
            <th className="py-3 px-4">تغییرات ۲۴h</th>
            <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
            <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
            <th className="py-3 px-4 hidden lg:table-cell"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 last:border-b-0 text-center"
            >
              <td className="py-3 px-4 flex items-center gap-2 justify-center">
                <div className="min-w-[28px] h-[28px] flex items-center justify-center shrink-0">
    {item.logo}
  </div>
              
                <div>
                  <div className="font-medium text-center">{item.name}</div>
                  <div className="text-xs text-gray-500 text-center">{item.symbol}</div>
                </div>
              </td>

              <td className="py-3 px-4">
                تومان {item.buyPrice.toLocaleString()}
              </td>

              <td className="py-3 px-4">
                <span
                  className={
                    item.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {item.change24h}%
                </span>
              </td>

              {/* hidden in sm/md */}
              <td className="py-3 px-4 hidden lg:table-cell">
                USDT {item.priceUSDT.toLocaleString()}
              </td>
              <td className="py-3 px-4 hidden lg:table-cell">
                تومان {item.sellPrice.toLocaleString()}
              </td>
              <td className="py-3 px-4 hidden lg:table-cell">
                <button className="bg-blue-500 text-white rounded-lg px-4 py-1.5 text-sm">
                  خرید/فروش
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
