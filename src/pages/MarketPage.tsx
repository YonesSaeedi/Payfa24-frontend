import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ICryptoItem } from "../Components/Market/types"; 
import HeaderFooterLayout from "../layouts/HeaderFooterLayout";
import CryptoBox from "../Components/Market/CryptoBox";
import CryptoMarketTable from "../Components/Market/CryptoMarketTable";
import VectorDown from "../assets/icons/market/CryptoBox/VectorDownIcon";
import VectorUp from "../assets/icons/market/CryptoBox/VectorUpIcon";
import FireTopIcon from "../assets/icons/market/CryptoBox/FireTopIcon";

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
  priceSell:string
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

  // 📌 گرفتن داده از دو API
  const { data: generalData, isLoading: loadingGeneral } = useQuery<ApiResponseGeneral>({
    queryKey: ["general-info"],
    queryFn: async () => {
      const res = await fetch("/api/get-general-info");
      if (!res.ok) throw new Error("Failed to fetch general info");
      return res.json();
    },
  });

  const { data: listData, isLoading: loadingList } = useQuery<ApiResponseList>({
    queryKey: ["list-cryptos"],
    queryFn: async () => {
      const res = await fetch("/api/list-cryptocurrencies");
      if (!res.ok) throw new Error("Failed to fetch list cryptos");
      return res.json();
    },
  });

  console.log("listData",listData);
  



const cryptoData: ICryptoItem[] =
  listData?.list.map((item) => {
    const generalItem = generalData?.cryptocurrency.find(
      (g) => g.symbol === item.symbol
    );

    // 📌 آیکون
    const renderIcon = generalItem?.isFont ? (
      <i
        className={`cf cf-${item.symbol.toLowerCase()}`}
        style={{ color: generalItem?.color || "#000", fontSize: "24px" }}
      ></i>
    ) : (
      <img
        src={
          generalItem?.icon
            ? `https://api.payfa24.org/images/currency/${generalItem.icon}`
            : "/default-coin.png"
        }
        alt={item.symbol}
        className="w-6 h-6 rounded-full"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/default-coin.png";
        }}
      />
    );

    return {
      symbol: item.symbol,
      name:generalItem?.locale?.fa?.name || generalItem?.name ,
      locale: {
        fa: generalItem?.locale?.fa?.name,
        en: generalItem?.locale?.en?.name,
      },
      icon: renderIcon,

      priceUSDT: Number(item.priceBuy),
      buyPrice: Number(item.priceBuy),
      sellPrice: Number(item.priceSell),
      change24h: Number(item.priceChangePercent),
      volume: Number(item.quoteVolume),

      isNew: !!generalItem?.sort, // شرطی برای جدید بودن
      favorite: false,
    };
  }) ?? [];

      console.log("cryptoData",cryptoData);


  // ✅ آماده‌سازی دیتا برای باکس‌های بالا
  const losers = [...cryptoData]
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 5);

  const gainers = [...cryptoData]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 5);

 const newest = [...cryptoData]
  .sort((a, b) => b.sort - a.sort) // جدیدترین بر اساس sort
  .slice(0, 5);


  return (
    <div className="bg-white1">
      <HeaderFooterLayout>
        <div className="container-style mx-auto">
          {/* تیتر صفحه */}
          <div className="text-right mt-[24px] lg:mt-[57px] mb-[24px]">
            <h1 className="hidden lg:block font-bold text-2xl text-black1">
              قیمت ارزهای دیجیتال
            </h1>
            <h1 className="block lg:hidden font-bold text-2xl text-black1">
              قیمت لحظه‌ای ارزهای دیجیتال
            </h1>
          </div>

          {/* 📊 باکس‌های بالای صفحه */}
          <div className="hidden lg:flex gap-6 justify-start flex-row-reverse">
            <CryptoBox title="بیشترین افت" iconTop={<VectorDown />} items={losers} />
            <CryptoBox title="بیشترین رشد" iconTop={<VectorUp />} items={gainers} />
            <CryptoBox title="جدیدترین‌ها" iconTop={<FireTopIcon />} items={newest} />
          </div>

          {/* 📋 جدول اصلی */}
        <div className="pb-[87px]">
  <CryptoMarketTable
    data={cryptoData}
    active={activeTab}
    setActive={setActiveTab}
    isLoading={loadingGeneral || loadingList} // 🟢 پرچم لودینگ پاس داده بشه
  />
</div>

        </div>
      </HeaderFooterLayout>
    </div>
  );
}

export default MarketPage;
