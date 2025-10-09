// import { useState, useMemo } from "react";
// import HeaderFooterLayout from "../layouts/HeaderFooterLayout";
// import CryptoMarketTable from "../Components/Market/CryptoMarketTable";
// import CryptoBox from "../Components/Market/CryptoBox";
// import VectorUp from "../assets/icons/market/CryptoBox/VectorUpIcon";
// import VectorDown from "../assets/icons/market/CryptoBox/VectorDownIcon";
// import FireTopIcon from "../assets/icons/market/CryptoBox/FireTopIcon";
// import useGetGeneralInfo from "../hooks/useGetGeneralInfo";
// import {ICryptoItem,IGeneralCryptoItem,IGeneralData} from "../Components/Market/types";
// import { CryptoItem } from "../types/crypto";
// import useGetCryptoData from "../hooks/useGetCryptoData";
// import useGetTopCryptos from "../hooks/useGetTopCryptos";

// // تبدیل داده‌ها برای CryptoBox
// const mapToCryptoBoxItems = (data: CryptoItem[], generalData: IGeneralData) => {
//   return data.map((item) => {
//     const generalItem = generalData.cryptocurrency.find(
//       (g: IGeneralCryptoItem) => g.symbol === item.symbol
//     );

//     const icon = generalItem?.isFont ? (
//       <i
//         className={`cf cf-${item.symbol.toLowerCase()}`}
//         style={{ color: generalItem.color || "#000", fontSize: 24 }}
//       />
//     ) : (
//       <img
//         src={
//           generalItem?.icon
//             ? `https://api.payfa24.org/images/currency/${generalItem.icon}`
//             : "/default-coin.png"
//         }
//         alt={item.symbol}
//         className="w-6 h-6 rounded-full object-contain"
//         onError={(e) =>
//           ((e.currentTarget as HTMLImageElement).src = "/default-coin.png")
//         }
//       />
//     );

//     const changeValue = parseFloat(item.priceChangePercent ?? "0");

//     return {
//       name: generalItem?.locale?.fa?.name || generalItem?.name || item.symbol,
//       symbol: item.symbol,
//       icon,
//       buyPrice: Number(item.priceBuy),
//       change: `${changeValue.toFixed(2)}%`,
//       isPositive: changeValue >= 0,
//     };
//   });
// };

// function MarketPage() {
//   const [activeTab, setActiveTab] = useState(0);
//   // const { data: generalData, isLoading: loadingGeneral } = useGetGeneralInfo();
//   // const { data: cryptoDataRecord, isLoading: loadingCrypto } =
//   //   useGetCryptoData();

//   // گرفتن ۵ ارز برتر برای هر بخش
//   const { data: gainers, isLoading: loadingGainers } = useGetTopCryptos(5);
//   const { data: losers, isLoading: loadingLosers } = useGetTopCryptos(4);
//   const { data: newest, isLoading: loadingNewest } = useGetTopCryptos(6);

//   // const cryptoData: ICryptoItem[] = useMemo(() => {
//   //   if (!cryptoDataRecord || !generalData?.cryptocurrency) return [];

//   //   return Object.values(cryptoDataRecord).map((item) => {
//   //     const generalItem = generalData.cryptocurrency.find(
//   //       (g: IGeneralCryptoItem) => g.symbol === item.symbol
//   //     );

//   //     const icon = generalItem?.isFont ? (
//   //       <i
//   //         className={`cf cf-${item.symbol.toLowerCase()}`}
//   //         style={{ color: generalItem.color || "#000", fontSize: 24 }}
//   //       />
//   //     ) : (
//   //       <img
//   //         src={
//   //           generalItem?.icon
//   //             ? `https://api.payfa24.org/images/currency/${generalItem.icon}`
//   //             : "/default-coin.png"
//   //         }
//   //         alt={item.symbol}
//   //         className="w-6 h-6 rounded-full object-contain"
//   //         onError={(e) =>
//   //           ((e.currentTarget as HTMLImageElement).src = "/default-coin.png")
//   //         }
//   //       />
//   //     );

//   //     return {
//   //       symbol: item.symbol,
//   //       name: generalItem?.locale?.fa?.name || generalItem?.name || item.symbol,
//   //       locale: {
//   //         fa: generalItem?.locale?.fa?.name,
//   //         en: generalItem?.locale?.en?.name,
//   //       },
//   //       icon,
//   //       priceUSDT: Number(item.priceBuy),
//   //       buyPrice: Number(item.priceBuy),
//   //       sellPrice: Number(item.priceSell),
//   //       change24h: Number(item.priceChangePercent ?? 0),
//   //       volume: Number(item.quoteVolume),
//   //       isNew: !!generalItem?.sort,
//   //       favorite: false,
//   //     };
//   //   });
//   // }, [cryptoDataRecord, generalData]);

//   return (
//     <div className="bg-white1">
//       <HeaderFooterLayout>
//         <div className="container-style mx-auto">
//           <div className="text-right mt-[24px] lg:mt-[57px] mb-[24px]">
//             <h1 className="hidden lg:block font-bold text-2xl text-black1">
//               قیمت ارزهای دیجیتال
//             </h1>
//             <h1 className="block lg:hidden font-bold text-2xl text-black1">
//               قیمت لحظه‌ای ارزهای دیجیتال
//             </h1>
//           </div>

//           {/* 📦 باکس‌ها */}
//           <div className="hidden lg:flex gap-6 justify-start flex-row-reverse">
//             <CryptoBox
//               title="بیشترین رشد"
//               iconTop={<VectorUp />}
//               items={
//                 gainers && generalData
//                   ? mapToCryptoBoxItems(gainers, generalData)
//                   : []
//               }
//               isLoading={loadingGainers}
//             />
//             <CryptoBox
//               title="بیشترین افت"
//               iconTop={<VectorDown />}
//               items={
//                 losers && generalData
//                   ? mapToCryptoBoxItems(losers, generalData)
//                   : []
//               }
//               isLoading={loadingLosers}
//             />
//             <CryptoBox
//               title="جدیدترین‌ها"
//               iconTop={<FireTopIcon />}
//               items={
//                 newest && generalData
//                   ? mapToCryptoBoxItems(newest, generalData)
//                   : []
//               }
//               isLoading={loadingNewest}
//             />
//           </div>

//           {/* 📈 جدول بازار */}
//           <div className="pb-[87px]">
//             <CryptoMarketTable
//               data={cryptoData}
//               active={activeTab}
//               setActive={setActiveTab}
//               isLoading={loadingGeneral || loadingCrypto}
//             />
//           </div>
//         </div>
//       </HeaderFooterLayout>
//     </div>
//   );
// }

// export default MarketPage;



import { useMemo, useState } from "react";
import HeaderFooterLayout from "../layouts/HeaderFooterLayout";
import CryptoMarketTable from "../Components/Market/CryptoMarketTable";
import CryptoBox from "../Components/Market/CryptoBox";
import VectorUp from "../assets/icons/market/CryptoBox/VectorUpIcon";
import VectorDown from "../assets/icons/market/CryptoBox/VectorDownIcon";
import FireTopIcon from "../assets/icons/market/CryptoBox/FireTopIcon";
import useMergedCryptoData from "../hooks/useMergedCryptoData";
import { ICryptoItem } from "../Components/Market/types";

function MarketPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: mergedData, isLoading } = useMergedCryptoData();
  console.log(mergedData);
  

  const cryptoData: ICryptoItem[] = useMemo(() => {
    return Object.values(mergedData || {}).map((item: any) => ({
      symbol: item.symbol,
      name: item.locale?.fa?.name || item.name || item.symbol,
      locale: {
        fa: item.locale?.fa?.name || item.name || item.symbol,
        en: item.locale?.en?.name || item.name || item.symbol,
      },
      icon: item.isFont ? (
        <i
          className={`cf cf-${item.symbol.toLowerCase()}`}
          style={{ color: item.color, fontSize: 24 }}
        ></i>
      ) : (
        <img
          src={
            item.icon
              ? `https://api.payfa24.org/images/currency/${item.icon}`
              : "/default-coin.png"
          }
          alt={item.symbol}
          className="w-6 h-6 rounded-full object-contain"
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).src = "/default-coin.png")
          }
        />
      ),
      priceUSDT: Number(item.priceBuy) || 0,
      buyPrice: Number(item.priceBuy) || 0,
      sellPrice: Number(item.priceSell) || 0,
      change24h: Number(item.priceChangePercent ?? 0),
      volume: Number(item.quoteVolume) || 0,
      isNew: !!item?.sort,
      favorite: false,
      isFont: item.isFont,
      color: item.color,
    }));
  }, [mergedData]);

  const gainers = useMemo(
    () =>
      [...cryptoData].sort((a, b) => b.change24h - a.change24h).slice(0, 5),
    [cryptoData]
  );

  const losers = useMemo(
    () =>
      [...cryptoData].sort((a, b) => a.change24h - b.change24h).slice(0, 4),
    [cryptoData]
  );

  const newest = useMemo(
    () => [...cryptoData].filter((c) => c.isNew).slice(0, 6),
    [cryptoData]
  );

  return (
    <div className="bg-white1">
      <HeaderFooterLayout>
        <div className="container-style mx-auto">
          <div className="text-right mt-[24px] lg:mt-[57px] mb-[24px]">
            <h1 className="hidden lg:block font-bold text-2xl text-black1">
              قیمت ارزهای دیجیتال
            </h1>
            <h1 className="block lg:hidden font-bold text-2xl text-black1">
              قیمت لحظه‌ای ارزهای دیجیتال
            </h1>
          </div>

          {/* 📦 CryptoBox‌ها */}
          <div className="hidden lg:flex gap-6 justify-start flex-row-reverse">
            <CryptoBox
              title="بیشترین رشد"
              iconTop={<VectorUp />}
              items={gainers.map((c) => ({
                name: c.name,
                symbol: c.symbol,
                icon: c.icon,
                buyPrice: c.buyPrice,
                change: `${c.change24h.toFixed(2)}%`,
                isPositive: c.change24h >= 0,
              }))}
              isLoading={isLoading}
            />

            <CryptoBox
              title="بیشترین افت"
              iconTop={<VectorDown />}
              items={losers.map((c) => ({
                name: c.name,
                symbol: c.symbol,
                icon: c.icon,
                buyPrice: c.buyPrice,
                change: `${c.change24h.toFixed(2)}%`,
                isPositive: c.change24h >= 0,
              }))}
              isLoading={isLoading}
            />

            <CryptoBox
              title="جدیدترین‌ها"
              iconTop={<FireTopIcon />}
              items={newest.map((c) => ({
                name: c.name,
                symbol: c.symbol,
                icon: c.icon,
                buyPrice: c.buyPrice,
                change: `${c.change24h.toFixed(2)}%`,
                isPositive: c.change24h >= 0,
              }))}
              isLoading={isLoading}
            />
          </div>

          {/* 📈 جدول بازار */}
          <div className="pb-[87px]">
            <CryptoMarketTable
              data={cryptoData}
              active={activeTab}
              setActive={setActiveTab}
              isLoading={isLoading}
            />
          </div>
        </div>
      </HeaderFooterLayout>
    </div>
  );
}

export default MarketPage;
