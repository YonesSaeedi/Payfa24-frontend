
import { useState } from "react";

import HeaderFooterLayout from "../layouts/HeaderFooterLayout";
import img1 from "../assets/images/Home/image copy (1).jpg";

import WalletCard from "../Components/Home/WalletCard/WalletCard";
import IdentityCard from "../Components/Home/IdentityCard";
import PosterSlider from "../Components/Home/PosterSlider";
import InvitationCard from "../Components/Home/InvitationCard";
import SyncSlider from "../Components/Home/SynchronizedSliders";
import CryptoTable from "../Components/Home/CryptoTable";
import QuestionBox from "../Components/Home/QuestionBox/QuestionBox";
import FireIcon from "../assets/Icons/Home/SynchronizedSliders/fireIcon";
import TrendDownIcon from "../assets/Icons/Home/SynchronizedSliders/TrendDownIcon";
import YoYowIcon from "../assets/Icons/Home/SynchronizedSlidersIcon/YoYowIcon";
import TrinityIcon from "../assets/Icons/Home/SynchronizedSlidersIcon/TrinityIcon";
import TitanIcon from "../assets/Icons/Home/SynchronizedSlidersIcon/TitanIcon";
import WalletIcon from "../assets/Icons/header/WalletIcon";
import TetherIcon from "../assets/icons/Home/WalletCardIcon/TetherIcon";
import TokoTokenIcon from "../assets/Icons/Home/CryptoTable/TokoTokenIcon";
import TornIcon from "../assets/Icons/Home/CryptoTable/TornIcon";
import TravelaIcon from "../assets/Icons/Home/CryptoTableIcon/TravelaIcon";
import UltraIcon from "../assets/Icons/Home/CryptoTable/UltraIconIcon";
import VeChainIcon from "../assets/Icons/Home/CryptoTable/VeChainIcon";
import VeilIcon from "../assets/Icons/Home/CryptoTable/VeilIcon";

const boxes = [
  {
    header: "تازه های بازار",
    headerIcon: <FireIcon/>,
    bgShape: "../../src/assets/images/Home/SynchronizedSlidersIcon/Yoyow (Yoyow).png",
    slides: [
      {
        title: "یویوو",
        subtitle: "YOYOW",
        price: 88901,
        changePct: 23.54,
        iconSrc: <YoYowIcon/>,
      },
      {
        title: "یویوو",
        subtitle: "YOYOW",
        price: 91000,
        changePct: 24.12,
        iconSrc: <YoYowIcon />,
      },
    ],
  },
  {
    header: "بیشترین افت قیمت",
    headerIcon: <TrendDownIcon />,
    bgShape: "../../src/assets/images/Home/SynchronizedSlidersIcon/Trinity Network Credit (Tnc).png",
    slides: [
      {
        title: "ترینیتی نتورک",
        subtitle: "TNC",
        price: 88901,
        changePct: -23.54,
        iconSrc: <TrinityIcon/>,
      },
      {
        title: "ترینیتی نتورک",
        subtitle: "TNC",
        price: 85000,
        changePct: -25.12,
        iconSrc: <TrinityIcon />,
      },
    ],
  },
  {
    header: "بیشترین افزایش قیمت",
    headerIcon: <TrendDownIcon/>,
    bgShape: "../../src/assets/images/Home/SynchronizedSlidersIcon/TitanSwap (TITAN).png",
    slides: [
      {
        title: "تیتان سوآپ",
        subtitle: "TITAN",
        price: 88901,
        changePct: 23.54,
        iconSrc: <TitanIcon />,
      },
      {
        title: "یویوو",
        subtitle: "YOYOW",
        price: 91000,
        changePct: 24.12,
        iconSrc: <TitanIcon />,
      },
    ],
  },
  {
    header: "بیشترین معامله",
    headerIcon: <WalletIcon/>,
    bgShape: "../../src/assets/images/Home/SynchronizedSlidersIcon/Tetherbackground (USDT).png",
    slides: [
      {
        title: "تتر",
        subtitle: "USDT",
        price: 88901,
        changePct: 23.54,
        iconSrc: <TetherIcon />,
      },
      {
        title: "تتر",
        subtitle: "USDT",
        price: 91000,
        changePct: 24.12,
        iconSrc: <TetherIcon />,
      },
    ],
  },
];
//////////////

function HomePage() {
  const [active, setActive] = useState(0);
  const data = [
    {
      name: "ننننننننننننتوکو توکن",
      symbol: "TKO",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -12,
      logo: <TokoTokenIcon/>,
    },
    {
      name: "تورِن",
      symbol: "TURN",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: +12,
      logo: <TornIcon />,
    },
    {
      name: "تراولا",
      symbol: "AVA",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: +12,
      logo: <TravelaIcon />,
    },
    {
      name: "آلترا",
      symbol: "UOS",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -12,
      logo: <UltraIcon/>,
    },
    {
      name: "وی چین",
      symbol: "VET",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -12,
      logo: <VeChainIcon/>,
    },
    {
      name: "ولی",
      symbol: "VAI",
      priceUSDT: 489.7,
      sellPrice: 489700,
      buyPrice: 485000,
      change24h: -12,
      logo: <VeilIcon />,
    },
  ];

  const slidesData = [
    {
      title: "کارمزد رایگان",
      subtitle: "بر روی معاملات بیت‌کوین",
      buttonText: "ورود به دنیای رمز ارز",
      imageSrc: img1,
    },
    {
      title: "آینده مالی خود را بسازید",
      subtitle: "با سرمایه‌گذاری روی ارزهای دیجیتال",
      buttonText: "شروع کنید",
      imageSrc: "../assets/images/Home/Screenshot 2025-08-20 141154.png",
    },
    {
      title: "سریع و امن",
      subtitle: "انتقال ارز در کمترین زمان",
      buttonText: "ثبت‌نام",
      imageSrc: "../assets/images/Home/Screenshot 2025-08-20 141154.png",
    },
  ];

  return (
    <div>
      <HeaderFooterLayout>
        <div className="bg-white1 text-text">
          <div className="container-style" >
            <div className="pt-8 pb-12 flex flex-col lg:flex-row-reverse justify-between gap-4 bg-backgroundMain">
              <WalletCard balance={844000} changeAmount={34000} change={12.4} />
              <IdentityCard
                title="احراز هویت سطح 1"
                items={["مشخصات فردی", "تصویر مدرک شناسایی"]}
                accesses={["مشاهده قیمت‌ها", "خرید و فروش رمز ارزها"]}
                onClick={() => console.log("start identity")}
              />
            </div>

            <div className="flex flex-col lg:flex-row-reverse justify-between gap-4 pb-10 ">
              <PosterSlider slides={slidesData} />
              <InvitationCard/>
            </div>

            <div id="SyncSlider" className="pt-12 pb-12">
              <SyncSlider boxes={boxes} />
            </div>

            <div className="w-full pt-7">
              <CryptoTable data={data} active={active} setActive={setActive} />
            </div>
            <div id="qustionBox" className="pt-12 lg:pb-28 pb-14">
              <QuestionBox />
            </div>
          </div>
        </div>

      </HeaderFooterLayout>
    </div>
  );
}

export default HomePage;
