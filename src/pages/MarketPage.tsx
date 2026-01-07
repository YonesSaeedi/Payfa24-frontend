import { useMemo, useState } from "react";
import FireTopIcon from "../assets/icons/market/CryptoBox/FireTopIcon";
import VectorDown from "../assets/icons/market/CryptoBox/VectorDownIcon";
import VectorUp from "../assets/icons/market/CryptoBox/VectorUpIcon";
import CryptoBox from "../components/Market/CryptoBox";
import CryptoMarketTable from "../components/Market/CryptoMarketTable";
import { NewCryptoItem } from "../components/Market/types";
import useMergedCryptoList from "../hooks/useMergedCryptoList";
import HeaderFooterLayout from "../layouts/HeaderFooterLayout";

function MarketPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: mergedData, isLoading } = useMergedCryptoList();

  const gainers = useMemo(() =>[...mergedData].sort((a, b) =>parseFloat(b.priceChangePercent ?? "0") -parseFloat(a.priceChangePercent ?? "0")).slice(0, 5),[mergedData]);

  const losers = useMemo(
    () =>
      [...mergedData]
        .sort(
          (a, b) =>
            parseFloat(a.priceChangePercent ?? "0") -
            parseFloat(b.priceChangePercent ?? "0")
        )
        .slice(0, 5),
    [mergedData]
  );

  const newest = useMemo(
    () =>
      [...mergedData]
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))

        .slice(0, 5),
    [mergedData]
  );

  const mapToCryptoBoxItems = (data: NewCryptoItem[]) =>
    data.map((item) => {
      const changeValue = parseFloat(item.priceChangePercent ?? "0");
      const icon = item?.isFont ? 
        <i
          className={`cf cf-${item.symbol?.toLowerCase() || ""}`}
          style={{ color: item.color || "#000", fontSize: 24 }}
        />
       : 
        <img
          src={`https://api.payfa24.com/images/currency/${item.icon}`}
          alt={item.symbol || ""}
          className="w-6 h-6 rounded-full object-contain"
        />
      ;
      return {
        name: item.locale?.fa?.name || item.name || item.symbol || "Unknown",
        symbol: item.symbol || "",
        buyPrice: Number(item.priceBuy) || 0,
        change: changeValue,
        isPositive: changeValue >= 0,
        icon,
      };
    });

  return (
    <div className="bg-white1">
      <HeaderFooterLayout>
        <div className="container-style mx-auto px-1 sm:px-4 lg:px-10">
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
              items={mapToCryptoBoxItems(gainers)}
              isLoading={isLoading}
            />

            <CryptoBox
              title="بیشترین افت"
              iconTop={<VectorDown />}
              items={mapToCryptoBoxItems(losers)}
              isLoading={isLoading}
            />

            <CryptoBox
              title="جدیدترین‌ها"
              iconTop={<FireTopIcon />}
              items={mapToCryptoBoxItems(newest)}
              isLoading={isLoading}
            />
          </div>

         
          <div >
            <CryptoMarketTable
              data={mergedData}
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
