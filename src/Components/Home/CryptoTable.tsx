import React from "react";
import ArrowLeftIcon from "../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";


interface CryptoItem {
  name: string;
  symbol: string;
  priceUSDT: number;
  buyPrice: number;
  sellPrice: number;
  change24h: number;
  logo: React.ReactElement;
}

type TabType = "همه" | "بیشترین معامله" | "پر ضررترین" | "پر سودترین" | "تازه های بازار";

interface Props {
  data: CryptoItem[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const CryptoTable: React.FC<Props> = ({ data, active, setActive }) => {
  const tabs: TabType[] = [
    "همه",
    "بیشترین معامله",
    "پر ضررترین" ,
     "پر سودترین" ,
     "تازه های بازار"
  ];

  return (
    <div className="w-full bg-backgroundMain rounded-2xl p-4 shadow border border-gray21 overflow-hidden">
     
      <div className="flex justify-between items-center border-gray21 mb-6">
        <button className="flex items-center gap-2 px-3 py-1 rounded-xl text-sm text-blue2 ml-2 text-center">
          <span className="w-4 h-4 text-blue2  rounded">
            <ArrowLeftIcon />
          </span>
          همه ارزها
        </button>

        <h2 className="text-xl font-bold flex items-center gap-2 text- text-black1">
          بازار پی‌فا ۲۴
        </h2>
      </div>

    
      <div className="flex flex-row-reverse  text-sm mb-4">
        {tabs.map((tab, index) => (
          <span
            key={index}
            onClick={() => setActive(index)}
            className={`cursor-pointer pb-1  text-gray3 mr-7 ${
              active === index
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-grey1"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      
      <table
        dir="rtl"
        className="w-full text-right border border-gray21 border-collapse rounded-lg overflow-hidden"
      >
        <thead>
          <tr className="bg-gray32 text-black1 text-text">
            <th className="py-3 px-4">نام و نماد ارز</th>
            <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
            <th className="py-3 px-4">قیمت فروش</th>
            <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
            <th className="py-3 px-4 text-center">تغییرات ۲۴h</th>
            <th className="py-3 px-4 hidden lg:table-cell"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray21 last:border-b-0 hover:bg-background text-right"
            >
              <td className="py-3 px-4 flex items-start gap-2 justify-start ">
                <span className="h-[42px] w-[42px]">
                        {item.logo}
                </span>
          
                <div>
                 
                  <div
                    className="font-medium text-center text-black1 truncate max-w-[120px]"
                    title={item.name}
                  >
                    {item.name}
                  </div>
                  <span className="text-xs text-gray12 text-center p-2 ">
                    {item.symbol}
                  </span>
                </div>
              </td>

              <td className="py-3 px-4 hidden lg:table-cell text-black1">
                USDT {item.priceUSDT.toLocaleString()}
              </td>

              <td className="py-3 px-4 text-black1">
                تومان {item.buyPrice.toLocaleString()}
              </td>

              <td className="py-3 px-4 hidden lg:table-cell text-black1">
                تومان {item.sellPrice.toLocaleString()}
              </td>

              <td className="py-3 px-4 text-center text-black1">
                <span
                  className={
                    item.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {item.change24h}%
                </span>
              </td>

              <td className="py-3 px-4 hidden lg:table-cell text-end text-black1">
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React from "react";

// interface CryptoItem {
//   name: string;
//   symbol: string;
//   priceUSDT: number;
//   buyPrice: number;
//   sellPrice: number;
//   change24h: number;
//   logo: React.ReactElement;
//   volume?: number;
// }

// type TabType = "همه" | "بیشترین معامله" | "پر ضررترین" | "پر سودترین" | "تازه‌های بازار";

// interface Props {
//   data: CryptoItem[];
//   active: number;
//   setActive: React.Dispatch<React.SetStateAction<number>>;
// }

// const CryptoTable: React.FC<Props> = ({ data, active, setActive }) => {
//   const tabs: TabType[] = [
//     "همه",
//     "بیشترین معامله",
//     "پر ضررترین",
//     "پر سودترین",
//     "تازه‌های بازار",
//   ];

//   // فیلتر کردن داده‌ها بر اساس تب فعال
//   const filteredData = data.filter(item => {
//     if (active === 0) return true; // همه
//     if (active === 1) return item.volume && item.volume > 0; // بیشترین معامله
//     if (active === 2) return item.change24h < 0; // پر ضررترین
//     if (active === 3) return item.change24h > 0; // پر سودترین
//     if (active === 4) return item.change24h !== undefined; // تازه‌های بازار (می‌توانید شرط دلخواه بگذارید)
//     return true;
//   }).sort((a, b) => {
//     if (active === 1) return (b.volume || 0) - (a.volume || 0); // مرتب‌سازی بیشترین معامله
//     if (active === 2) return a.change24h - b.change24h; // پر ضررترین
//     if (active === 3) return b.change24h - a.change24h; // پر سودترین
//     return 0;
//   });

//   return (
//     <div className="w-full bg-backgroundMain rounded-2xl p-4 shadow border border-gray21 overflow-hidden">
//       <div className="flex justify-between items-center border-gray21 mb-6">
//         <button className="flex items-center gap-2 px-3 py-1 rounded-xl text-sm text-blue2 ml-2 text-center">
//           همه ارزها
//         </button>

//         <h2 className="text-xl font-bold flex items-center gap-2 text-black1">
//           بازار پی‌فا ۲۴
//         </h2>
//       </div>

//       <div className="flex flex-row-reverse gap-4 text-sm mb-4">
//         {tabs.map((tab, index) => (
//           <span
//             key={index}
//             onClick={() => setActive(index)}
//             className={`cursor-pointer pb-1 ${
//               active === index
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-grey1"
//             }`}
//           >
//             {tab}
//           </span>
//         ))}
//       </div>

//       <table
//         dir="rtl"
//         className="w-full text-right border border-gray21 border-collapse rounded-lg overflow-hidden"
//       >
//         <thead>
//           <tr className="bg-gray32 text-black1 text-text">
//             <th className="py-3 px-4">نام و نماد ارز</th>
//             <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
//             <th className="py-3 px-4">قیمت خرید</th>
//             <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
//             <th className="py-3 px-4 text-center">تغییرات ۲۴h</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredData.map((item, index) => (
//             <tr
//               key={index}
//               className="border-b border-gray21 last:border-b-0 hover:bg-background text-right"
//             >
//               <td className="py-3 px-4 flex items-start gap-2 justify-start">
//                 <span className="h-[42px] w-[42px]">{item.logo}</span>
//                 <div>
//                   <div
//                     className="font-medium text-center text-black1 truncate max-w-[120px]"
//                     title={item.name}
//                   >
//                     {item.name}
//                   </div>
//                   <span className="text-xs text-gray12 text-center p-2">
//                     {item.symbol}
//                   </span>
//                 </div>
//               </td>

//               <td className="py-3 px-4 hidden lg:table-cell text-black1">
//                 USDT {item.priceUSDT.toLocaleString()}
//               </td>

//               <td className="py-3 px-4 text-black1">
//                 تومان {item.buyPrice.toLocaleString()}
//               </td>

//               <td className="py-3 px-4 hidden lg:table-cell text-black1">
//                 تومان {item.sellPrice.toLocaleString()}
//               </td>

//               <td className="py-3 px-4 text-center text-black1">
//                 <span
//                   className={item.change24h >= 0 ? "text-green-500" : "text-red-500"}
//                 >
//                   {item.change24h}%
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CryptoTable;

