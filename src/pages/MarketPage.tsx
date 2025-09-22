
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import  {ICryptoItem} from "../Components/Market/CryptoBox";
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
  price: string;
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
  console.log('general info =>', generalData)

  const { data: listData, isLoading: loadingList } = useQuery<ApiResponseList>({
    queryKey: ["list-cryptos"],
    queryFn: async () => {
      const res = await fetch("/api/list-cryptocurrencies");
      if (!res.ok) throw new Error("Failed to fetch list cryptos");
      return res.json();
    },
  });

  // 📌 ترکیب داده‌ها
 const cryptoData: ICryptoItem[] =
  generalData?.cryptocurrency.map((item) => {
    const match = listData?.list.find((c) => c.symbol === item.symbol);

    return {
      name: item.name,
      symbol: item.symbol,
      icon: item.icon || undefined,
      priceUSDT: match ? parseFloat(match.price) : 0, // مقدار پیش‌فرض
      buyPrice: match ? parseFloat(match.price) : 0,
      sellPrice: match ? parseFloat(match.price) : 0,
      change24h: match ? parseFloat(match.priceChangePercent) : item.percent ?? 0,
      volume: match ? parseFloat(match.quoteVolume) : 0,
      isNew: false,
    };
  }) || [];


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

          {/* باکس‌های بالای صفحه */}
          <div className="hidden lg:flex gap-6 justify-start flex-row-reverse">
            <CryptoBox title="بیشترین افت" iconTop={<VectorDown />} items={[]} />
            <CryptoBox title="بیشترین رشد" iconTop={<VectorUp />} items={[]} />
            <CryptoBox title="جدیدترین‌ها" iconTop={<FireTopIcon />} items={[]} />
          </div>

          {/* جدول اصلی */}
          <div className="pb-[126px]">
            {loadingGeneral || loadingList ? (
              <p className="text-center text-gray-500">در حال بارگذاری...</p>
            ) : (
              <CryptoMarketTable
                data={cryptoData}
                active={activeTab}
                setActive={setActiveTab}
              />
            )}
          </div>
        </div>
      </HeaderFooterLayout>
    </div>
  );
}

export default MarketPage;
