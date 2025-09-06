import { useState } from "react";

import HeaderFooterLayout from "../layouts/HeaderFooterLayout";
import CryptoBox from "../Components/Market/CryptoBox";
import BTCIcon from "../assets/icons/market/CryptoBox/BTCIcon";
import GRTIcon from "../assets/icons/market/CryptoBox/GRTIcon";
import CryptoMarketTable from "../Components/Market/CryptoMarketTable";
import VOLIcon from "../assets/icons/market/CryptoBox/VOLIcon";
import TKOIcon from "../assets/icons/market/CryptoBox/TKOIcon";
import USDTIcon from "../assets/icons/market/CryptoBox/USDTIcon";
import ETHIcon from "../assets/icons/market/CryptoBox/ETHIcon";
import XVSIcon from "../assets/icons/market/CryptoBox/XVSIcon";
import NEXOIcon from "../assets/icons/market/CryptoBox/NEXOIcon";
import VectorDown from "../assets/icons/market/CryptoBox/VectorDownIcon";
import VectorUp from "../assets/icons/market/CryptoBox/VectorUpIcon";
import FireTopIcon from "../assets/icons/market/CryptoBox/FireTopIcon";
import TravellaIcon from "../assets/icons/market/CryptoMarketTable.tsx/TravellaIcon";
import TURNIcon from "../assets/icons/market/CryptoMarketTable.tsx/TURNIcon";
import TravelaIcon from "../assets/icons/Home/CryptoTableIcon/TravelaIcon";
import AltraPurple from "../assets/icons/market/CryptoMarketTable.tsx/AltraPurple";
import SOLIcon from "../assets/icons/market/CryptoBox/SOLIcon";




const sampleData = [
  {
    name: "تراولا",
    symbol: "AVA",
    priceUSDT: 48703,
    buyPrice: 48703,
    sellPrice: 48703,
    change24h: +1.3,
    logo: <TravellaIcon />,
  },
    {
    name:"توکو توکن",
    symbol: "TKO",
    priceUSDT: 3200,
    buyPrice: 3200,
    sellPrice: 3200,
    change24h: -1.2,
    logo: <TKOIcon />,
  },
  {
    name:"تورن",
    symbol: "TURN",
    priceUSDT: 3200,
    buyPrice: 3200,
    sellPrice: 3200,
    change24h: -1.2,
    logo: <TURNIcon />,
  },
    {
    name: "تراولا",
    symbol: "AVA",
    priceUSDT: 48703,
    buyPrice: 48703,
    sellPrice: 48703,
    change24h: +1.3,
    logo: <TravelaIcon />,
  },
  
    {
    name: "آلترا",
    symbol: "UOS",
    priceUSDT: 48703,
    buyPrice: 48703,
    sellPrice: 48703,
    change24h: +1.3,
    logo: <AltraPurple />,
  },
  {
    name:"وی چاین",
    symbol: "UOS",
    priceUSDT: 3200,
    buyPrice: 3200,
    sellPrice: 3200,
    change24h: -1.2,
    logo: <BTCIcon />,
  },
  {
    name: "تراولا",
    symbol: "AVA",
    priceUSDT: 48703,
    buyPrice: 48703,
    sellPrice: 48703,
    change24h: +1.3,
    logo: <TravelaIcon />,
  },
  
    {
    name: "آلترا",
    symbol: "UOS",
    priceUSDT: 48703,
    buyPrice: 48703,
    sellPrice: 48703,
    change24h: +1.3,
    logo: <AltraPurple />,
  },
  {
    name:"وی چاین",
    symbol: "UOS",
    priceUSDT: 3200,
    buyPrice: 3200,
    sellPrice: 3200,
    change24h: -1.2,
    logo: <BTCIcon />,
  },
  {
    name: "آلترا",
    symbol: "UOS",
    priceUSDT: 48703,
    buyPrice: 48703,
    sellPrice: 48703,
    change24h: +1.3,
    logo: <AltraPurple />,
  },
  {
    name: "ولی",
    symbol: "UOS",
    priceUSDT: 3200,
    buyPrice: 3200,
    sellPrice: 3200,
    change24h: -1.2,
    logo: <VOLIcon />,
  },
 
];



function MarketPage() {

 const [activeTab, setActiveTab] = useState(0); 
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

          <div className="hidden lg:flex gap-6 justify-start flex-row-reverse">
            <CryptoBox
              title="بیشترین افت"
              iconTop={<VectorDown />}
              items={[
                {
                  name: "بیت‌کوین",
                  symbol: "BTC",
                  icon: <BTCIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "+9.03%",
                  isPositive: true,
                },
                {
                  name: "گراف",
                  symbol: "GRT",
                  icon: <GRTIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "سولانا",
                  symbol: "SOL",
                  icon: <SOLIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "وای",
                  symbol: "VOL",
                  icon: <VOLIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "توکو توکن",
                  symbol: "TKO",
                  icon: <TKOIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
              ]}
            />
            <CryptoBox
              title="بیشترین رشد"
              iconTop={<VectorUp />}
              items={[
                {
                  name: "تتر",
                  symbol: "BTC",
                  icon: <USDTIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "+9.03%",
                  isPositive: true,
                },
                {
                  name: "اتریوم",
                  symbol: "ETH",
                  icon: <ETHIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "سولانا",
                  symbol: "ETH",
                  icon: <SOLIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "ونوس",
                  symbol: "XVS",
                  icon: <XVSIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "نکسو",
                  symbol: "NEX",
                  icon: <NEXOIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
              ]}
            />
            <CryptoBox
              title="جدیدترین‌ها"
              iconTop={<FireTopIcon />}
              items={[
                {
                  name: "تتر",
                  symbol: "BTC",
                  icon: <USDTIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "+9.03%",
                  isPositive: true,
                },
                {
                  name: "اتریوم",
                  symbol: "ETH",
                  icon: <ETHIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "سولانا",
                  symbol: "ETH",
                  icon: <SOLIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "ونوس",
                  symbol: "XVS",
                  icon: <XVSIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
                {
                  name: "نکسو",
                  symbol: "NEX",
                  icon: <NEXOIcon />,
                  price: "۴۸۹,۷۰۳ تومان",
                  change: "-1.55%",
                  isPositive: false,
                },
              ]}
            />
          </div>
          <div className="pb-[126px]">
            <CryptoMarketTable
              data={sampleData}
              active={activeTab}
              setActive={setActiveTab}
            />
          </div>
        </div>
      </HeaderFooterLayout>
    </div>
  );
}

export default MarketPage;
