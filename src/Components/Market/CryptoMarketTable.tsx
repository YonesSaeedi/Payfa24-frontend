import React from "react";
import IconSearch from "../../assets/icons/market/IconSearch";
import IconStar from "../../assets/icons/market/IconStar";

interface CryptoItem {
  name: string;
  symbol: string;
  priceUSDT: number;
  buyPrice: number;
  sellPrice: number;
  change24h: number;
  logo: React.ReactElement;
}

type TabType = "همه" | "بیشترین معامله"  | "تازه‌های بازار" | "مورد علاقه ها" | "پرضررترین" | "پرسودترین";

interface Props {
  data: CryptoItem[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const CryptoMarketTable: React.FC<Props> = ({ data, active, setActive }) => {
  const tabs: TabType[] = [
    "همه",
    "مورد علاقه ها",
    "پرضررترین",
    "پرسودترین",
    "بیشترین معامله",
     "تازه‌های بازار",
  ];

  return (
  <div className="w-full flex flex-col gap-6 lg:mt-16">

  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    <div className="w-full lg:w-1/3 relative">
      <input
        type="text"
        placeholder="...جستجو"
        className="w-full lg:w-[319px] h-[40px] border border-gray19 rounded-lg px-4 lg:py-2 pr-11 text-sm outline-none focus:ring-2 focus:ring-blue-400 text-right bg-white1"
      />
      <span className="absolute inset-y-0 lg:right-[125px] flex items-center pointer-events-none w-5 h-5 text-gray-400 top-[8px] right-[20px]">
        <IconSearch />
      </span>
    </div>

    <div className="hidden lg:flex items-center gap-2 text-sm flex-row-reverse pr-8">
      <button className="px-4 py-1.5 rounded-lg border bg-gray36 border-gray12 text-gray5 hover:bg-blue14 hover:text-blue2 hover:border-blue2 transition">
        همه
      </button>
      <button className="px-4 py-1.5 rounded-lg border bg-gray36 border-gray12 text-gray5 hover:bg-blue14 hover:text-blue2 hover:border-blue2 transition">
        مورد علاقه ها
      </button>
      <button className="px-4 py-1.5 rounded-lg border bg-gray36 border-gray12 text-gray5 hover:bg-blue14 hover:text-blue2 hover:border-blue2 transition">
        دارایی ها
      </button>
    </div>
  </div>


  <div className="bg-white1 rounded-2xl shadow border border-gray21 overflow-hidden">
    <div className="flex flex-row-reverse gap-4 text-sm text-gray24 px-4 pt-8">
      {tabs.map((tab, index) => (
        <span
          key={index}
          onClick={() => setActive(index)}
          className={`cursor-pointer pb-2 mr-12${
            active === index
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-black1"
          }`}
        >
          {tab}
        </span>
      ))}
    </div>

    <div className="px-6 mt-6">
      <table dir="rtl" className="w-full text-right border-collapse table-fixed">
        <thead>
          <tr className="bg-gray0 text-black1 text-sm rounded-md">
   
            <th className="py-3 text-center rounded-tr-lg rounded-br-lg">
              نام و نماد ارز
            </th>
      
            <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
    
            <th className="py-3 px-4">قیمت خرید</th>
          
            <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
         
            <th className="py-3 px-4 text-center">تغییرات ۲۴h</th>
   
            <th className="py-3 px-4 rounded-tl-lg rounded-bl-lg hidden lg:table-cell"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray21 hover:bg-gray0 text-sm last:border-b-0"
            >
         
              <td className="py-3 px-4 flex items-center gap-3 pr-8">
                <span className="w-[22px] h-[22px] text-gray12">
                  <IconStar />
                </span>
                <span className="h-9 w-9 rounded-full flex items-center justify-center">
                  {item.logo}
                </span>
                <div>
                  <div className="font-medium text-black1">{item.name}</div>
                  <span className="text-xs text-gray-500">{item.symbol}</span>
                </div>
              </td>

              <td className="py-3 px-4 text-black1 hidden lg:table-cell">
                USDT {item.priceUSDT.toLocaleString()}
              </td>

              <td className="py-3 px-4 text-black1">
                تومان {item.buyPrice.toLocaleString()}
              </td>

         
              <td className="py-3 px-4 text-black1 hidden lg:table-cell">
                تومان {item.sellPrice.toLocaleString()}
              </td>

  
              <td className="py-3 px-4 text-center">
                <span
                  className={`${
                    item.change24h >= 0 ? "text-green4" : "text-red1"
                  }`}
                >
                  {item.change24h >= 0 ? "+" : ""}
                  {item.change24h}%
                </span>
              </td>

 
              <td className="py-3 px-4 text-end hidden lg:table-cell">
                <button className="bg-blue-600 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-blue-700 transition">
                  خرید/فروش
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  <div dir='rtl' className="flex justify-center items-center gap-2 mt-2 text-sm">
    {[1, 2, 3, "...", 12].map((num, idx) => (
      <button dir='rtl'
        key={idx}
        className={`px-3 py-1 rounded-md ${
          num === 1
            ? "bg-blue-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {num}
      </button>
    ))}
  </div>
</div>

  );
};

export default CryptoMarketTable;
