import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ICryptoItem } from "../Components/Market/types";
import HeaderFooterLayout from "../layouts/HeaderFooterLayout";
import CryptoMarketTable from "../Components/Market/CryptoMarketTable";
import CryptoBox from "../Components/Market/CryptoBox";
import VectorUp from "../assets/icons/market/CryptoBox/VectorUpIcon";
import VectorDown from "../assets/icons/market/CryptoBox/VectorDownIcon";
import FireTopIcon from "../assets/icons/market/CryptoBox/FireTopIcon";
import useGetGeneralInfo from "../hooks/useGetGeneralInfo";

// 🟢 تایپ API اول
interface ApiCrypto {
  id: number;
  symbol: string;
  name: string;
  icon: string;
  color: string;
  percent: number;
  deposit: boolean;
  withdraw: boolean;
  sort: number;
  sell_status: boolean;
  buy_status: boolean;
  isFont: boolean;
  isDisable: boolean;
  locale?: {
    fa?: { name: string };
    en?: { name: string };
  };
}

interface ApiResponseGeneral {
  cryptocurrency: ApiCrypto[];
  application: {
    update: boolean;
  };
}

// 🟢 تایپ API دوم
interface ApiCryptoPrice {
  symbol: string;
  priceBuy: string;
  priceSell: string;
  fee: string;
  quoteVolume: string;
  priceChangePercent: string;
  isDisable: boolean;
}

interface ApiResponseList {
  count: number;
  list: ApiCryptoPrice[];
}

function MarketPage() {
  const [activeTab, setActiveTab] = useState(0);

  // // ⚙️ تابع کمکی برای درخواست API
  // const fetchList = async (params: string) => {
  //   const res = await fetch(`/api/list-cryptocurrencies${params}`);
  //   if (!res.ok) throw new Error("Failed to fetch data");
  //   return res.json();
  // };

  // // 📡 درخواست‌های API با react-query
  // const { data: generalData, isLoading: loadingGeneral } = useQuery<ApiResponseGeneral>({
  //   queryKey: ["general-info"],
  //   queryFn: async () => {
  //     const res = await fetch("/api/get-general-info");
  //     if (!res.ok) throw new Error("Failed to fetch general info");
  //     return res.json();
  //   },
  // });

  // const { data: listData, isLoading: loadingList } = useQuery<ApiResponseList>({
  //   queryKey: ["list-cryptos"],
  //   queryFn: () => fetchList(""),
  // });

  // const { data: gainersData, isLoading: loadingGainers } = useQuery<ApiResponseList>({
  //   queryKey: ["list-cryptos", "gainers"],
  //   queryFn: () => fetchList("?sort=4&limit=5"),
  // });

  // const { data: losersData, isLoading: loadingLosers } = useQuery<ApiResponseList>({
  //   queryKey: ["list-cryptos", "losers"],
  //   queryFn: () => fetchList("?sort=5&limit=5"),
  // });

  // const { data: newestData, isLoading: loadingNewest } = useQuery<ApiResponseList>({
  //   queryKey: ["list-cryptos", "newest"],
  //   queryFn: () => fetchList("?sort=6&limit=5"),
  // });
  // console.log("fetchList",fetchList);
  

  const {data:generalData,isLoading:isGeneralDataLoading}= useGetGeneralInfo()


  // ⚡ وضعیت کلی لود شدن
  const isLoadingAll =
    loadingGeneral || loadingList || loadingGainers || loadingLosers || loadingNewest;

  // 🧩 تابع ساخت آیکن‌ها
  // const renderIcon = useCallback(
  //   (symbol: string, generalItem?: ApiCrypto) => {
  //     if (generalItem?.isFont) {
  //       return (
  //         <i
  //           className={`cf cf-${symbol.toLowerCase()}`}
  //           style={{ color: generalItem?.color || "#000", fontSize: "24px" }}
  //         ></i>
  //       );
  //     }
  //     return (
  //       <img
  //         src={
  //           generalItem?.icon
  //             ? `https://api.payfa24.org/images/currency/${generalItem.icon}`
  //             : "/default-coin.png"
  //         }
  //         alt={symbol}
  //         className="w-6 h-6 rounded-full"
  //         onError={(e) => {
  //           (e.currentTarget as HTMLImageElement).src = "/default-coin.png";
  //         }}
  //       />
  //     );
  //   },
  //   []
  // );
const renderIcon = useCallback(
  (symbol: string, generalItem?: ApiCrypto) => {
    if (generalItem?.isFont) {
      // آیکن فونت
      return (
        <i
          className={`cf cf-${symbol.toLowerCase()}`}
          style={{ color: generalItem.color || "#000", fontSize: "24px" }}
        ></i>
      );
    }

    // آیکن تصویر
    const iconUrl = generalItem?.icon
      ? `https://api.payfa24.org/images/currency/${generalItem.icon}`
      : "/default-coin.png";

    return (
      <img
        src={iconUrl}
        alt={symbol}
        className="w-6 h-6 rounded-full object-contain"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/default-coin.png";
        }}
      />
    );
  },
  []
);



  // 📊 داده‌های جدول اصلی
  const cryptoData: ICryptoItem[] = useMemo(() => {
    if (!listData?.list || !generalData?.cryptocurrency) return [];

    return listData.list.map((item) => {
      const generalItem = generalData.cryptocurrency.find(
        (g) => g.symbol === item.symbol
      );

      return {
        symbol: item.symbol,
       name: generalItem?.locale?.fa?.name || generalItem?.name || item.symbol,
        locale: {
          fa: generalItem?.locale?.fa?.name,
          en: generalItem?.locale?.en?.name,
        },
        icon: renderIcon(item.symbol, generalItem),
        priceUSDT: Number(item.priceBuy),
        buyPrice: Number(item.priceBuy),
        sellPrice: Number(item.priceSell),
        change24h: Number(item.priceChangePercent),
        volume: Number(item.quoteVolume),
        isNew: !!generalItem?.sort,
        favorite: false,
      };
    });
  }, [listData, generalData, renderIcon]);

  // 📦 داده‌های CryptoBox (تابع ثابت)
  // const mapToCryptoBoxItems = useCallback(
  //   (list?: ApiCryptoPrice[]) =>
  //     list?.map((item) => {
  //       const generalItem = generalData?.cryptocurrency.find(
  //         (g) => g.symbol === item.symbol
  //       );
  //       const changeValue = parseFloat(item.priceChangePercent);

  //       return {
  //         name: generalItem?.locale?.fa?.name || generalItem?.name || item.symbol,
  //         symbol: item.symbol,
  //         icon: renderIcon(item.symbol, generalItem),
  //         buyPrice: Number(item.priceBuy),
  //         change: `${changeValue.toFixed(2)}%`,
  //         isPositive: changeValue >= 0,
  //       };
  //     }) ?? [],
  //   [generalData, renderIcon]
  // );
const mapToCryptoBoxItems = useCallback(
  (list?: ApiCryptoPrice[]) =>
    list?.map((item) => {
      const generalItem = generalData?.cryptocurrency.find(
        (g) => g.symbol === item.symbol
      );
      const changeValue = parseFloat(item.priceChangePercent);

      return {
        name: generalItem?.locale?.fa?.name || generalItem?.name || item.symbol,
        symbol: item.symbol,
        icon: renderIcon(item.symbol, generalItem),
        buyPrice: Number(item.priceBuy),
        change: `${changeValue.toFixed(2)}%`,
        isPositive: changeValue >= 0,
      };
    }) ?? [],
  [generalData, renderIcon]
);



  // 📄 JSX خروجی
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

          {/* 📦 باکس‌های بالای صفحه */}
          <div className="hidden lg:flex gap-6 justify-start flex-row-reverse">
            <CryptoBox
              title="بیشترین رشد"
              iconTop={<VectorUp />}
              items={mapToCryptoBoxItems(gainersData?.list)}
              isLoading={loadingGainers}
            />
            <CryptoBox
              title="بیشترین افت"
              iconTop={<VectorDown />}
              items={mapToCryptoBoxItems(losersData?.list)}
              isLoading={loadingGainers}
            />
            <CryptoBox
              title="جدیدترین‌ها"
              iconTop={<FireTopIcon />}
              items={mapToCryptoBoxItems(newestData?.list)}
              isLoading={loadingGainers}
            />
          </div>

          {/* 📈 جدول بازار */}
          <div className="pb-[87px]">
            <CryptoMarketTable
  data={cryptoData}
  active={activeTab}
  setActive={setActiveTab}
  isLoading={isLoadingAll}
/>

          </div>
        </div>
      </HeaderFooterLayout>
    </div>
  );
}

export default MarketPage;
